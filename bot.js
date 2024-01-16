// ------------------------------------
// 1. DEPENDENCIES
// ------------------------------------

import dotenv from 'dotenv';
import ethers from 'ethers';
import {
  isStocksOpen,
  isForexOpen,
  isIndicesOpen,
  isCommoditiesOpen,
  fetchOpenPairTradesRaw,
  getLiquidationPrice,
  withinMaxGroupOi,
  getSpreadWithPriceImpactP,
  getCurrentOiWindowId,
} from '@gainsnetwork/sdk';
import Web3 from 'web3';
import { WebSocket } from 'ws';
import { DateTime } from 'luxon';
import fetch from 'node-fetch';
import { Contract, Provider } from 'ethcall';
import { createLogger } from './logger.js';
import { default as abis } from './abis.js';
import { NonceManager } from './NonceManager.js';
import {
  GAS_MODE,
  CHAIN_IDS,
  NETWORKS,
  isStocksGroup,
  isForexGroup,
  isIndicesGroup,
  isCommoditiesGroup,
  MAX_OPEN_NEGATIVE_PNL_P,
  COLLATERAL_CONFIG,
  COLLATERAL,
} from './constants.js';
import {
  transformRawTrades,
  buildTradeIdentifier,
  transformLastUpdated,
  convertOpenInterest,
  convertTrade,
  convertTradeInfo,
  convertTradeInitialAccFees,
  packNft,
  convertOiWindows,
  increaseWindowOi,
  decreaseWindowOi,
  transferOiWindows,
  updateWindowsDuration,
  updateWindowsCount,
} from './utils.js';

// Make errors JSON serializable
Object.defineProperty(Error.prototype, 'toJSON', {
  value: function () {
    const tempError = {};
    const errorProperties = Object.getOwnPropertyNames(this);

    errorProperties.forEach(function (key) {
      tempError[key] = this[key];
    }, this);

    return JSON.stringify(tempError, errorProperties);
  },
  configurable: true,
  writable: true,
});

// Load base .env file first
dotenv.config();

// If there's a specific NODE_ENV set, attempt to load that environment specific .env file
if (process.env.NODE_ENV) {
  const environmentSpecificFile = `.env.${process.env.NODE_ENV}`;

  dotenv.config({
    path: environmentSpecificFile,
    override: true,
  });
}

const appLogger = createLogger('BOT', process.env.LOG_LEVEL);
let executionStats = {
  startTime: new Date(),
};

// -----------------------------------------
// 2. GLOBAL VARIABLES
// -----------------------------------------

const TEST_COLLAT_KEY = 'tDAI';

let allowedLink = { storage: false, rewards: false },
  currentlySelectedWeb3ClientIndex = -1,
  currentlySelectedWeb3Client = null,
  eventSubTrading = null,
  eventSubCallbacks = null,
  eventSubBorrowingFeesContext = { vault: null, borrowing: null },
  web3Clients = [],
  priorityTransactionMaxPriorityFeePerGas = 50,
  standardTransactionGasFees = { maxFee: 31, maxPriorityFee: 31 },
  spreadsP = [],
  openInterests = [],
  pairs = [],
  pairDepths = [],
  knownOpenTrades = null,
  tradesLastUpdated = new Map(),
  triggeredOrders = new Map(),
  pairMaxLeverage = new Map(),
  multiCollatContract, // skipping diamond name for sake of brevity
  collateralContracts = {
    DAI: { storage: null, trading: null, callbacks: null, vault: null, nftRewards: null, borrowingFees: null, aggregator: null },
  },
  storageContract,
  aggregatorContract, // for token price
  tradingContract,
  callbacksContract,
  vaultContract,
  nftRewardsContract,
  borrowingFeesContract,
  maxTradesPerPair = 0,
  linkContract,
  gasPriceBn = new Web3.utils.BN(0.1 * 1e9),
  triggerRetries = new Map(),
  oiWindows = {},
  oiWindowsSettings = { startTs: 0, windowsDuration: 0, windowsCount: 0 },
  tokenPrices = { DAI: 1, USDC: 1 }; // @todo update on schedule

// --------------------------------------------
// 3. INIT ENV VARS & CHECK LINK ALLOWANCE
// --------------------------------------------

appLogger.info('Welcome to the gTrade NFT bot!');

// Parse non-fixed string configuration constants from environment variables up front
const MAX_FEE_PER_GAS_WEI_HEX =
    (process.env.MAX_GAS_PRICE_GWEI ?? '').length > 0 ? Web3.utils.toHex(parseInt(process.env.MAX_GAS_PRICE_GWEI, 10) * 1e9) : 0,
  MAX_GAS_PER_TRANSACTION_HEX = Web3.utils.toHex(parseInt(process.env.MAX_GAS_PER_TRANSACTION, 10)),
  EVENT_CONFIRMATIONS_MS = parseFloat(process.env.EVENT_CONFIRMATIONS_SEC) * 1000,
  AUTO_HARVEST_MS = parseFloat(process.env.AUTO_HARVEST_SEC) * 1000,
  FAILED_ORDER_TRIGGER_TIMEOUT_MS =
    (process.env.FAILED_ORDER_TRIGGER_TIMEOUT_SEC ?? '').length > 0
      ? parseFloat(process.env.FAILED_ORDER_TRIGGER_TIMEOUT_SEC) * 1000
      : 60 * 1000,
  PRIORITY_GWEI_MULTIPLIER = parseFloat(process.env.PRIORITY_GWEI_MULTIPLIER),
  MIN_PRIORITY_GWEI = parseFloat(process.env.MIN_PRIORITY_GWEI),
  OPEN_TRADES_REFRESH_MS =
    (process.env.OPEN_TRADES_REFRESH_SEC ?? '').length > 0 ? parseFloat(process.env.OPEN_TRADES_REFRESH_SEC) * 1000 : 120,
  GAS_REFRESH_INTERVAL_MS =
    (process.env.GAS_REFRESH_INTERVAL_SEC ?? '').length > 0 ? parseFloat(process.env.GAS_REFRESH_INTERVAL_SEC) * 1000 : 3,
  WEB3_STATUS_REPORT_INTERVAL_MS =
    (process.env.WEB3_STATUS_REPORT_INTERVAL_SEC ?? '').length > 0
      ? parseFloat(process.env.WEB3_STATUS_REPORT_INTERVAL_SEC) * 1000
      : 30 * 1000,
  // Concurrent message processing is now enabled by default. You can turn it off by setting ENABLE_CONCURRENT_PRICE_UPDATE_PROCESSING=false in your .env file
  ENABLE_CONCURRENT_PRICE_UPDATE_PROCESSING = process.env.ENABLE_CONCURRENT_PRICE_UPDATE_PROCESSING
    ? process.env.ENABLE_CONCURRENT_PRICE_UPDATE_PROCESSING === 'true'
    : true,
  USE_MULTICALL = process.env.USE_MULTICALL ? process.env.USE_MULTICALL === 'true' : true,
  l1BlockFetchIntervalMs = process.env.L1_BLOCK_FETCH_INTERVAL_MS ? +process.env.L1_BLOCK_FETCH_INTERVAL_MS : undefined,
  MAX_RETRIES = process.env.MAX_RETRIES && !isNaN(+process.env.MAX_RETRIES) ? parseInt(process.env.MAX_RETRIES) : -1;

const CHAIN_ID = process.env.CHAIN_ID !== undefined ? parseInt(process.env.CHAIN_ID, 10) : CHAIN_IDS.POLYGON; // Polygon chain id
const CHAIN = process.env.CHAIN ?? 'mainnet';
const NETWORK = NETWORKS[CHAIN_ID];
const TRADE_TYPE = { MARKET: 0, LIMIT: 1 };

const borrowingFeesContext = {
  groups: [],
  pairs: [],
};

if (!NETWORK) {
  throw new Error(`Invalid chain id: ${CHAIN_ID}`);
}

const DRY_RUN_MODE = process.env.DRY_RUN_MODE === 'true';

async function checkLinkAllowance(contract) {
  try {
    const allowance = await linkContract.methods.allowance(process.env.PUBLIC_KEY, contract).call();
    const key = contract === process.env.STORAGE_ADDRESS ? 'storage' : 'rewards';

    if (parseFloat(allowance) > 0) {
      allowedLink[key] = true;
      appLogger.info(`[${key}] LINK allowance OK.`);
    } else {
      appLogger.info(`[${key}] LINK not allowed, approving now.`);

      const tx = createTransaction({
        to: linkContract.options.address,
        data: linkContract.methods
          .approve(contract, '115792089237316195423570985008687907853269984665640564039457584007913129639935')
          .encodeABI(),
      });

      try {
        const signed = await currentlySelectedWeb3Client.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);

        await currentlySelectedWeb3Client.eth.sendSignedTransaction(signed.rawTransaction);

        appLogger.info(`[${key}] LINK successfully approved.`);
        allowedLink[key] = true;
      } catch (error) {
        appLogger.error(`[${key}] LINK approve transaction failed!`, error);

        throw error;
      }
    }
  } catch {
    setTimeout(() => {
      checkLinkAllowance(contract);
    }, 5 * 1000);
  }
}

// -----------------------------------------
// 4. WEB3 PROVIDER
// -----------------------------------------

const WEB3_PROVIDER_URLS = process.env.WSS_URLS.split(',');
let currentWeb3ClientBlocks = new Array(WEB3_PROVIDER_URLS.length).fill(0);
let currentL1Blocks = new Array(WEB3_PROVIDER_URLS.length).fill(0),
  prevL1BlockFetchTimeMs = 0,
  latestL2Block = 0,
  latestL1Block = null;

async function setCurrentWeb3Client(newWeb3ClientIndex) {
  appLogger.info('Switching web3 client to ' + WEB3_PROVIDER_URLS[newWeb3ClientIndex] + ' (#' + newWeb3ClientIndex + ')...');

  const executionStartTime = performance.now();
  const newWeb3Client = web3Clients[newWeb3ClientIndex];

  multiCollatContract = new newWeb3Client.eth.Contract(abis.MULTI_COLLAT_DIAMOND, process.env.MULTI_COLLAT_DIAMOND_ADDRESS);
  storageContract = new newWeb3Client.eth.Contract(abis.STORAGE, process.env.STORAGE_ADDRESS);

  // Retrieve all necessary details from the storage contract
  const [aggregatorAddress, callbacksAddress, tradingAddress, vaultAddress, linkAddress] = await Promise.all([
    storageContract.methods.priceAggregator().call(),
    storageContract.methods.callbacks().call(),
    storageContract.methods.trading().call(),
    storageContract.methods.vault().call(),
    storageContract.methods.linkErc677().call(),
  ]);

  callbacksContract = new newWeb3Client.eth.Contract(abis.CALLBACKS, callbacksAddress);
  tradingContract = new newWeb3Client.eth.Contract(abis.TRADING, tradingAddress);
  vaultContract = new newWeb3Client.eth.Contract(abis.VAULT, vaultAddress);
  // pairInfosContract = new newWeb3Client.eth.Contract(abis.PAIR_INFOS, process.env.PAIR_INFOS_ADDRESS);  @todo remove

  aggregatorContract = new newWeb3Client.eth.Contract(abis.AGGREGATOR, aggregatorAddress);

  const [nftRewardsAddress, borrowingFeesAddress] = await Promise.all([
    callbacksContract.methods.nftRewards().call(),
    callbacksContract.methods.borrowingFees().call(),
  ]);

  borrowingFeesContract = new newWeb3Client.eth.Contract(abis.BORROWING_FEES, borrowingFeesAddress);
  // pairsStorageContract = new newWeb3Client.eth.Contract(abis.PAIRS_STORAGE, pairsStorageAddress);   @todo remove
  nftRewardsContract = new newWeb3Client.eth.Contract(abis.NFT_REWARDS, nftRewardsAddress);

  linkContract = new newWeb3Client.eth.Contract(abis.LINK, linkAddress);

  const wasFirstClientSelection = currentlySelectedWeb3Client === null;

  // Update the globally selected provider with this new provider
  currentlySelectedWeb3ClientIndex = newWeb3ClientIndex;
  currentlySelectedWeb3Client = newWeb3Client;

  // Subscribe to events using the new provider
  watchLiveTradingEvents();

  var startFetchingLatestGasPricesPromise = null;

  // If no client was previously selected, start fetching gas prices
  if (wasFirstClientSelection) {
    startFetchingLatestGasPricesPromise = startFetchingLatestGasPrices();
  }

  await Promise.all([nonceManager.initialize(), startFetchingLatestGasPricesPromise]);

  // Fire and forget refreshing of data using new provider
  fetchTradingVariables();
  fetchOpenTrades();
  checkContractApprovals([process.env.STORAGE_ADDRESS, nftRewardsAddress]);

  appLogger.info('New web3 client selection completed. Took: ' + (performance.now() - executionStartTime) + 'ms');
}

async function checkContractApprovals(addresses = [process.env.STORAGE_ADDRESS]) {
  for (const contract of addresses) {
    await checkLinkAllowance(contract);
  }
}

function createWeb3Provider(providerUrl) {
  const provider = new Web3.providers.WebsocketProvider(providerUrl, {
    clientConfig: {
      keepalive: true,
      keepaliveInterval: 30 * 1000,
    },
    reconnect: {
      auto: true,
      delay: 1000,
      onTimeout: true,
    },
  });

  provider.on('connect', () => {
    if (provider.connected) {
      appLogger.info(`Connected to provider ${providerUrl}`);
    }
  });

  provider.on('reconnect', () => {
    appLogger.info(`Provider ${providerUrl} is reconnecting...`);
  });

  provider.on('error', (error) => {
    appLogger.info(`Provider error: ${providerUrl}`, error);
  });

  return provider;
}

function createWeb3Client(providerIndex, providerUrl) {
  const provider = createWeb3Provider(providerUrl);
  const web3Client = new Web3(provider);
  web3Client.eth.handleRevert = true;
  web3Client.eth.defaultAccount = process.env.PUBLIC_KEY;
  web3Client.eth.defaultChain = CHAIN;

  web3Client.eth.subscribe('newBlockHeaders').on('data', async (header) => {
    const newBlockNumber = header.number;

    if (newBlockNumber === null) {
      appLogger.debug(`Received unfinished block from provider ${providerUrl}; ignoring...`);

      return;
    }

    if (newBlockNumber > latestL2Block) {
      latestL2Block = newBlockNumber;
    }

    currentWeb3ClientBlocks[providerIndex] = newBlockNumber;

    if (l1BlockFetchIntervalMs !== undefined && Date.now() - prevL1BlockFetchTimeMs > l1BlockFetchIntervalMs) {
      prevL1BlockFetchTimeMs = Date.now();
      try {
        const block = await web3Client.eth.getBlock(newBlockNumber);
        const _currentL1BlockNumber = Web3.utils.hexToNumber(block.l1BlockNumber);

        if (_currentL1BlockNumber > latestL1Block) latestL1Block = _currentL1BlockNumber;

        if (currentL1Blocks[providerIndex] !== _currentL1BlockNumber) {
          currentL1Blocks[providerIndex] = _currentL1BlockNumber;
          appLogger.debug(`New L1 block received ${_currentL1BlockNumber} from provider ${providerUrl}...`);
        }
      } catch (error) {
        appLogger.error(`An error occurred attempting to fetch L1 block number for block ${newBlockNumber}`, {
          blockNumber: newBlockNumber,
          error,
        });
      }
    }

    appLogger.debug(`New block received ${newBlockNumber} from provider ${providerUrl}...`);

    if (currentlySelectedWeb3ClientIndex === providerIndex) {
      return;
    }

    const blockDiff =
      currentlySelectedWeb3ClientIndex === -1 ? newBlockNumber : newBlockNumber - currentWeb3ClientBlocks[currentlySelectedWeb3ClientIndex];

    // Check if this block is more recent than the currently selected provider's block by the max drift
    // and, if so, switch now
    if (blockDiff > MAX_PROVIDER_BLOCK_DRIFT) {
      appLogger.info(
        `Switching to provider ${providerUrl} #${providerIndex} because it is ${blockDiff} block(s) ahead of current provider (${newBlockNumber} vs ${currentWeb3ClientBlocks[currentlySelectedWeb3ClientIndex]})`
      );

      setCurrentWeb3Client(providerIndex);
    }
  });

  return web3Client;
}

const nonceManager = new NonceManager(
  process.env.PUBLIC_KEY,
  () => currentlySelectedWeb3Client,
  createLogger('NONCE_MANAGER', process.env.LOG_LEVEL)
);

for (var web3ProviderUrlIndex = 0; web3ProviderUrlIndex < WEB3_PROVIDER_URLS.length; web3ProviderUrlIndex++) {
  web3Clients.push(createWeb3Client(web3ProviderUrlIndex, WEB3_PROVIDER_URLS[web3ProviderUrlIndex]));
}

let MAX_PROVIDER_BLOCK_DRIFT =
  (process.env.MAX_PROVIDER_BLOCK_DRIFT ?? '').length > 0 ? parseInt(process.env.MAX_PROVIDER_BLOCK_DRIFT, 10) : 2;

if (MAX_PROVIDER_BLOCK_DRIFT < 1) {
  appLogger.warn(`MAX_PROVIDER_BLOCK_DRIFT is set to ${MAX_PROVIDER_BLOCK_DRIFT}; setting to minimum of 1.`);

  MAX_PROVIDER_BLOCK_DRIFT = 1;
}

setInterval(() => {
  if (currentlySelectedWeb3ClientIndex === -1) {
    appLogger.warn('No Web3 client has been selected yet!');
  } else {
    appLogger.info(`Current Web3 Client: ${currentlySelectedWeb3Client.currentProvider.url} (#${currentlySelectedWeb3ClientIndex})`);
  }

  executionStats = {
    ...executionStats,
    uptime: DateTime.now()
      .diff(DateTime.fromJSDate(executionStats.startTime), ['days', 'hours', 'minutes', 'seconds'])
      .toFormat("d'd'h'h'm'm's's'"),
  };

  appLogger.info(`Execution Stats:`, executionStats);
}, WEB3_STATUS_REPORT_INTERVAL_MS);

// -----------------------------------------
// 5. FETCH DYNAMIC GAS PRICE
// -----------------------------------------

async function startFetchingLatestGasPrices() {
  // Wait for the first to complete
  await doNextLatestGasPricesFetch();

  async function doNextLatestGasPricesFetch() {
    try {
      await fetchLatestGasPrices();
    } finally {
      // No matter what, schedule the next fetch
      setTimeout(async () => {
        doNextLatestGasPricesFetch().catch((error) => {
          appLogger.error(`An error occurred attempting to fetch latest gas prices; will be tried again in ${GAS_REFRESH_INTERVAL_MS}.`, {
            error,
          });
        });
      }, GAS_REFRESH_INTERVAL_MS);
    }
  }

  async function fetchLatestGasPrices() {
    appLogger.verbose('Fetching latest gas prices...');

    if (NETWORK.gasStationUrl) {
      try {
        const response = await fetch(NETWORK.gasStationUrl);
        const gasPriceData = await response.json();

        if (NETWORK.gasMode === GAS_MODE.EIP1559) {
          standardTransactionGasFees = {
            maxFee: Math.round(gasPriceData.standard.maxFee),
            maxPriorityFee: Math.round(gasPriceData.standard.maxPriorityFee),
          };

          priorityTransactionMaxPriorityFeePerGas = Math.round(
            Math.max(Math.round(gasPriceData.fast.maxPriorityFee) * PRIORITY_GWEI_MULTIPLIER, MIN_PRIORITY_GWEI)
          );
        } else {
          // TODO: Add support for legacy gas stations here
        }
      } catch (error) {
        appLogger.error('Error while fetching gas prices from gas station!', error);
      }
    } else {
      if (NETWORK.gasMode === GAS_MODE.EIP1559) {
        // TODO: Add support for EIP1159 provider fetching here
      } else if (NETWORK.gasMode === GAS_MODE.LEGACY) {
        const gasPrice = await currentlySelectedWeb3Client.eth.getGasPrice();
        gasPriceBn = new Web3.utils.BN(gasPrice);
      }
    }
  }
}

// -----------------------------------------
// 6. FETCH PAIRS
// -----------------------------------------

const FETCH_TRADING_VARIABLES_REFRESH_INTERVAL_MS =
  (process.env.FETCH_TRADING_VARIABLES_REFRESH_INTERVAL_SEC ?? '').length > 0
    ? parseFloat(process.env.FETCH_TRADING_VARIABLES_REFRESH_INTERVAL_SEC) * 1000
    : 60 * 1000;

let fetchTradingVariablesTimerId = null;
let currentTradingVariablesFetchPromise = null;

async function fetchTradingVariables() {
  appLogger.info('Fetching trading variables...');

  if (fetchTradingVariablesTimerId !== null) {
    appLogger.debug(`Canceling existing fetchTradingVariables timer id.`);

    clearTimeout(fetchTradingVariablesTimerId);
    fetchTradingVariablesTimerId = null;
  }

  const executionStart = performance.now();

  const pairsCount = await multiCollatContract.methods.pairsCount().call();

  if (currentTradingVariablesFetchPromise !== null) {
    appLogger.warn(`A current fetchTradingVariables call was already in progress, just awaiting that...`);

    return await currentTradingVariablesFetchPromise;
  }

  try {
    currentTradingVariablesFetchPromise = Promise.all([
      fetchPairs(pairsCount),
      fetchPairInfos(pairsCount),
      fetchBorrowingFees(),
      fetchOiWindows(pairsCount),
    ]);

    await currentTradingVariablesFetchPromise;
    appLogger.info(`Done fetching trading variables; took ${performance.now() - executionStart}ms.`);

    if (FETCH_TRADING_VARIABLES_REFRESH_INTERVAL_MS > 0) {
      fetchTradingVariablesTimerId = setTimeout(() => {
        fetchTradingVariablesTimerId = null;
        fetchTradingVariables();
      }, FETCH_TRADING_VARIABLES_REFRESH_INTERVAL_MS);
    }
  } catch (error) {
    appLogger.error('Error while fetching trading variables!', { error });

    fetchTradingVariablesTimerId = setTimeout(() => {
      fetchTradingVariablesTimerId = null;
      fetchTradingVariables();
    }, 2 * 1000);
  } finally {
    currentTradingVariablesFetchPromise = null;
  }

  async function fetchPairs(pairsCount) {
    const maxPerPair = await storageContract.methods.maxTradesPerPair().call();
    let pairsPromises = new Array(pairsCount);

    for (var i = 0; i < pairsCount; i++) {
      pairsPromises[i] = multiCollatContract.methods.pairsBackend(i).call();
    }

    pairs = await Promise.all(pairsPromises);
    const newSpreadsP = new Array(pairs.length);
    const newOpenInterests = new Array(pairs.length);

    await Promise.all(
      pairs.map(async (pair, pairIndex) => {
        const [openInterestLong, openInterestShort, openInterestMax] = await Promise.all([
          storageContract.methods.openInterestDai(pairIndex, 0).call(),
          storageContract.methods.openInterestDai(pairIndex, 1).call(),
          borrowingFeesContract.methods.getCollateralPairMaxOi(pairIndex).call(),
        ]);

        newOpenInterests[pairIndex] = {
          long: openInterestLong,
          short: openInterestShort,
          max: parseFloat(openInterestMax) + '', // already normalized
        };
        newSpreadsP[pairIndex] = pair['0'].spreadP;
      })
    );

    maxTradesPerPair = maxPerPair;
    spreadsP = newSpreadsP;
    openInterests = newOpenInterests;
  }

  async function fetchPairInfos(pairsCount) {
    const [depths, maxLeverage] = await Promise.all([
      multiCollatContract.methods.getPairDepths([...Array(parseInt(pairsCount)).keys()]).call(), // todo
      multiCollatContract.methods.getAllPairsRestrictedMaxLeverage().call(),
    ]);

    pairMaxLeverage = new Map(maxLeverage.map((l, idx) => [idx, parseInt(l)]));
    pairDepths = depths.map((value) => ({
      onePercentDepthAboveUsd: value.onePercentDepthAboveUsd,
      onePercentDepthBelowUsd: value.onePercentDepthBelowUsd,
    }));
  }

  async function fetchBorrowingFees() {
    const borrowingFeesInfo = await borrowingFeesContract.methods.getAllPairs().call();

    const [borrowingFees, maxOis] = [borrowingFeesInfo['0'], borrowingFeesInfo['1']];

    const borrowingFeesPairs = borrowingFees.map((value, idx) => ({
      feePerBlock: parseFloat(value.feePerBlock) / 1e10,
      accFeeLong: parseFloat(value.accFeeLong) / 1e10,
      accFeeShort: parseFloat(value.accFeeShort) / 1e10,
      accLastUpdatedBlock: parseInt(value.accLastUpdatedBlock),
      feeExponent: value.feeExponent,
      maxOi: parseFloat(maxOis[idx].max) / 1e10 || 0,
      groups: value.groups.map((value) => ({
        groupIndex: parseInt(value.groupIndex),
        initialAccFeeLong: parseFloat(value.initialAccFeeLong) / 1e10,
        initialAccFeeShort: parseFloat(value.initialAccFeeShort) / 1e10,
        prevGroupAccFeeLong: parseFloat(value.prevGroupAccFeeLong) / 1e10,
        prevGroupAccFeeShort: parseFloat(value.prevGroupAccFeeShort) / 1e10,
        pairAccFeeLong: parseFloat(value.pairAccFeeLong) / 1e10,
        pairAccFeeShort: parseFloat(value.pairAccFeeShort) / 1e10,
        block: parseInt(value.block),
      })),
    }));
    const borrowingFeesGroupIds = [
      ...new Set(borrowingFeesPairs.map((value) => value.groups.map((value) => value.groupIndex)).flat()),
    ].sort((a, b) => a - b);

    const borrowingFeesGroupsInfo =
      borrowingFeesGroupIds.length > 0
        ? await borrowingFeesContract.methods
            .getGroups(Array.from(Array(+borrowingFeesGroupIds[borrowingFeesGroupIds.length - 1] + 1).keys()))
            .call()
        : [];

    const [borrowingFeesGroups, groupExponents] = [borrowingFeesGroupsInfo['0'], borrowingFeesGroupsInfo['1']];
    borrowingFeesContext.pairs = borrowingFeesPairs;
    borrowingFeesContext.groups = borrowingFeesGroups.map((value, idx) => ({
      oiLong: parseFloat(value.oiLong) / 1e10,
      oiShort: parseFloat(value.oiShort) / 1e10,
      feePerBlock: parseFloat(value.feePerBlock) / 1e10,
      accFeeLong: parseFloat(value.accFeeLong) / 1e10,
      accFeeShort: parseFloat(value.accFeeShort) / 1e10,
      accLastUpdatedBlock: parseInt(value.accLastUpdatedBlock),
      maxOi: parseFloat(value.maxOi) / 1e10,
      feeExponent: parseInt(groupExponents[idx]) || 1,
    }));
  }
  async function fetchOiWindows(pairLength) {
    const { startTs, windowsDuration, windowsCount } = await multiCollatContract.methods.getOiWindowsSettings().call();

    oiWindowsSettings = {
      startTs: parseFloat(startTs),
      windowsDuration: parseFloat(windowsDuration),
      windowsCount: parseFloat(windowsCount),
    };

    const currWindowId = getCurrentOiWindowId(oiWindowsSettings);

    // Always fetch max window count
    const windowsToCheck = [...Array(5).keys()].map((i) => currWindowId - i).filter((v) => v > -1);

    const oiWindowsTemp = (
      await Promise.all(
        [...Array(parseInt(pairLength)).keys()].map((_, pairIndex) =>
          multiCollatContract.methods
            .getOiWindows(oiWindowsSettings.windowsDuration, pairIndex, windowsToCheck)
            .call()
            .then((r) => r.map((w) => ({ oiLongUsd: w.oiLongUsd, oiShortUsd: w.oiShortUsd })))
        )
      )
    ).map((pairWindows) => pairWindows.reduce((acc, curr, i) => ({ ...acc, [windowsToCheck[i]]: curr }), {}));

    oiWindows = convertOiWindows(oiWindowsTemp);
  }
}

// -----------------------------------------
// 8. LOAD OPEN TRADES
// -----------------------------------------

function buildTriggerIdentifier(collateral, trader, pairIndex, index, limitType) {
  return `trigger://${collateral}/${trader}/${pairIndex}/${index}[lt=${limitType}]`;
}

let fetchOpenTradesRetryTimerId = null;

async function fetchOpenTrades() {
  appLogger.info('Fetching open trades...');
  try {
    if (spreadsP.length === 0) {
      appLogger.warn('Spreads are not yet loaded; will retry shortly!');

      scheduleRetryFetchOpenTrades();

      return;
    }

    const start = performance.now();

    const [openLimitOrders, pairTrades] = await Promise.all([fetchOpenLimitOrders(), fetchOpenPairTrades()]);

    const newOpenTrades = new Map(
      openLimitOrders
        .concat(pairTrades)
        .map((trade) => [
          buildTradeIdentifier(TEST_COLLAT_KEY, trade.trader, trade.pairIndex, trade.index, trade.openPrice === undefined),
          trade,
        ])
    );

    const newTradesLastUpdated = new Map(await populateTradesLastUpdated(openLimitOrders, pairTrades, USE_MULTICALL));

    knownOpenTrades = newOpenTrades;
    tradesLastUpdated = newTradesLastUpdated;

    appLogger.info(`Fetched ${knownOpenTrades.size} total open trade(s) in ${performance.now() - start}ms.`);

    // Check if we're supposed to auto-refresh open trades and if so, schedule the next refresh
    if (OPEN_TRADES_REFRESH_MS !== 0) {
      appLogger.debug(`Scheduling auto-refresh of open trades in for ${OPEN_TRADES_REFRESH_MS}ms from now.`);

      setTimeout(() => fetchOpenTrades(), OPEN_TRADES_REFRESH_MS);
    } else {
      appLogger.info(
        `Auto-refresh of open trades is disabled (OPEN_TRADES_REFRESH=0); will only synchronize based on blockchain events from here out!`
      );
    }
  } catch (error) {
    appLogger.error('Error fetching open trades!', error);

    scheduleRetryFetchOpenTrades();
  }

  function scheduleRetryFetchOpenTrades() {
    if (fetchOpenTradesRetryTimerId !== null) {
      appLogger.debug('Already scheduled retry fetching open trades; will retry shortly!');

      return;
    }

    fetchOpenTradesRetryTimerId = setTimeout(() => {
      fetchOpenTradesRetryTimerId = null;
      fetchOpenTrades();
    }, 2 * 1000);
  }

  async function fetchOpenLimitOrders() {
    appLogger.info('Fetching open limit orders...');

    const openLimitOrders = await storageContract.methods.getOpenLimitOrders().call();

    const openLimitOrdersWithTypes = await Promise.all(
      openLimitOrders.map(async (olo) => {
        const [type, tradeData] = await Promise.all([
          nftRewardsContract.methods.openLimitOrderTypes(olo.trader, olo.pairIndex, olo.index).call(),
          callbacksContract.methods.tradeData(olo.trader, olo.pairIndex, olo.index, 1).call(),
        ]);

        return {
          ...olo,
          type,
          maxSlippageP: parseFloat(tradeData.maxSlippageP.toString()) / 1e10 || 1,
        };
      })
    );

    appLogger.info(`Fetched ${openLimitOrdersWithTypes.length} open limit order(s).`);

    return openLimitOrdersWithTypes;
  }

  async function fetchOpenPairTrades() {
    appLogger.info('Fetching open pair trades...');

    const ethersProvider = new ethers.providers.WebSocketProvider(currentlySelectedWeb3Client.currentProvider.connection._url);

    const ethersMultiCollat = new ethers.Contract(
      multiCollatContract.options.address,
      multiCollatContract.options.jsonInterface,
      ethersProvider
    );
    const ethersStorage = new ethers.Contract(storageContract.options.address, storageContract.options.jsonInterface, ethersProvider);
    const ethersBorrowingFees = new ethers.Contract(
      borrowingFeesContract.options.address,
      borrowingFeesContract.options.jsonInterface,
      ethersProvider
    );
    const ethersCallbacks = new ethers.Contract(callbacksContract.options.address, callbacksContract.options.jsonInterface, ethersProvider);

    const openTradesRaw = await fetchOpenPairTradesRaw(
      {
        gnsMultiCollatDiamond: ethersMultiCollat,
        gfarmTradingStorageV5: ethersStorage,
        gnsBorrowingFees: ethersBorrowingFees,
        gnsTradingCallbacks: ethersCallbacks,
      },
      {
        useMulticall: USE_MULTICALL,
        pairBatchSize: 10, // This is a conservative batch size to accommodate high trade volumes and default RPC payload limits. Consider adjusting.
      }
    );

    const allOpenPairTrades = transformRawTrades(openTradesRaw); // @todo handle the transform, include tradeData?

    appLogger.info(`Fetched ${allOpenPairTrades.length} new open pair trade(s).`);

    return allOpenPairTrades;
  }

  async function populateTradesLastUpdated(openLimitOrders, pairTrades, useMulticall) {
    appLogger.info('Fetching last updated info...');

    let olLastUpdated, tLastUpdated;
    if (useMulticall) {
      const ethersProvider = new ethers.providers.WebSocketProvider(currentlySelectedWeb3Client.currentProvider.connection._url);
      const multicallProvider = new Provider();
      await multicallProvider.init(ethersProvider);

      const callbacksContractMulticall = new Contract(callbacksContract.options.address, abis.CALLBACKS);
      olLastUpdated = await multicallProvider.all(
        openLimitOrders.map((order) =>
          callbacksContractMulticall.tradeLastUpdated(order.trader, order.pairIndex, order.index, TRADE_TYPE.LIMIT)
        ),
        'latest'
      );

      tLastUpdated = await multicallProvider.all(
        pairTrades.map((order) =>
          callbacksContractMulticall.tradeLastUpdated(order.trader, order.pairIndex, order.index, TRADE_TYPE.MARKET)
        ),
        'latest'
      );
    } else {
      // Consider adjusting batch size or using multicall for better performance (see above)
      const batchSize = 100;
      for (let i = 0; i < openLimitOrders.length; i += batchSize) {
        const batch = openLimitOrders.slice(i, i + batchSize);
        const batchLastUpdated = await Promise.all(
          batch.map((order) => fetchTradeLastUpdated(order.trader, order.pairIndex, order.index, TRADE_TYPE.LIMIT))
        );
        olLastUpdated = olLastUpdated ? olLastUpdated.concat(batchLastUpdated) : batchLastUpdated;
      }
      for (let i = 0; i < pairTrades.length; i += batchSize) {
        const batch = pairTrades.slice(i, i + batchSize);
        const batchLastUpdated = await Promise.all(
          batch.map((order) => fetchTradeLastUpdated(order.trader, order.pairIndex, order.index, TRADE_TYPE.MARKET))
        );
        tLastUpdated = tLastUpdated ? tLastUpdated.concat(batchLastUpdated) : batchLastUpdated;
      }
    }

    appLogger.info(`Fetched last updated info for ${tLastUpdated.length + olLastUpdated.length} trade(s).`);
    return transformLastUpdated(TEST_COLLAT_KEY, openLimitOrders, olLastUpdated, pairTrades, tLastUpdated);
  }
}

async function fetchTradeLastUpdated(trader, pairIndex, index, tradeType) {
  const lastUpdated = await callbacksContract.methods.tradeLastUpdated(trader, pairIndex, index, tradeType).call();
  return {
    tp: +lastUpdated.tp,
    sl: +lastUpdated.sl,
    limit: +lastUpdated.limit,
  };
}
// -----------------------------------------
// 9. WATCH TRADING EVENTS
// -----------------------------------------

function watchLiveTradingEvents() {
  try {
    if (eventSubTrading !== null && eventSubTrading.id !== null) {
      eventSubTrading.unsubscribe();
    }

    eventSubTrading = tradingContract.events.allEvents({ fromBlock: 'latest' }).on('data', (event) => {
      const eventName = event.event;

      if (
        eventName !== 'OpenLimitPlaced' &&
        eventName !== 'OpenLimitUpdated' &&
        eventName !== 'OpenLimitCanceled' &&
        eventName !== 'TpUpdated' &&
        eventName !== 'SlUpdated'
      ) {
        return;
      }

      // If no confirmation delay, then execute immediately without timer
      if (EVENT_CONFIRMATIONS_MS === 0) {
        synchronizeOpenTrades(event);
      } else {
        setTimeout(() => synchronizeOpenTrades(event), EVENT_CONFIRMATIONS_MS);
      }
    });

    if (eventSubCallbacks !== null && eventSubCallbacks.id !== null) {
      eventSubCallbacks.unsubscribe();
    }

    eventSubCallbacks = callbacksContract.events.allEvents({ fromBlock: 'latest' }).on('data', (event) => {
      const eventName = event.event;

      if (
        eventName !== 'MarketExecuted' &&
        eventName !== 'LimitExecuted' &&
        eventName !== 'MarketCloseCanceled' &&
        eventName !== 'SlUpdated' &&
        eventName !== 'SlCanceled' &&
        eventName !== 'PairMaxLeverageUpdated'
      ) {
        return;
      }

      // If no confirmation delay, then execute immediately without timer
      if (EVENT_CONFIRMATIONS_MS === 0) {
        synchronizeOpenTrades(event);
      } else {
        setTimeout(() => synchronizeOpenTrades(event), EVENT_CONFIRMATIONS_MS);
      }
    });

    if (eventSubBorrowingFeesContext.borrowing !== null && eventSubBorrowingFeesContext.borrowing.id !== null) {
      eventSubBorrowingFeesContext.borrowing.unsubscribe();
    }

    eventSubBorrowingFeesContext.borrowing = borrowingFeesContract.events.allEvents({ fromBlock: 'latest' }).on('data', (event) => {
      const eventName = event.event;

      if (
        [
          'PairAccFeesUpdated',
          'GroupAccFeesUpdated',
          'GroupOiUpdated',
          'PairMaxOiUpdated',
          'PriceImpactOpenInterestAdded',
          'PriceImpactOpenInterestRemoved',
          'PriceImpactOiTransferredPairs',
          'PriceImpactWindowsDurationUpdated',
          'PriceImpactWindowsCountUpdated',
        ].indexOf(eventName) < 0
      ) {
        return;
      }
      // If no confirmation delay, then execute immediately without timer
      if (EVENT_CONFIRMATIONS_MS === 0) {
        handleBorrowingFeesEvent(event);
      } else {
        setTimeout(() => handleBorrowingFeesEvent(event), EVENT_CONFIRMATIONS_MS);
      }
    });
  } catch {
    setTimeout(() => {
      watchLiveTradingEvents();
    }, 2 * 1000);
  }
}

async function synchronizeOpenTrades(event) {
  try {
    const currentKnownOpenTrades = knownOpenTrades;

    const eventName = event.event;
    const eventReturnValues = event.returnValues;

    appLogger.verbose(`Synchronizing open trades based on event ${eventName} from block ${event.blockNumber}...`);

    if (currentKnownOpenTrades === null) {
      appLogger.warn(
        `Known open trades not yet initialized, cannot synchronize ${eventName} from block ${event.blockNumber} at this time!`
      );

      return;
    }

    if (eventName === 'OpenLimitCanceled') {
      const { trader, pairIndex, index } = eventReturnValues;

      const tradeKey = buildTradeIdentifier(TEST_COLLAT_KEY, trader, pairIndex, index, true);
      const existingKnownOpenTrade = currentKnownOpenTrades.get(tradeKey);

      if (existingKnownOpenTrade !== undefined) {
        currentKnownOpenTrades.delete(tradeKey);

        appLogger.verbose(`Synchronize open trades from event ${eventName}: Removed limit for ${tradeKey}`);
      } else {
        appLogger.verbose(`Synchronize open trades from event ${eventName}: Limit not found for ${tradeKey}`);
      }
    } else if (eventName === 'OpenLimitPlaced' || eventName === 'OpenLimitUpdated') {
      const { trader, pairIndex, index } = eventReturnValues;

      const [hasOpenLimitOrder, openLimitOrderId] = await Promise.all([
        storageContract.methods.hasOpenLimitOrder(trader, pairIndex, index).call(),
        storageContract.methods.openLimitOrderIds(trader, pairIndex, index).call(),
      ]);

      if (hasOpenLimitOrder === false) {
        appLogger.warn(`Open limit order not found for ${trader}/${pairIndex}/${index}; ignoring!`);
      } else {
        const [limitOrder, type, lastUpdated, tradeData] = await Promise.all([
          storageContract.methods.openLimitOrders(openLimitOrderId).call(),
          nftRewardsContract.methods.openLimitOrderTypes(trader, pairIndex, index).call(),
          fetchTradeLastUpdated(trader, pairIndex, index, TRADE_TYPE.LIMIT),
          callbacksContract.methods.tradeData(trader, pairIndex, index, 1).call(),
        ]);

        limitOrder.type = type;
        limitOrder.maxSlippageP = parseFloat(tradeData.maxSlippageP.toString()) / 1e10 || 1;

        const tradeKey = buildTradeIdentifier(TEST_COLLAT_KEY, trader, pairIndex, index, true);

        if (currentKnownOpenTrades.has(tradeKey)) {
          appLogger.verbose(`Synchronize open trades from event ${eventName}: Updating open limit order for ${tradeKey}`);
        } else {
          appLogger.verbose(`Synchronize open trades from event ${eventName}: Storing new open limit order for ${tradeKey}`);
        }

        tradesLastUpdated.set(tradeKey, lastUpdated);
        currentKnownOpenTrades.set(tradeKey, limitOrder);
      }
    } else if (eventName === 'TpUpdated' || eventName === 'SlUpdated' || eventName === 'SlCanceled') {
      const { trader, pairIndex, index } = eventReturnValues;

      // Fetch all fresh trade information to update known open trades
      const [trade, tradeInfo, tradeInitialAccFees, lastUpdated] = await Promise.all([
        storageContract.methods.openTrades(trader, pairIndex, index).call(),
        storageContract.methods.openTradesInfo(trader, pairIndex, index).call(),
        borrowingFeesContract.methods.initialAccFees(trader, pairIndex, index).call(),
        fetchTradeLastUpdated(trader, pairIndex, index, TRADE_TYPE.MARKET),
      ]);

      trade.tradeInfo = tradeInfo;
      trade.tradeInitialAccFees = convertTradeInitialAccFees({
        borrowing: {
          accPairFee: tradeInitialAccFees.accPairFee,
          accGroupFee: tradeInitialAccFees.accGroupFee,
          block: tradeInitialAccFees.block,
        },
      });

      const tradeKey = buildTradeIdentifier(TEST_COLLAT_KEY, trader, pairIndex, index, false);
      tradesLastUpdated.set(tradeKey, lastUpdated);
      currentKnownOpenTrades.set(tradeKey, trade);

      appLogger.verbose(`Synchronize open trades from event ${eventName}: Updated trade ${tradeKey}`);
    } else if (eventName === 'MarketCloseCanceled') {
      const { trader, pairIndex, index } = eventReturnValues;
      const tradeKey = buildTradeIdentifier(TEST_COLLAT_KEY, trader, pairIndex, index, false);

      const trade = await storageContract.methods.openTrades(trader, pairIndex, index).call();

      // Make sure the trade is still actually active
      if (parseInt(trade.leverage, 10) > 0) {
        // Fetch all fresh trade information to update known open trades
        const [tradeInfo, tradeInitialAccFees, lastUpdated] = await Promise.all([
          storageContract.methods.openTradesInfo(trader, pairIndex, index).call(),
          borrowingFeesContract.methods.initialAccFees(trader, pairIndex, index).call(),
          fetchTradeLastUpdated(trader, pairIndex, index, TRADE_TYPE.MARKET),
        ]);

        trade.tradeInfo = tradeInfo;
        trade.tradeInitialAccFees = convertTradeInitialAccFees({
          borrowing: {
            accPairFee: tradeInitialAccFees.accPairFee,
            accGroupFee: tradeInitialAccFees.accGroupFee,
            block: tradeInitialAccFees.block,
          },
        });

        tradesLastUpdated.set(tradeKey, lastUpdated);
        currentKnownOpenTrades.set(tradeKey, trade);
      } else {
        tradesLastUpdated.delete(tradeKey);
        currentKnownOpenTrades.delete(tradeKey);
      }

      return;
    } else if (
      (eventName === 'MarketExecuted' && eventReturnValues.open === true) ||
      (eventName === 'LimitExecuted' && eventReturnValues.orderType === '3')
    ) {
      const { t: trade, limitIndex } = eventReturnValues;
      const { trader, pairIndex, index } = trade;

      if (eventName === 'LimitExecuted') {
        const openTradeKey = buildTradeIdentifier(TEST_COLLAT_KEY, trader, pairIndex, limitIndex, true);

        if (currentKnownOpenTrades.has(openTradeKey)) {
          appLogger.verbose(`Synchronize open trades from event ${eventName}: Removed open limit trade ${openTradeKey}.`);

          tradesLastUpdated.delete(openTradeKey);
          currentKnownOpenTrades.delete(openTradeKey);
        } else {
          appLogger.warn(
            `Synchronize open trades from event ${eventName}: Open limit trade ${openTradeKey} was not found? Unable to remove.`
          );
        }

        resetRetryCounter(buildTriggerIdentifier(TEST_COLLAT_KEY, trader, pairIndex, limitIndex, 3));
      }

      const [tradeInfo, tradeInitialAccFees, lastUpdated] = await Promise.all([
        storageContract.methods.openTradesInfo(trader, pairIndex, index).call(),
        borrowingFeesContract.methods.initialAccFees(trader, pairIndex, index).call(),
        fetchTradeLastUpdated(trader, pairIndex, index, TRADE_TYPE.MARKET),
      ]);

      const tradeKey = buildTradeIdentifier(TEST_COLLAT_KEY, trader, pairIndex, index, false);

      tradesLastUpdated.set(tradeKey, lastUpdated);
      currentKnownOpenTrades.set(tradeKey, {
        ...trade,
        tradeInfo,
        tradeInitialAccFees: convertTradeInitialAccFees({
          borrowing: {
            accPairFee: tradeInitialAccFees.accPairFee,
            accGroupFee: tradeInitialAccFees.accGroupFee,
            block: tradeInitialAccFees.block,
          },
        }),
      });

      appLogger.info(`Synchronize open trades from event ${eventName}: Stored active trade ${tradeKey}`);

      // reset any known SL/TP/LIQ counters
      resetRetryCounter(buildTriggerIdentifier(TEST_COLLAT_KEY, trader, pairIndex, index, 0));
      resetRetryCounter(buildTriggerIdentifier(TEST_COLLAT_KEY, trader, pairIndex, index, 1));
      resetRetryCounter(buildTriggerIdentifier(TEST_COLLAT_KEY, trader, pairIndex, index, 2));
    } else if (
      (eventName === 'MarketExecuted' && eventReturnValues.open === false) ||
      (eventName === 'LimitExecuted' && eventReturnValues.orderType !== '3')
    ) {
      const { trader, pairIndex, index } = eventReturnValues.t;
      const tradeKey = buildTradeIdentifier(TEST_COLLAT_KEY, trader, pairIndex, index, false);

      const triggeredOrderTrackingInfoIdentifier = buildTriggerIdentifier(
        TEST_COLLAT_KEY,
        trader,
        pairIndex,
        index,
        eventReturnValues.orderType ?? 'N/A'
      );

      appLogger.info(`Synchronize open trades from event ${eventName}: event received for ${triggeredOrderTrackingInfoIdentifier}...`);

      const existingKnownOpenTrade = currentKnownOpenTrades.get(tradeKey);

      // If this was a known open trade then we need to remove it now
      if (existingKnownOpenTrade !== undefined) {
        currentKnownOpenTrades.delete(tradeKey);
        tradesLastUpdated.delete(tradeKey);
        appLogger.debug(`Synchronize open trades from event ${eventName}: Removed ${tradeKey} from known open trades.`);
      } else {
        appLogger.debug(
          `Synchronize open trades from event ${eventName}: Trade ${tradeKey} was not found in known open trades; just ignoring.`
        );
      }

      const triggeredOrderDetails = triggeredOrders.get(triggeredOrderTrackingInfoIdentifier);

      // If we were tracking this triggered order, stop tracking it now and clear the timeout so it doesn't
      // interrupt the event loop for no reason later
      if (triggeredOrderDetails !== undefined) {
        appLogger.debug(
          `Synchronize open trades from event ${eventName}: We triggered order ${triggeredOrderTrackingInfoIdentifier}; clearing tracking timer.`
        );

        // If we actually managed to send the transaction off without error then we can report success and clean
        // up tracking state now
        if (triggeredOrderDetails.transactionSent === true) {
          if (eventReturnValues.nftHolder === process.env.PUBLIC_KEY) {
            appLogger.info(`💰💰💰 SUCCESSFULLY TRIGGERED ORDER ${triggeredOrderTrackingInfoIdentifier} FIRST!!!`);

            executionStats = {
              ...executionStats,
              firstTriggers: (executionStats?.firstTriggers ?? 0) + 1,
            };
          } else {
            appLogger.info(`💰 SUCCESSFULLY TRIGGERED ORDER ${triggeredOrderTrackingInfoIdentifier} AS SAME BLOCK!!!`);

            executionStats = {
              ...executionStats,
              sameBlockTriggers: (executionStats?.sameBlockTriggers ?? 0) + 1,
            };
          }

          clearTimeout(triggeredOrderDetails.cleanupTimerId);
          triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier);
        }
      } else {
        appLogger.debug(
          `Synchronize open trades from event ${eventName}: Order ${triggeredOrderTrackingInfoIdentifier} was not being tracked as triggered by us.`
        );
      }

      resetRetryCounter(triggeredOrderTrackingInfoIdentifier);
    } else if (eventName === 'PairMaxLeverageUpdated') {
      pairMaxLeverage.set(eventReturnValues.pairIndex, parseFloat(eventReturnValues.maxLeverage));
      appLogger.verbose(`${eventName}: Set pairMaxLeverage for pair ${eventReturnValues.pairIndex} to ${eventReturnValues.maxLeverage}.`);
    }

    executionStats = {
      ...executionStats,
      totalEventsProcessed: (executionStats?.totalEventsProcessed ?? 0) + 1,
      lastEventBlockNumber: event.blockNumber,
      lastEventProcessed: new Date(),
    };
  } catch (error) {
    appLogger.error('Error occurred when refreshing trades.', error);
  }
}

async function handleBorrowingFeesEvent(event) {
  try {
    if (event.event === 'PairAccFeesUpdated') {
      const { pairIndex, accFeeLong, accFeeShort } = event.returnValues;
      const pairBorrowingFees = borrowingFeesContext.pairs[pairIndex];

      if (pairBorrowingFees) {
        pairBorrowingFees.accFeeLong = parseFloat(accFeeLong) / 1e10;
        pairBorrowingFees.accFeeShort = parseFloat(accFeeShort) / 1e10;
        pairBorrowingFees.accLastUpdateBlock = parseInt(event.blockNumber);
      }
    } else if (event.event === 'GroupAccFeesUpdated') {
      const { groupIndex, accFeeLong, accFeeShort } = event.returnValues;

      const groupBorrowingFees = borrowingFeesContext.groups[groupIndex];

      if (groupBorrowingFees) {
        groupBorrowingFees.accFeeLong = parseFloat(accFeeLong) / 1e10;
        groupBorrowingFees.accFeeShort = parseFloat(accFeeShort) / 1e10;
        groupBorrowingFees.accLastUpdateBlock = parseInt(event.blockNumber);
      }
    } else if (event.event === 'GroupOiUpdated') {
      const { groupIndex, oiLong, oiShort } = event.returnValues;

      const groupBorrowingFees = borrowingFeesContext.groups[groupIndex];

      if (groupBorrowingFees) {
        groupBorrowingFees.oiLong = parseFloat(oiLong) / 1e10;
        groupBorrowingFees.oiShort = parseFloat(oiShort) / 1e10;
      }
    } else if (event.event === 'PairParamsUpdated') {
      const { pairIndex, maxOi } = event.returnValues;

      openInterests[pairIndex].max = parseFloat(maxOi) * 1e8 + ''; // @todo normalize this, mul by precision delta etc
      borrowingFeesContext.pairs[pairIndex].maxOi = parseFloat(maxOi) / 1e10;
    } else if (event.event === 'PriceImpactOpenInterestAdded') {
      // @todo Edit OIWindows events
      const { pairIndex, windowId, long, openInterestUsd } = event.returnValues.oiWindowUpdate;

      increaseWindowOi(oiWindows, pairIndex, windowId, long, openInterestUsd);
    } else if (event.event === 'PriceImpactOpenInterestRemoved') {
      const { oiWindowUpdate, notOutdated } = event.returnValues;
      decreaseWindowOi(
        oiWindows,
        oiWindowUpdate.pairIndex,
        oiWindowUpdate.windowId,
        oiWindowUpdate.long,
        oiWindowUpdate.openInterestUsd,
        notOutdated
      );
    } else if (event.event === 'PriceImpactOiTransferredPairs') {
      const { pairsCount, prevCurrentWindowId, prevEarliestWindowId, newCurrentWindowId } = event.returnValues;
      oiWindows = transferOiWindows(oiWindows, pairsCount, prevCurrentWindowId, prevEarliestWindowId, newCurrentWindowId);
    } else if (event.event === 'PriceImpactWindowsDurationUpdated') {
      const { windowsDuration } = event.returnValues;
      updateWindowsDuration(oiWindowsSettings, windowsDuration);
    } else if (event.event === 'PriceImpactWindowsCountUpdated') {
      const { windowsCount } = event.returnValues;
      updateWindowsCount(oiWindowsSettings, windowsCount);
    }
  } catch (error) {
    appLogger.error('Error occurred when handling BorrowingFees event.', error);
  }
}

function resetRetryCounter(triggerId) {
  triggerRetries.delete(triggerId);
}

// ---------------------------------------------
// 11. FETCH CURRENT PRICES & TRIGGER ORDERS
// ---------------------------------------------

function watchPricingStream() {
  appLogger.info('Connecting to pricing stream...');

  let socket = new WebSocket(process.env.PRICES_URL);
  let pricingUpdatesMessageProcessingCount = 0;

  socket.onopen = () => {
    appLogger.info('Pricing stream connected.');
  };
  socket.onclose = () => {
    appLogger.error('Pricing stream websocket closed! Will attempt to reconnect in two seconds...');

    setTimeout(() => {
      watchPricingStream();
    }, 2000);
  };
  socket.onerror = (error) => {
    appLogger.error('Pricing stream websocket error occurred!', { error });
    socket.close();
  };
  socket.onmessage = (msg) => {
    const currentKnownOpenTrades = knownOpenTrades;

    if (currentKnownOpenTrades === null) {
      appLogger.debug('Known open trades not yet loaded; unable to begin any processing yet!');

      return;
    }

    if (spreadsP.length === 0) {
      appLogger.debug('Spreads are not yet loaded; unable to process any trades!');

      return;
    }

    if (!allowedLink.storage || !allowedLink.rewards) {
      appLogger.warn('LINK is not currently allowed for the configured account; unable to process any trades!');

      return;
    }

    // If concurrent processing is not enabled and we're still in the middle of processing the last pricing update then debounce
    if (ENABLE_CONCURRENT_PRICE_UPDATE_PROCESSING === false && pricingUpdatesMessageProcessingCount !== 0) {
      appLogger.debug('Still processing last pricing update msg; debouncing!');

      return;
    }

    const messageData = JSON.parse(msg.data.toString());

    // If there's only one element in the array then it's a timestamp
    if (messageData.length === 1) {
      // Checkpoint ts at index 0
      // const checkpoint = messageData[0]
      return;
    }

    const pairPrices = new Map();
    for (let i = 0; i < messageData.length; i += 2) {
      pairPrices.set(messageData[i], messageData[i + 1]);
    }

    pricingUpdatesMessageProcessingCount++;

    handleOnMessageAsync()
      .catch((error) => {
        appLogger.error('Unhandled error occurred when handling pricing stream message!', { error });
      })
      .finally(() => {
        pricingUpdatesMessageProcessingCount--;
      });

    async function handleOnMessageAsync() {
      // appLogger.debug(`Beginning processing new "pricingUpdated" message}...`);
      // appLogger.debug(`Received "charts" message, checking if any of the ${currentKnownOpenTrades.size} known open trades should be acted upon...`, { knownOpenTradesCount: currentKnownOpenTrades.size });

      const statuses = await Promise.allSettled(
        [...currentKnownOpenTrades.values()].map(async (openTrade) => {
          const { trader, pairIndex, index, buy } = openTrade;

          const price = pairPrices.get(parseInt(pairIndex));

          if (price === undefined) return;

          const isPendingOpenLimitOrder = openTrade.openPrice === undefined;
          const openTradeKey = buildTradeIdentifier(TEST_COLLAT_KEY, trader, pairIndex, index, isPendingOpenLimitOrder);

          // Under certain conditions (forex/stock market just opened, server restart, etc) the price is not
          // available, so we need to make sure we skip any processing in that case
          if ((price ?? 0) <= 0) {
            // appLogger.debug(`Received ${price} for close price for pair ${pairIndex}; skipping processing of ${openTradeKey}!`);

            return;
          }

          let orderType = -1;
          let liqPrice;
          if (isPendingOpenLimitOrder === false) {
            // Hotfix openPrice of 0
            if (parseInt(openTrade.openPrice) === 0) return;

            const tp = parseFloat(openTrade.tp) / 1e10;
            const sl = parseFloat(openTrade.sl) / 1e10;
            liqPrice = getTradeLiquidationPrice(openTrade);

            if (tp !== 0 && ((buy && price >= tp) || (!buy && price <= tp))) {
              orderType = 0;
            } else if (sl !== 0 && ((buy && price <= sl) || (!buy && price >= sl))) {
              orderType = 1;
            } else if ((buy && price <= liqPrice) || (!buy && price >= liqPrice)) {
              orderType = 2;
            } else {
              //appLogger.debug(`Open trade ${openTradeKey} is not ready for us to act on yet.`);
            }
          } else {
            const posDai = parseFloat(openTrade.leverage) * parseFloat(openTrade.positionSize);

            const spreadWithPriceImpactP =
              getSpreadWithPriceImpactP(
                parseFloat(spreadsP[pairIndex]) / 1e10 / 100,
                openTrade.buy,
                openTrade.positionSize / 1e18, // @todo, div by collat precision, multiply by collat price
                openTrade.leverage,
                pairDepths[openTrade.pairIndex],
                oiWindowsSettings,
                oiWindows[openTrade.pairIndex]
              ) * 100;

            const interestDai = buy
              ? parseFloat(openInterests[openTrade.pairIndex].long)
              : parseFloat(openInterests[openTrade.pairIndex].short);

            const newInterestDai = interestDai + posDai;

            const maxInterestDai = parseFloat(openInterests[openTrade.pairIndex].max);

            const minPrice = parseFloat(openTrade.minPrice) / 1e10;
            const maxPrice = parseFloat(openTrade.maxPrice) / 1e10;

            if (
              isValidLeverage(openTrade.pairIndex, parseFloat(openTrade.leverage)) &&
              newInterestDai <= maxInterestDai &&
              spreadWithPriceImpactP * openTrade.leverage <= MAX_OPEN_NEGATIVE_PNL_P &&
              withinMaxGroupOi(openTrade.pairIndex, buy, posDai / 1e18, borrowingFeesContext) && // @todo div by precision
              spreadWithPriceImpactP <= openTrade.maxSlippageP
            ) {
              const tradeType = openTrade.type;
              if (
                (tradeType === '0' && price >= minPrice && price <= maxPrice) ||
                (tradeType === '1' && (buy ? price <= maxPrice : price >= minPrice)) ||
                (tradeType === '2' && (buy ? price >= minPrice : price <= maxPrice))
              ) {
                orderType = 3;
              } else {
                //appLogger.debug(`Limit trade ${openTradeKey} is not ready for us to act on yet.`);
              }
            }
          }

          // If it's not an order type we want to act on yet, just skip it
          if (orderType === -1) {
            return;
          }

          const groupId = parseInt(pairs[pairIndex][0][4]);
          if (isForexGroup(groupId) && !isForexOpen(new Date())) {
            return;
          }

          if (isStocksGroup(groupId) && !isStocksOpen(new Date())) {
            return;
          }

          if (isIndicesGroup(groupId) && !isIndicesOpen(new Date())) {
            return;
          }

          if (isCommoditiesGroup(groupId) && !isCommoditiesOpen(new Date())) {
            return;
          }

          const lastUpdated = tradesLastUpdated.get(openTradeKey);

          if (!lastUpdated && orderType !== 2) {
            appLogger.warn(`Last updated information for ${openTradeKey} is not available`);
            return;
          }

          const triggeredOrderTrackingInfoIdentifier = buildTriggerIdentifier(TEST_COLLAT_KEY, trader, pairIndex, index, orderType);

          // Make sure this order hasn't already been triggered
          if (triggeredOrders.has(triggeredOrderTrackingInfoIdentifier)) {
            appLogger.debug(`Order ${triggeredOrderTrackingInfoIdentifier} has already been triggered by us and is pending!`);

            return;
          }

          if (!canRetry(triggeredOrderTrackingInfoIdentifier)) return;

          const triggeredOrderDetails = {
            cleanupTimerId: null,
            transactionSent: false,
            error: null,
          };

          // Track that we're triggering this order any other price updates that come in will not try to process
          // it at the same time
          triggeredOrders.set(triggeredOrderTrackingInfoIdentifier, triggeredOrderDetails);

          try {
            // Make sure the trade is still known to us at this point because it's possible that the trade was
            // removed from known open trades asynchronously which is why we check again here even though we're
            // looping through the set of what we thought were the known open trades here
            if (!currentKnownOpenTrades.has(openTradeKey)) {
              appLogger.warn(`Trade ${openTradeKey} no longer exists in our known open trades list; skipping order!`);

              return;
            }

            appLogger.info(`🤞 Trying to trigger ${triggeredOrderTrackingInfoIdentifier}...`);

            try {
              const orderTransaction = createTransaction(
                {
                  to: tradingContract.options.address,
                  data: tradingContract.methods.executeNftOrder(packNft(orderType, trader, pairIndex, index, 0, 0)).encodeABI(),
                },
                true
              );

              // NOTE: technically this should execute synchronously because we're supplying all necessary details on
              // the transaction object up front
              const signedTransaction = await currentlySelectedWeb3Client.eth.accounts.signTransaction(
                orderTransaction,
                process.env.PRIVATE_KEY
              );

              if (DRY_RUN_MODE === false) {
                await currentlySelectedWeb3Client.eth.sendSignedTransaction(signedTransaction.rawTransaction);
              } else {
                appLogger.info(
                  `DRY RUN MODE ACTIVE: skipping actually sending transaction for order: ${triggeredOrderTrackingInfoIdentifier}`,
                  orderTransaction
                );
              }

              triggeredOrderDetails.transactionSent = true;

              // If we successfully send the transaction, we set up a timer to make sure we've heard about its
              // eventual completion and, if not, we clean up tracking and log that we didn't hear back
              triggeredOrderDetails.cleanupTimerId = setTimeout(() => {
                if (triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier)) {
                  appLogger.warn(
                    `❕ Never heard back from the blockchain about triggered order ${triggeredOrderTrackingInfoIdentifier}; removed from tracking.`
                  );

                  executionStats = {
                    ...executionStats,
                    missedTriggers: (executionStats.missedTriggers ?? 0) + 1,
                  };
                }
              }, FAILED_ORDER_TRIGGER_TIMEOUT_MS);

              appLogger.info(`⚡️ Triggered order for ${triggeredOrderTrackingInfoIdentifier}.`);
            } catch (error) {
              const executionStatsTriggerErrors = executionStats.triggerErrors ?? {};
              const errorReason = error.reason ?? 'UNKNOWN_TRANSACTION_ERROR';

              executionStatsTriggerErrors[errorReason] = (executionStatsTriggerErrors[errorReason] ?? 0) + 1;

              executionStats = {
                ...executionStats,
                triggerErrors: executionStatsTriggerErrors,
              };

              switch (errorReason) {
                case 'SAME_BLOCK_LIMIT':
                case 'TOO_LATE':
                  // The trade has been triggered by others, delay removing it and maybe we'll have a
                  // chance to try again if original trigger fails
                  appLogger.warn(
                    `⭕️ Order ${triggeredOrderTrackingInfoIdentifier} was already triggered and we got a "${errorReason}"; will remove from triggered tracking shortly and it may be tried again if original trigger didn't hit!`
                  );

                  // Wait a bit and then clean from triggered orders list so it might get tried again
                  triggeredOrderDetails.cleanupTimerId = setTimeout(() => {
                    if (!triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier)) {
                      appLogger.debug(
                        `Tried to clean up triggered order ${triggeredOrderTrackingInfoIdentifier} which previously failed due to "${errorReason}", but it was already removed.`
                      );
                    }
                  }, FAILED_ORDER_TRIGGER_TIMEOUT_MS / 2);

                  break;

                case 'NO_TRADE':
                  appLogger.warn(
                    `❌ Order ${triggeredOrderTrackingInfoIdentifier} missed due to "${errorReason}" error; removing order from known trades and triggered tracking.`
                  );

                  // The trade is gone, just remove it from known trades
                  triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier);
                  currentKnownOpenTrades.delete(openTradeKey);
                  resetRetryCounter(triggeredOrderTrackingInfoIdentifier);

                  break;

                case 'NO_SL':
                case 'NO_TP':
                case 'SUCCESS_TIMELOCK':
                case 'IN_TIMEOUT':
                  appLogger.warn(
                    `❗️ Order ${triggeredOrderTrackingInfoIdentifier} missed due to "${errorReason}" error; will remove order from triggered tracking.`
                  );

                  // Wait a bit and then clean from triggered orders list so it might get tried again
                  triggeredOrderDetails.cleanupTimerId = setTimeout(() => {
                    if (!triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier)) {
                      appLogger.warn(
                        `Tried to clean up triggered order ${triggeredOrderTrackingInfoIdentifier} which previously failed due to "${errorReason}", but it was already removed.`
                      );
                    }
                  }, FAILED_ORDER_TRIGGER_TIMEOUT_MS);

                  break;

                default:
                  const errorMessage = error.message?.toLowerCase();

                  if (
                    errorMessage !== undefined &&
                    (errorMessage.includes('nonce too low') || errorMessage.includes('replacement transaction underpriced'))
                  ) {
                    appLogger.error(
                      `⁉️ Some how we ended up with a nonce that was too low; forcing a refresh now and the trade may be tried again if still available.`
                    );

                    await nonceManager.refreshNonceFromOnChainTransactionCount();
                    triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier);

                    appLogger.info('Nonce refreshed and tracking of triggered order cleared so it can possibly be retried.');
                  } else {
                    appLogger.error(
                      `🔥 Order ${triggeredOrderTrackingInfoIdentifier} transaction failed for unexpected reason "${errorReason}"; removing order from tracking.`,
                      { error }
                    );

                    // Wait a bit and then clean from triggered orders list so it might get tried again
                    triggeredOrderDetails.cleanupTimerId = setTimeout(() => {
                      if (!triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier)) {
                        appLogger.debug(
                          `Tried to clean up triggered order ${triggeredOrderTrackingInfoIdentifier} which previously failed, but it was already removed?`
                        );
                      }
                    }, FAILED_ORDER_TRIGGER_TIMEOUT_MS);
                  }
              }
            }
          } catch (error) {
            appLogger.error(
              `Failed while trying to trigger order ${triggeredOrderTrackingInfoIdentifier}; removing from triggered tracking so it can be tried again ASAP.`
            );

            triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier);

            throw error;
          }
        })
      );
    }
  };

  function getTradeLiquidationPrice(trade) {
    const { tradeInfo, tradeInitialAccFees, pairIndex } = trade;

    return getLiquidationPrice(convertTrade(trade), convertTradeInfo(tradeInfo), tradeInitialAccFees, {
      currentBlock: latestL2Block,
      openInterest: convertOpenInterest(openInterests[pairIndex]),
      // Borrowing Fees
      pairs: borrowingFeesContext.pairs,
      groups: borrowingFeesContext.groups,
    });
  }

  function isValidLeverage(pairIndex, wantedLeverage) {
    const maxLev = pairMaxLeverage.get(pairIndex) ?? 0;
    // if pairsMaxLeverage is 0 then it's not currently being restricted
    return maxLev === 0 || maxLev >= wantedLeverage;
  }

  function canRetry(triggerId) {
    if (MAX_RETRIES === -1) return true;

    const retries = triggerRetries.get(triggerId) || 0;
    const canRetry = retries < MAX_RETRIES;

    if (canRetry) {
      // to prevent incrementing at every price message. Only
      triggerRetries.set(triggerId, retries + 1);
    }

    return canRetry;
  }
}

watchPricingStream();

// ------------------------------------------
// 12. AUTO HARVEST REWARDS
// ------------------------------------------

if (AUTO_HARVEST_MS > 0) {
  async function claimRewards() {
    if (!process.env.ORACLE_ADDRESS) return;

    const tx = createTransaction({
      to: nftRewardsContract.options.address,
      data: nftRewardsContract.methods.claimRewards(process.env.ORACLE_ADDRESS).encodeABI(),
    });

    try {
      const signed = await currentlySelectedWeb3Client.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);

      await currentlySelectedWeb3Client.eth.sendSignedTransaction(signed.rawTransaction);

      appLogger.info('Tokens claimed.');
    } catch (error) {
      appLogger.error('Claim tokens transaction failed!', error);
    }
  }

  setInterval(async () => {
    appLogger.info('Harvesting rewards...');

    try {
      await claimRewards();
    } catch (error) {
      appLogger.error('Harvesting rewards failed unexpectedly!', error);
    }
  }, AUTO_HARVEST_MS);
}

/**
 * Creates a base transaction object using fixed, configured values and optionally fills out any additionally
 * supplied properties.
 * @param {Object} additionalTransactionProps - Any additional properties that should be applied to (or overridden on)
 * the base transaction object.
 * @param {boolean} isPriority - Whether or not the transaction is a priority transaction; defaults to false. (NOTE:
 * ultimately controls the gas price used.
 */
function createTransaction(additionalTransactionProps, isPriority = false) {
  const transaction = {
    chainId: CHAIN_ID,
    nonce: nonceManager.getNextNonce(),
    gas: MAX_GAS_PER_TRANSACTION_HEX,
    ...getTransactionGasFees(NETWORK, isPriority),
    ...additionalTransactionProps,
  };

  return transaction;
}

/**
 * Gets the appropriate gas fee settings to apply to a transaction based on the network type.
 * @param {NETWORK} network - The network instance that gas fees are to be retrieved for.
 * @param {boolean} isPriority - Whether or not the transaction is a priority transaction; defaults to false. (NOTE:
 * this controls the amount of gas used for the transaction.)
 * @returns The appropriate gas fee settings for the transaction based on the network type.
 */
function getTransactionGasFees(network, isPriority = false) {
  if (network.gasMode === GAS_MODE.EIP1559) {
    return {
      maxPriorityFeePerGas: isPriority
        ? Web3.utils.toHex(priorityTransactionMaxPriorityFeePerGas * 1e9)
        : Web3.utils.toHex(standardTransactionGasFees.maxPriorityFee * 1e9),
      maxFeePerGas: isPriority ? MAX_FEE_PER_GAS_WEI_HEX : Web3.utils.toHex(standardTransactionGasFees.maxFee * 1e9),
    };
  } else if (network.gasMode === GAS_MODE.LEGACY) {
    const priorityMultiplier = 400;

    return {
      gasPrice: Web3.utils.toHex(gasPriceBn.mul(Web3.utils.toBN(priorityMultiplier)).div(Web3.utils.toBN(100))),
    };
  }

  throw new Error(`Unsupported gas mode: ${network?.gasMode}`);
}
