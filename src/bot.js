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
import {
  ABIS as abis,
  GAS_MODE,
  isStocksGroup,
  isForexGroup,
  isIndicesGroup,
  isCommoditiesGroup,
  MAX_OPEN_NEGATIVE_PNL_P,
  TRADE_TYPE,
} from './constants/index.js';
import {
  NonceManager,
  createLogger,
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
  appConfig,
  initStack,
  getEthersContract,
} from './utils/index.js';
const { toHex, BN } = Web3.utils;

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

const {
  MAX_FEE_PER_GAS_WEI_HEX,
  MAX_GAS_PER_TRANSACTION_HEX,
  EVENT_CONFIRMATIONS_MS,
  AUTO_HARVEST_MS,
  FAILED_ORDER_TRIGGER_TIMEOUT_MS,
  PRIORITY_GWEI_MULTIPLIER,
  MIN_PRIORITY_GWEI,
  OPEN_TRADES_REFRESH_MS,
  GAS_REFRESH_INTERVAL_MS,
  WEB3_STATUS_REPORT_INTERVAL_MS,
  USE_MULTICALL,
  MAX_RETRIES,
  CHAIN_ID,
  CHAIN,
  NETWORK,
  WEB3_PROVIDER_URLS,
  DRY_RUN_MODE,
  FETCH_TRADING_VARIABLES_REFRESH_INTERVAL_MS,
  COLLATERAL_PRICE_REFRESH_INTERVAL_MS,
} = appConfig();

const app = {
  // web3
  currentlySelectedWeb3ClientIndex: -1,
  currentlySelectedWeb3Client: null,
  web3Clients: [],
  // contracts
  collaterals: [],
  stacks: {},
  multiCollatContract: null,
  eventSubs: {},
  // params
  spreadsP: [],
  oiWindows: {},
  oiWindowsSettings: { startTs: 0, windowsDuration: 0, windowsCount: 0 },
  blocks: {
    web3ClientBlocks: new Array(WEB3_PROVIDER_URLS.length).fill(0),
    latestL2Block: 0,
  },
  // storage/tracking
  knownOpenTrades: null,
  tradesLastUpdated: new Map(),
  triggeredOrders: new Map(),
  triggerRetries: new Map(),
  gas: {
    priorityTransactionMaxPriorityFeePerGas: 50,
    standardTransactionGasFees: { maxFee: 31, maxPriorityFee: 31 },

    gasPriceBn: new Web3.utils.BN(0.1 * 1e9),
  },
};

appLogger.info('Welcome to the gTrade NFT bot!');

if (!NETWORK) {
  throw new Error(`Invalid chain id: ${CHAIN_ID}`);
}

async function checkLinkAllowance(stack, contract) {
  try {
    const link = stack.contracts.link;
    const allowance = await link.methods.allowance(process.env.PUBLIC_KEY, contract).call();
    const key = contract === stack.contracts.storage.options.address ? 'storage' : 'rewards';

    if (parseFloat(allowance) > 0) {
      stack.allowedLink[key] = true;
      appLogger.info(`[${stack.collateral}][${key}] LINK allowance OK.`);
    } else {
      appLogger.info(`[${stack.collateral}][${key}] LINK not allowed, approving now.`);

      const tx = createTransaction({
        to: link.options.address,
        data: link.methods.approve(contract, '115792089237316195423570985008687907853269984665640564039457584007913129639935').encodeABI(),
      });

      try {
        const signed = await app.currentlySelectedWeb3Client.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);

        await app.currentlySelectedWeb3Client.eth.sendSignedTransaction(signed.rawTransaction);

        appLogger.info(`[${stack.collateral}][${key}] LINK successfully approved.`);
        stack.allowedLink[key] = true;
      } catch (error) {
        appLogger.error(`[${stack.collateral}][${key}] LINK approve transaction failed!`, error);

        throw error;
      }
    }
  } catch {
    setTimeout(() => {
      checkLinkAllowance(stack, contract);
    }, 5 * 1000);
  }
}

// -----------------------------------------
//  WEB3 PROVIDER
// -----------------------------------------

async function setCurrentWeb3Client(newWeb3ClientIndex) {
  appLogger.info('Switching web3 client to ' + WEB3_PROVIDER_URLS[newWeb3ClientIndex] + ' (#' + newWeb3ClientIndex + ')...');

  const executionStartTime = performance.now();
  const newWeb3Client = app.web3Clients[newWeb3ClientIndex];

  if (!NETWORK.multiCollatDiamondAddress || NETWORK.multiCollatDiamondAddress?.length < 42) {
    throw Error('Missing `multiCollatDiamondAddress` network configuration.');
  }

  app.multiCollatContract = new newWeb3Client.eth.Contract(abis.MULTI_COLLAT_DIAMOND, NETWORK.multiCollatDiamondAddress);

  const supportedCollaterals = [];
  const stacks = await Promise.all(
    NETWORK.supportedCollaterals.map(async (stackConfig) => {
      return initStack(newWeb3Client, app.multiCollatContract, stackConfig);
    })
  );

  for (const stack of stacks) {
    supportedCollaterals.push(stack.collateral);
    app.stacks[stack.collateral] = stack;
  }
  app.collaterals = supportedCollaterals;

  const wasFirstClientSelection = app.currentlySelectedWeb3Client === null;

  // Update the globally selected provider with this new provider
  app.currentlySelectedWeb3ClientIndex = newWeb3ClientIndex;
  app.currentlySelectedWeb3Client = newWeb3Client;

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

  app.collaterals.map(async (collat) => {
    const stack = app.stacks[collat];
    checkContractApprovals(stack, [stack.contracts.storage.options.address, stack.contracts.nftRewards.options.address]);
  });

  appLogger.info('New web3 client selection completed. Took: ' + (performance.now() - executionStartTime) + 'ms');
}

async function checkContractApprovals(stack, addresses) {
  for (const contract of addresses) {
    await checkLinkAllowance(stack, contract);
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

    if (newBlockNumber > app.blocks.latestL2Block) {
      app.blocks.latestL2Block = newBlockNumber;
    }

    app.blocks.web3ClientBlocks[providerIndex] = newBlockNumber;

    appLogger.debug(`New block received ${newBlockNumber} from provider ${providerUrl}...`);

    if (app.currentlySelectedWeb3ClientIndex === providerIndex) {
      return;
    }

    const blockDiff =
      app.currentlySelectedWeb3ClientIndex === -1
        ? newBlockNumber
        : newBlockNumber - app.blocks.web3ClientBlocks[app.currentlySelectedWeb3ClientIndex];

    // Check if this block is more recent than the currently selected provider's block by the max drift
    // and, if so, switch now
    if (blockDiff > MAX_PROVIDER_BLOCK_DRIFT) {
      appLogger.info(
        `Switching to provider ${providerUrl} #${providerIndex} because it is ${blockDiff} block(s) ahead of current provider (${newBlockNumber} vs ${
          app.blocks.web3ClientBlocks[app.currentlySelectedWeb3ClientIndex]
        })`
      );

      setCurrentWeb3Client(providerIndex);
    }
  });

  return web3Client;
}

const nonceManager = new NonceManager(
  process.env.PUBLIC_KEY,
  () => app.currentlySelectedWeb3Client,
  createLogger('NONCE_MANAGER', process.env.LOG_LEVEL)
);

for (let web3ProviderUrlIndex = 0; web3ProviderUrlIndex < WEB3_PROVIDER_URLS.length; web3ProviderUrlIndex++) {
  app.web3Clients.push(createWeb3Client(web3ProviderUrlIndex, WEB3_PROVIDER_URLS[web3ProviderUrlIndex]));
}

let MAX_PROVIDER_BLOCK_DRIFT =
  (process.env.MAX_PROVIDER_BLOCK_DRIFT ?? '').length > 0 ? parseInt(process.env.MAX_PROVIDER_BLOCK_DRIFT, 10) : 2;

if (MAX_PROVIDER_BLOCK_DRIFT < 1) {
  appLogger.warn(`MAX_PROVIDER_BLOCK_DRIFT is set to ${MAX_PROVIDER_BLOCK_DRIFT}; setting to minimum of 1.`);

  MAX_PROVIDER_BLOCK_DRIFT = 1;
}

setInterval(() => {
  if (app.currentlySelectedWeb3ClientIndex === -1) {
    appLogger.warn('No Web3 client has been selected yet!');
  } else {
    appLogger.info(
      `Current Web3 Client: ${app.currentlySelectedWeb3Client.currentProvider.url} (#${app.currentlySelectedWeb3ClientIndex})`
    );
  }

  executionStats = {
    ...executionStats,
    lastNonce: nonceManager.getLastNonce(),
    uptime: DateTime.now()
      .diff(DateTime.fromJSDate(executionStats.startTime), ['days', 'hours', 'minutes', 'seconds'])
      .toFormat("d'd'h'h'm'm's's'"),
  };

  appLogger.info(`Execution Stats:`, executionStats);
}, WEB3_STATUS_REPORT_INTERVAL_MS);

setInterval(async () => {
  if (app.currentlySelectedWeb3ClientIndex === -1) {
    appLogger.warn('No Web3 client has been selected yet, will not refresh collateral prices!');
  } else {
    await Promise.all(
      app.collaterals.map(async (collat) => {
        const stack = app.stacks[collat];
        const price = ((await stack.contracts.aggregator.methods.getCollateralPriceUsd().call()) + '') / 1e8;

        if (isNaN(price)) {
          appLogger.error(`[${collat}] Collateral Price update returned invalid value`, price);
        } else {
          stack.price = price;
          appLogger.debug(`[${collat}] Price updated to ${price}, ${app.stacks[collat].price}`);
        }
      })
    );
    appLogger.debug(`Collateral Prices updated!`);
  }
}, COLLATERAL_PRICE_REFRESH_INTERVAL_MS);
// -----------------------------------------
// FETCH DYNAMIC GAS PRICE
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
          app.standardTransactionGasFees = {
            maxFee: Math.round(gasPriceData.standard.maxFee),
            maxPriorityFee: Math.round(gasPriceData.standard.maxPriorityFee),
          };

          app.gas.priorityTransactionMaxPriorityFeePerGas = Math.round(
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
        app.gasPriceBn = new BN(await app.currentlySelectedWeb3Client.eth.getGasPrice());
      }
    }
  }
}

// -----------------------------------------
// FETCH PAIRS
// -----------------------------------------

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

  const pairsCount = await app.multiCollatContract.methods.pairsCount().call();

  if (currentTradingVariablesFetchPromise !== null) {
    appLogger.warn(`A current fetchTradingVariables call was already in progress, just awaiting that...`);

    return await currentTradingVariablesFetchPromise;
  }

  try {
    currentTradingVariablesFetchPromise = Promise.all([
      fetchGlobalPairs(pairsCount),
      fetchPairs(pairsCount),
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

  async function fetchGlobalPairs(pairsCount) {
    const [depths, maxLeverage, pairsBackend] = await Promise.all([
      app.multiCollatContract.methods.getPairDepths([...Array(parseInt(pairsCount)).keys()]).call(),
      app.multiCollatContract.methods.getAllPairsRestrictedMaxLeverage().call(),
      Promise.all(
        [...Array(parseInt(pairsCount)).keys()].map(async (_, pairIndex) => app.multiCollatContract.methods.pairsBackend(pairIndex).call())
      ),
    ]);

    app.pairMaxLeverage = new Map(maxLeverage.map((l, idx) => [idx, parseInt(l)]));
    app.pairDepths = depths.map((value) => ({
      onePercentDepthAboveUsd: parseFloat(value.onePercentDepthAboveUsd),
      onePercentDepthBelowUsd: parseFloat(value.onePercentDepthBelowUsd),
    }));
    app.pairs = pairsBackend;
    app.spreadsP = pairsBackend.map((p) => p['0'].spreadP);
  }

  async function fetchPairs(pairsCount) {
    await Promise.all(
      app.collaterals.map(async (collat) => {
        const contracts = app.stacks[collat].contracts;
        const maxPerPair = await contracts.storage.methods.maxTradesPerPair().call();

        const newOpenInterests = [];

        await Promise.all(
          [...Array(parseInt(pairsCount)).keys()].map(async (_, pairIndex) => {
            const [openInterestLong, openInterestShort, openInterestMax] = await Promise.all([
              contracts.storage.methods.openInterestDai(pairIndex, 0).call(),
              contracts.storage.methods.openInterestDai(pairIndex, 1).call(),
              contracts.borrowingFees.methods.getCollateralPairMaxOi(pairIndex).call(),
            ]);

            newOpenInterests[pairIndex] = {
              long: openInterestLong,
              short: openInterestShort,
              max: parseFloat(openInterestMax) + '', // already normalized
            };
          })
        );

        app.stacks[collat].maxTradesPerPair = maxPerPair;
        app.stacks[collat].openInterests = newOpenInterests;
      })
    );
  }

  async function fetchBorrowingFees() {
    await Promise.all(
      app.collaterals.map(async (collat) => {
        const contracts = app.stacks[collat].contracts;
        const borrowingFeesInfo = await contracts.borrowingFees.methods.getAllPairs().call();

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
            ? await contracts.borrowingFees.methods
                .getGroups(Array.from(Array(+borrowingFeesGroupIds[borrowingFeesGroupIds.length - 1] + 1).keys()))
                .call()
            : [];

        const [borrowingFeesGroups, groupExponents] = [borrowingFeesGroupsInfo['0'], borrowingFeesGroupsInfo['1']];
        app.stacks[collat].borrowingFeesContext.pairs = borrowingFeesPairs;
        app.stacks[collat].borrowingFeesContext.groups = borrowingFeesGroups.map((value, idx) => ({
          oiLong: parseFloat(value.oiLong) / 1e10,
          oiShort: parseFloat(value.oiShort) / 1e10,
          feePerBlock: parseFloat(value.feePerBlock) / 1e10,
          accFeeLong: parseFloat(value.accFeeLong) / 1e10,
          accFeeShort: parseFloat(value.accFeeShort) / 1e10,
          accLastUpdatedBlock: parseInt(value.accLastUpdatedBlock),
          maxOi: parseFloat(value.maxOi) / 1e10,
          feeExponent: parseInt(groupExponents[idx]) || 1,
        }));
      })
    );
  }
  async function fetchOiWindows(pairLength) {
    const { startTs, windowsDuration, windowsCount } = await app.multiCollatContract.methods.getOiWindowsSettings().call();

    app.oiWindowsSettings = {
      startTs: parseFloat(startTs),
      windowsDuration: parseFloat(windowsDuration),
      windowsCount: parseFloat(windowsCount),
    };

    const currWindowId = getCurrentOiWindowId(app.oiWindowsSettings);

    // Always fetch max window count
    const windowsToCheck = [...Array(5).keys()].map((i) => currWindowId - i).filter((v) => v > -1);

    const oiWindowsTemp = (
      await Promise.all(
        [...Array(parseInt(pairLength)).keys()].map((_, pairIndex) =>
          app.multiCollatContract.methods
            .getOiWindows(app.oiWindowsSettings.windowsDuration, pairIndex, windowsToCheck)
            .call()
            .then((r) => r.map((w) => ({ oiLongUsd: w.oiLongUsd, oiShortUsd: w.oiShortUsd })))
        )
      )
    ).map((pairWindows) => pairWindows.reduce((acc, curr, i) => ({ ...acc, [windowsToCheck[i]]: curr }), {}));

    app.oiWindows = convertOiWindows(oiWindowsTemp);
  }
}

// -----------------------------------------
// LOAD OPEN TRADES
// -----------------------------------------

function buildTriggerIdentifier(collateral, trader, pairIndex, index, limitType) {
  return `trigger://${collateral}/${trader}/${pairIndex}/${index}[lt=${limitType}]`;
}

let fetchOpenTradesRetryTimerId = null;

async function fetchOpenTrades() {
  appLogger.info('Fetching open trades...');
  try {
    if (app.spreadsP.length === 0) {
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
          buildTradeIdentifier(trade.collateral, trade.trader, trade.pairIndex, trade.index, trade.openPrice === undefined),
          trade,
        ])
    );

    const newTradesLastUpdated = new Map(await populateTradesLastUpdated(openLimitOrders, pairTrades, USE_MULTICALL));

    app.knownOpenTrades = newOpenTrades;
    app.tradesLastUpdated = newTradesLastUpdated;

    appLogger.info(`Fetched ${app.knownOpenTrades.size} total open trade(s) in ${performance.now() - start}ms.`);

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

    const limitOrders = (
      await Promise.all(
        app.collaterals.map(async (collat) => {
          const contracts = app.stacks[collat].contracts;
          const openLimitOrders = await contracts.storage.methods.getOpenLimitOrders().call();

          const openLimitOrdersWithTypes = await Promise.all(
            openLimitOrders.map(async (olo) => {
              const [type, tradeData] = await Promise.all([
                contracts.nftRewards.methods.openLimitOrderTypes(olo.trader, olo.pairIndex, olo.index).call(),
                contracts.callbacks.methods.tradeData(olo.trader, olo.pairIndex, olo.index, 1).call(),
              ]);

              return {
                ...olo,
                type,
                maxSlippageP: parseFloat(tradeData.maxSlippageP.toString()) / 1e10 || 1,
                collateral: collat,
              };
            })
          );

          appLogger.info(`[${collat}] Fetched ${openLimitOrdersWithTypes.length} open limit order(s).`);

          executionStats = {
            ...executionStats,
            [`limitOrderCount-${collat}`]: openLimitOrdersWithTypes.length,
          };

          return openLimitOrdersWithTypes;
        })
      )
    ).reduce((acc, curr, i) => [...acc, ...curr], []);

    appLogger.info(`Fetched ${limitOrders.length} open limit order(s).`);

    return limitOrders;
  }

  async function fetchOpenPairTrades() {
    appLogger.info('Fetching open pair trades...');

    const ethersProvider = new ethers.providers.WebSocketProvider(app.currentlySelectedWeb3Client.currentProvider.connection._url);
    const ethersMultiCollat = getEthersContract(app.multiCollatContract, ethersProvider);

    // loop and merge all trades
    const allTrades = (
      await Promise.all(
        app.collaterals.map(async (collat) => {
          const contracts = app.stacks[collat].contracts;

          const ethersStorage = getEthersContract(contracts.storage, ethersProvider);
          const ethersBorrowingFees = getEthersContract(contracts.borrowingFees, ethersProvider);
          const ethersCallbacks = getEthersContract(contracts.callbacks, ethersProvider);

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

          const openTrades = transformRawTrades(openTradesRaw, collat);
          appLogger.info(`[${collat}] Fetched ${openTrades.length} new open pair trade(s).`);

          executionStats = {
            ...executionStats,
            [`openTradesCount-${collat}`]: openTrades.length,
          };

          return openTrades;
        })
      )
    ).reduce((acc, curr, i) => [...acc, ...curr], []);

    appLogger.info(`Fetched ${allTrades.length} new open pair trade(s).`);

    return allTrades;
  }

  async function populateTradesLastUpdated(openLimitOrders, pairTrades, useMulticall) {
    appLogger.info('Fetching last updated info...');

    let olLastUpdated, tLastUpdated;
    if (useMulticall) {
      const ethersProvider = new ethers.providers.WebSocketProvider(app.currentlySelectedWeb3Client.currentProvider.connection._url);
      const multicallProvider = new Provider();
      await multicallProvider.init(ethersProvider);

      // Prep multicall callbacks for every stack
      const callbacksMulticalls = {};
      app.collaterals.map(
        (collat) => (callbacksMulticalls[collat] = new Contract(app.stacks[collat].contracts.callbacks.options.address, abis.CALLBACKS))
      );

      olLastUpdated = await multicallProvider.all(
        openLimitOrders.map((order) =>
          callbacksMulticalls[order.collateral].tradeLastUpdated(order.trader, order.pairIndex, order.index, TRADE_TYPE.LIMIT)
        ),
        'latest'
      );

      tLastUpdated = await multicallProvider.all(
        pairTrades.map((order) =>
          callbacksMulticalls[order.collateral].tradeLastUpdated(order.trader, order.pairIndex, order.index, TRADE_TYPE.MARKET)
        ),
        'latest'
      );
    } else {
      // Consider adjusting batch size or using multicall for better performance (see above)
      const batchSize = 100;
      for (let i = 0; i < openLimitOrders.length; i += batchSize) {
        const batch = openLimitOrders.slice(i, i + batchSize);
        const batchLastUpdated = await Promise.all(
          batch.map((order) =>
            fetchTradeLastUpdated(
              app.stacks[order.collateral].contracts.callbacks,
              order.trader,
              order.pairIndex,
              order.index,
              TRADE_TYPE.LIMIT
            )
          )
        );
        olLastUpdated = olLastUpdated ? olLastUpdated.concat(batchLastUpdated) : batchLastUpdated;
      }
      for (let i = 0; i < pairTrades.length; i += batchSize) {
        const batch = pairTrades.slice(i, i + batchSize);
        const batchLastUpdated = await Promise.all(
          batch.map((order) =>
            fetchTradeLastUpdated(
              app.stacks[order.collateral].contracts.callbacks,
              order.trader,
              order.pairIndex,
              order.index,
              TRADE_TYPE.MARKET
            )
          )
        );
        tLastUpdated = tLastUpdated ? tLastUpdated.concat(batchLastUpdated) : batchLastUpdated;
      }
    }

    appLogger.info(`Fetched last updated info for ${tLastUpdated.length + olLastUpdated.length} trade(s).`);
    return transformLastUpdated(openLimitOrders, olLastUpdated, pairTrades, tLastUpdated);
  }
}

async function fetchTradeLastUpdated(callbacks, trader, pairIndex, index, tradeType) {
  const lastUpdated = await callbacks.methods.tradeLastUpdated(trader, pairIndex, index, tradeType).call();
  return {
    tp: +lastUpdated.tp,
    sl: +lastUpdated.sl,
    limit: +lastUpdated.limit,
  };
}
// -----------------------------------------
// WATCH TRADING EVENTS
// -----------------------------------------

function watchLiveTradingEvents() {
  try {
    // Handle stack specific event subs
    app.collaterals.map(async (collat) => {
      const stack = app.stacks[collat];
      const subs = stack.eventSubs;

      if (subs?.trading && subs?.trading?.id) {
        subs.trading.unsubscribe();
      }

      subs.trading = stack.contracts.trading.events.allEvents({ fromBlock: 'latest' }).on('data', (event) => {
        if (['OpenLimitPlaced', 'OpenLimitUpdated', 'OpenLimitCanceled', 'TpUpdated', 'SlUpdated'].indexOf(event.event) === -1) {
          return;
        }

        setTimeout(() => synchronizeOpenTrades(stack, event), EVENT_CONFIRMATIONS_MS);
      });

      if (subs?.callbacks && subs?.callbacks?.id) {
        subs.callbacks.unsubscribe();
      }

      subs.callbacks = stack.contracts.callbacks.events.allEvents({ fromBlock: 'latest' }).on('data', (event) => {
        if (['MarketExecuted', 'LimitExecuted', 'MarketCloseCanceled', 'SlUpdated', 'SlCanceled'].indexOf(event.event) === -1) {
          return;
        }

        setTimeout(() => synchronizeOpenTrades(stack, event), EVENT_CONFIRMATIONS_MS);
      });

      if (subs?.borrowingFees && subs?.borrowingFees?.id) {
        subs.borrowingFees.unsubscribe();
      }

      subs.borrowingFees = stack.contracts.borrowingFees.events.allEvents({ fromBlock: 'latest' }).on('data', (event) => {
        if (['PairAccFeesUpdated', 'GroupAccFeesUpdated', 'GroupOiUpdated', 'PairParamsUpdated'].indexOf(event.event) < 0) {
          return;
        }

        setTimeout(() => handleBorrowingFeesEvent(stack, event), EVENT_CONFIRMATIONS_MS);
      });
    });

    // Handle cross-stack event subs
    if (app.eventSubs?.multiCollat && app.eventSubs?.multiCollat?.id) {
      app.eventSubs.multiCollat.unsubscribe();
    }

    app.eventSubs.multiCollat = app.multiCollatContract.events.allEvents({ fromBlock: 'latest' }).on('data', (event) => {
      if (
        [
          'PriceImpactOpenInterestAdded',
          'PriceImpactOpenInterestRemoved',
          'PriceImpactOiTransferredPairs',
          'PriceImpactWindowsDurationUpdated',
          'PriceImpactWindowsCountUpdated',
          'PairCustomMaxLeverageUpdated',
        ].indexOf(event.event) === -1
      ) {
        return;
      }

      setTimeout(() => handleMultiCollatEvents(event), EVENT_CONFIRMATIONS_MS);
    });
  } catch {
    setTimeout(() => {
      watchLiveTradingEvents();
    }, 2 * 1000);
  }
}

async function handleMultiCollatEvents(event) {
  try {
    if (event.event === 'PriceImpactOpenInterestAdded') {
      const { pairIndex, windowId, long, openInterestUsd } = event.returnValues.oiWindowUpdate;

      increaseWindowOi(app.oiWindows, pairIndex, windowId, long, openInterestUsd);

      appLogger.verbose(`Processed ${event.event}.`);
    } else if (event.event === 'PriceImpactOpenInterestRemoved') {
      const { oiWindowUpdate, notOutdated } = event.returnValues;

      decreaseWindowOi(
        app.oiWindows,
        oiWindowUpdate.pairIndex,
        oiWindowUpdate.windowId,
        oiWindowUpdate.long,
        oiWindowUpdate.openInterestUsd,
        notOutdated
      );

      appLogger.verbose(`Processed ${event.event}.`);
    } else if (event.event === 'PriceImpactOiTransferredPairs') {
      const { pairsCount, prevCurrentWindowId, prevEarliestWindowId, newCurrentWindowId } = event.returnValues;

      app.oiWindows = transferOiWindows(app.oiWindows, pairsCount, prevCurrentWindowId, prevEarliestWindowId, newCurrentWindowId);

      appLogger.verbose(`Processed ${event.event}.`);
    } else if (event.event === 'PriceImpactWindowsDurationUpdated') {
      const { windowsDuration } = event.returnValues;

      updateWindowsDuration(app.oiWindowsSettings, windowsDuration);

      appLogger.verbose(`Processed ${event.event}.`);
    } else if (event.event === 'PriceImpactWindowsCountUpdated') {
      const { windowsCount } = event.returnValues;

      updateWindowsCount(app.oiWindowsSettings, windowsCount);

      appLogger.verbose(`Processed ${event.event}.`);
    } else if (event.event === 'PairCustomMaxLeverageUpdated') {
      const { index, maxLeverage } = event.returnValues;

      app.pairMaxLeverage.set(index, parseFloat(maxLeverage));

      appLogger.info(`${event.event}: Set pairMaxLeverage for pair ${index} to ${maxLeverage}.`);
    }
  } catch (error) {
    appLogger.error('Error occurred when handling BorrowingFees event.', error);
  }
}

async function synchronizeOpenTrades(stack, event) {
  try {
    const { contracts, collateral } = stack;
    const currentKnownOpenTrades = app.knownOpenTrades;

    const eventName = event.event;
    const eventReturnValues = event.returnValues;

    appLogger.info(`Synchronizing open trades based on event ${eventName} from block ${event.blockNumber}...`);

    if (currentKnownOpenTrades === null) {
      appLogger.warn(
        `Known open trades not yet initialized, cannot synchronize ${eventName} from block ${event.blockNumber} at this time!`
      );

      return;
    }

    if (eventName === 'OpenLimitCanceled') {
      const { trader, pairIndex, index } = eventReturnValues;

      const tradeKey = buildTradeIdentifier(collateral, trader, pairIndex, index, true);
      const existingKnownOpenTrade = currentKnownOpenTrades.get(tradeKey);

      if (existingKnownOpenTrade !== undefined) {
        currentKnownOpenTrades.delete(tradeKey);

        appLogger.info(`Synchronize open trades from event ${eventName}: Removed limit for ${tradeKey}`);
      } else {
        appLogger.info(`Synchronize open trades from event ${eventName}: Limit not found for ${tradeKey}`);
      }
    } else if (eventName === 'OpenLimitPlaced' || eventName === 'OpenLimitUpdated') {
      const { trader, pairIndex, index } = eventReturnValues;

      const [hasOpenLimitOrder, openLimitOrderId] = await Promise.all([
        contracts.storage.methods.hasOpenLimitOrder(trader, pairIndex, index).call(),
        contracts.storage.methods.openLimitOrderIds(trader, pairIndex, index).call(),
      ]);

      if (hasOpenLimitOrder === false) {
        appLogger.info(`Open limit order not found for ${collateral}/${trader}/${pairIndex}/${index}; ignoring!`);
      } else {
        const [limitOrder, type, lastUpdated, tradeData] = await Promise.all([
          contracts.storage.methods.openLimitOrders(openLimitOrderId).call(),
          contracts.nftRewards.methods.openLimitOrderTypes(trader, pairIndex, index).call(),
          fetchTradeLastUpdated(contracts.callbacks, trader, pairIndex, index, TRADE_TYPE.LIMIT),
          contracts.callbacks.methods.tradeData(trader, pairIndex, index, 1).call(),
        ]);

        limitOrder.collateral = collateral;
        limitOrder.type = type;
        limitOrder.maxSlippageP = parseFloat(tradeData.maxSlippageP.toString()) / 1e10 || 1;

        const tradeKey = buildTradeIdentifier(collateral, trader, pairIndex, index, true);

        if (currentKnownOpenTrades.has(tradeKey)) {
          appLogger.info(`Synchronize open trades from event ${eventName}: Updating open limit order for ${tradeKey}`);
        } else {
          appLogger.info(`Synchronize open trades from event ${eventName}: Storing new open limit order for ${tradeKey}`);
        }

        app.tradesLastUpdated.set(tradeKey, lastUpdated);
        currentKnownOpenTrades.set(tradeKey, limitOrder);
      }
    } else if (eventName === 'TpUpdated' || eventName === 'SlUpdated' || eventName === 'SlCanceled') {
      const { trader, pairIndex, index } = eventReturnValues;

      // Fetch all fresh trade information to update known open trades
      const [trade, tradeInfo, tradeInitialAccFees, lastUpdated] = await Promise.all([
        contracts.storage.methods.openTrades(trader, pairIndex, index).call(),
        contracts.storage.methods.openTradesInfo(trader, pairIndex, index).call(),
        contracts.borrowingFees.methods.initialAccFees(trader, pairIndex, index).call(),
        fetchTradeLastUpdated(contracts.callbacks, trader, pairIndex, index, TRADE_TYPE.MARKET),
      ]);

      trade.collateral = collateral;
      trade.tradeInfo = tradeInfo;
      trade.tradeInitialAccFees = convertTradeInitialAccFees({
        borrowing: {
          accPairFee: tradeInitialAccFees.accPairFee,
          accGroupFee: tradeInitialAccFees.accGroupFee,
          block: tradeInitialAccFees.block,
        },
      });

      const tradeKey = buildTradeIdentifier(collateral, trader, pairIndex, index, false);
      app.tradesLastUpdated.set(tradeKey, lastUpdated);
      currentKnownOpenTrades.set(tradeKey, trade);

      appLogger.info(`Synchronize open trades from event ${eventName}: Updated trade ${tradeKey}`);
    } else if (eventName === 'MarketCloseCanceled') {
      const { trader, pairIndex, index } = eventReturnValues;
      const tradeKey = buildTradeIdentifier(collateral, trader, pairIndex, index, false);

      const trade = await contracts.storage.methods.openTrades(trader, pairIndex, index).call();

      // Make sure the trade is still actually active
      if (parseInt(trade.leverage, 10) > 0) {
        // Fetch all fresh trade information to update known open trades
        const [tradeInfo, tradeInitialAccFees, lastUpdated] = await Promise.all([
          contracts.storage.methods.openTradesInfo(trader, pairIndex, index).call(),
          contracts.borrowingFees.methods.initialAccFees(trader, pairIndex, index).call(),
          fetchTradeLastUpdated(contracts.callbacks, trader, pairIndex, index, TRADE_TYPE.MARKET),
        ]);

        trade.collateral = collateral;
        trade.tradeInfo = tradeInfo;
        trade.tradeInitialAccFees = convertTradeInitialAccFees({
          borrowing: {
            accPairFee: tradeInitialAccFees.accPairFee,
            accGroupFee: tradeInitialAccFees.accGroupFee,
            block: tradeInitialAccFees.block,
          },
        });

        app.tradesLastUpdated.set(tradeKey, lastUpdated);
        currentKnownOpenTrades.set(tradeKey, trade);
      } else {
        app.tradesLastUpdated.delete(tradeKey);
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
        const openTradeKey = buildTradeIdentifier(collateral, trader, pairIndex, limitIndex, true);

        if (currentKnownOpenTrades.has(openTradeKey)) {
          appLogger.info(`Synchronize open trades from event ${eventName}: Removed open limit trade ${openTradeKey}.`);

          app.tradesLastUpdated.delete(openTradeKey);
          currentKnownOpenTrades.delete(openTradeKey);
        } else {
          appLogger.warn(
            `Synchronize open trades from event ${eventName}: Open limit trade ${openTradeKey} was not found? Unable to remove.`
          );
        }

        resetRetryCounter(buildTriggerIdentifier(collateral, trader, pairIndex, limitIndex, 3));
      }

      const [tradeInfo, tradeInitialAccFees, lastUpdated] = await Promise.all([
        contracts.storage.methods.openTradesInfo(trader, pairIndex, index).call(),
        contracts.borrowingFees.methods.initialAccFees(trader, pairIndex, index).call(),
        fetchTradeLastUpdated(contracts.callbacks, trader, pairIndex, index, TRADE_TYPE.MARKET),
      ]);

      const tradeKey = buildTradeIdentifier(collateral, trader, pairIndex, index, false);

      app.tradesLastUpdated.set(tradeKey, lastUpdated);
      currentKnownOpenTrades.set(tradeKey, {
        ...trade,
        collateral,
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
      resetRetryCounter(buildTriggerIdentifier(collateral, trader, pairIndex, index, 0));
      resetRetryCounter(buildTriggerIdentifier(collateral, trader, pairIndex, index, 1));
      resetRetryCounter(buildTriggerIdentifier(collateral, trader, pairIndex, index, 2));
    } else if (
      (eventName === 'MarketExecuted' && eventReturnValues.open === false) ||
      (eventName === 'LimitExecuted' && eventReturnValues.orderType !== '3')
    ) {
      const { trader, pairIndex, index } = eventReturnValues.t;
      const tradeKey = buildTradeIdentifier(collateral, trader, pairIndex, index, false);

      const triggeredOrderTrackingInfoIdentifier = buildTriggerIdentifier(
        collateral,
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
        app.tradesLastUpdated.delete(tradeKey);
        appLogger.info(`Synchronize open trades from event ${eventName}: Removed ${tradeKey} from known open trades.`);
      } else {
        appLogger.info(
          `Synchronize open trades from event ${eventName}: Trade ${tradeKey} was not found in known open trades; just ignoring.`
        );
      }

      const triggeredOrderDetails = app.triggeredOrders.get(triggeredOrderTrackingInfoIdentifier);

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
          app.triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier);
        }
      } else {
        appLogger.debug(
          `Synchronize open trades from event ${eventName}: Order ${triggeredOrderTrackingInfoIdentifier} was not being tracked as triggered by us.`
        );
      }

      resetRetryCounter(triggeredOrderTrackingInfoIdentifier);
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

async function handleBorrowingFeesEvent(stack, event) {
  try {
    if (event.event === 'PairAccFeesUpdated') {
      const { pairIndex, accFeeLong, accFeeShort } = event.returnValues;
      const pairBorrowingFees = stack.borrowingFeesContext.pairs[pairIndex];

      if (pairBorrowingFees) {
        pairBorrowingFees.accFeeLong = parseFloat(accFeeLong) / 1e10;
        pairBorrowingFees.accFeeShort = parseFloat(accFeeShort) / 1e10;
        pairBorrowingFees.accLastUpdateBlock = parseInt(event.blockNumber);
      }
    } else if (event.event === 'GroupAccFeesUpdated') {
      const { groupIndex, accFeeLong, accFeeShort } = event.returnValues;

      const groupBorrowingFees = stack.borrowingFeesContext.groups[groupIndex];

      if (groupBorrowingFees) {
        groupBorrowingFees.accFeeLong = parseFloat(accFeeLong) / 1e10;
        groupBorrowingFees.accFeeShort = parseFloat(accFeeShort) / 1e10;
        groupBorrowingFees.accLastUpdateBlock = parseInt(event.blockNumber);
      }
    } else if (event.event === 'GroupOiUpdated') {
      const { groupIndex, oiLong, oiShort } = event.returnValues;

      const groupBorrowingFees = stack.borrowingFeesContext.groups[groupIndex];

      if (groupBorrowingFees) {
        groupBorrowingFees.oiLong = parseFloat(oiLong) / 1e10;
        groupBorrowingFees.oiShort = parseFloat(oiShort) / 1e10;
      }
    } else if (event.event === 'PairParamsUpdated') {
      const { pairIndex, maxOi } = event.returnValues;

      stack.openInterests[pairIndex].max = (parseFloat(maxOi) * stack.collateralConfig.precision) / 1e10 + '';
      stack.borrowingFeesContext.pairs[pairIndex].maxOi = parseFloat(maxOi) / 1e10;
    }
  } catch (error) {
    appLogger.error('Error occurred when handling BorrowingFees event.', error);
  }
}

function resetRetryCounter(triggerId) {
  app.triggerRetries.delete(triggerId);
}

// ---------------------------------------------
// FETCH CURRENT PRICES & TRIGGER ORDERS
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
    const currentKnownOpenTrades = app.knownOpenTrades;

    if (currentKnownOpenTrades === null) {
      appLogger.debug('Known open trades not yet loaded; unable to begin any processing yet!');

      return;
    }

    if (app.spreadsP.length === 0) {
      appLogger.debug('Spreads are not yet loaded; unable to process any trades!');

      return;
    }

    if (app.collaterals.some((collat) => !app.stacks[collat].allowedLink.storage || !app.stacks[collat].allowedLink.rewards)) {
      appLogger.warn('LINK is not currently allowed for the configured account; unable to process any trades!');

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

      await Promise.allSettled(
        [...currentKnownOpenTrades.values()].map(async (openTrade) => {
          const { collateral, trader, pairIndex, index, buy } = openTrade;
          if (!collateral) {
            appLogger.error('Trade loaded without collateral information, this should not be happening!');
            return;
          }

          const stack = app.stacks[collateral];
          if (stack === undefined) {
            appLogger.error('Unknown collateral stack, this should not be happening!');
            return;
          }

          const price = pairPrices.get(parseInt(pairIndex));
          if (price === undefined) return;

          const isPendingOpenLimitOrder = openTrade.openPrice === undefined;
          const openTradeKey = buildTradeIdentifier(collateral, trader, pairIndex, index, isPendingOpenLimitOrder);
          // Under certain conditions (forex/stock market just opened, server restart, etc) the price is not
          // available, so we need to make sure we skip any processing in that case
          if ((price ?? 0) <= 0) {
            appLogger.debug(`Received ${price} for close price for pair ${pairIndex}; skipping processing of ${openTradeKey}!`);

            return;
          }

          let orderType = -1;
          let liqPrice;
          if (isPendingOpenLimitOrder === false) {
            // Hotfix openPrice of 0
            if (parseInt(openTrade.openPrice) === 0) return;

            const tp = parseFloat(openTrade.tp) / 1e10;
            const sl = parseFloat(openTrade.sl) / 1e10;
            liqPrice = getTradeLiquidationPrice(stack, openTrade);

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
                parseFloat(app.spreadsP[pairIndex]) / 1e10 / 100,
                openTrade.buy,
                (parseFloat(openTrade.positionSize) / stack.collateralConfig.precision) * stack.price,
                parseInt(openTrade.leverage),
                app.pairDepths[openTrade.pairIndex],
                app.oiWindowsSettings,
                app.oiWindows[openTrade.pairIndex]
              ) * 100;

            const interestDai = buy
              ? parseFloat(stack.openInterests[openTrade.pairIndex].long)
              : parseFloat(stack.openInterests[openTrade.pairIndex].short);

            const newInterestDai = interestDai + posDai;

            const maxInterestDai = parseFloat(stack.openInterests[openTrade.pairIndex].max);

            const minPrice = parseFloat(openTrade.minPrice) / 1e10;
            const maxPrice = parseFloat(openTrade.maxPrice) / 1e10;

            if (
              isValidLeverage(openTrade.pairIndex, parseFloat(openTrade.leverage)) &&
              newInterestDai <= maxInterestDai &&
              spreadWithPriceImpactP * openTrade.leverage <= MAX_OPEN_NEGATIVE_PNL_P &&
              withinMaxGroupOi(openTrade.pairIndex, buy, posDai / stack.collateralConfig.precision, stack.borrowingFeesContext) &&
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

          const groupId = parseInt(app.pairs[pairIndex][0]['groupIndex']);
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

          const lastUpdated = app.tradesLastUpdated.get(openTradeKey);

          if (!lastUpdated && orderType !== 2) {
            appLogger.warn(`Last updated information for ${openTradeKey} is not available`);
            return;
          }

          const triggeredOrderTrackingInfoIdentifier = buildTriggerIdentifier(collateral, trader, pairIndex, index, orderType);

          // Make sure this order hasn't already been triggered
          if (app.triggeredOrders.has(triggeredOrderTrackingInfoIdentifier)) {
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
          app.triggeredOrders.set(triggeredOrderTrackingInfoIdentifier, triggeredOrderDetails);

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
                  to: stack.contracts.trading.options.address,
                  data: stack.contracts.trading.methods.executeNftOrder(packNft(orderType, trader, pairIndex, index, 0, 0)).encodeABI(),
                },
                true
              );

              // NOTE: technically this should execute synchronously because we're supplying all necessary details on
              // the transaction object up front
              const signedTransaction = await app.currentlySelectedWeb3Client.eth.accounts.signTransaction(
                orderTransaction,
                process.env.PRIVATE_KEY
              );

              if (DRY_RUN_MODE === false) {
                await app.currentlySelectedWeb3Client.eth.sendSignedTransaction(signedTransaction.rawTransaction);
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
                if (app.triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier)) {
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
                    if (!app.triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier)) {
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
                  app.triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier);
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
                    if (!app.triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier)) {
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
                    app.triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier);

                    appLogger.info('Nonce refreshed and tracking of triggered order cleared so it can possibly be retried.');
                  } else {
                    appLogger.error(
                      `🔥 Order ${triggeredOrderTrackingInfoIdentifier} transaction failed for unexpected reason "${errorReason}"; removing order from tracking.`,
                      { error }
                    );

                    // Wait a bit and then clean from triggered orders list so it might get tried again
                    triggeredOrderDetails.cleanupTimerId = setTimeout(() => {
                      if (!app.triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier)) {
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

            app.triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier);

            throw error;
          }
        })
      );
    }
  };

  function getTradeLiquidationPrice(stack, trade) {
    const { tradeInfo, tradeInitialAccFees, pairIndex } = trade;
    const { precision } = stack.collateralConfig;

    return getLiquidationPrice(convertTrade(trade), convertTradeInfo(tradeInfo, precision), tradeInitialAccFees, {
      currentBlock: app.blocks.latestL2Block,
      openInterest: convertOpenInterest(stack.openInterests[pairIndex], precision),
      pairs: stack.borrowingFeesContext.pairs,
      groups: stack.borrowingFeesContext.groups,
    });
  }

  function isValidLeverage(pairIndex, wantedLeverage) {
    const maxLev = app.pairMaxLeverage.get(pairIndex) ?? 0;
    // if pairsMaxLeverage is 0 then it's not currently being restricted
    return maxLev === 0 || maxLev >= wantedLeverage;
  }

  function canRetry(triggerId) {
    if (MAX_RETRIES === -1) return true;

    const retries = app.triggerRetries.get(triggerId) || 0;
    const canRetry = retries < MAX_RETRIES;

    if (canRetry) {
      // to prevent incrementing at every price message. Only
      app.triggerRetries.set(triggerId, retries + 1);
    }

    return canRetry;
  }
}

watchPricingStream();

// ------------------------------------------
// AUTO HARVEST REWARDS
// ------------------------------------------

if (AUTO_HARVEST_MS > 0) {
  async function claimRewards() {
    if (!process.env.ORACLE_ADDRESS) return;

    app.collaterals.map(async (collat) => {
      const contracts = app.stacks[collat].contracts;

      const tx = createTransaction({
        to: contracts.nftRewards.options.address,
        data: contracts.nftRewards.methods.claimRewards(process.env.ORACLE_ADDRESS).encodeABI(),
      });

      try {
        const signed = await app.currentlySelectedWeb3Client.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);

        await app.currentlySelectedWeb3Client.eth.sendSignedTransaction(signed.rawTransaction);

        appLogger.info(`[${collat}] Tokens claimed.`);
      } catch (error) {
        appLogger.error(`[${collat}] Claim tokens transaction failed!`, error);
      }
    });
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
  return {
    chainId: CHAIN_ID,
    nonce: nonceManager.getNextNonce(),
    gas: MAX_GAS_PER_TRANSACTION_HEX,
    ...getTransactionGasFees(NETWORK, isPriority),
    ...additionalTransactionProps,
  };
}

/**
 * Gets the appropriate gas fee settings to apply to a transaction based on the network type.
 * @param {NETWORK} network - The network instance that gas fees are to be retrieved for.
 * @param {boolean} isPriority - Whether or not the transaction is a priority transaction; defaults to false. (NOTE:
 * this controls the amount of gas used for the transaction.)
 * @returns The appropriate gas fee settings for the transaction based on the network type.
 */
function getTransactionGasFees(network, isPriority = false) {
  if (NETWORK.gasMode === GAS_MODE.EIP1559) {
    return {
      maxPriorityFeePerGas: isPriority
        ? toHex(app.gas.priorityTransactionMaxPriorityFeePerGas * 1e9)
        : toHex(app.gas.standardTransactionGasFees.maxPriorityFee * 1e9),
      maxFeePerGas: isPriority ? MAX_FEE_PER_GAS_WEI_HEX : toHex(app.gas.standardTransactionGasFees.maxFee * 1e9),
    };
  } else if (NETWORK.gasMode === GAS_MODE.LEGACY) {
    return {
      gasPrice: toHex(app.gas.gasPriceBn.mul(BN(400)).div(BN(100))),
    };
  }

  throw new Error(`Unsupported gas mode: ${NETWORK?.gasMode}`);
}
