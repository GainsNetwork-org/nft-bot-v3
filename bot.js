// ------------------------------------
// 1. DEPENDENCIES
// ------------------------------------

import dotenv from "dotenv";
import { createLogger } from "./logger.js";
import Web3 from "web3";
import { WebSocket } from "ws";
import fetch from "node-fetch";
import { default as abis } from "./abis.js";
import { NonceManager } from "./NonceManager.js";
import { NFTManager } from "./NftManager.js";
import { DateTime } from "luxon";

// Load base .env file first
dotenv.config();

// If there's a specific NODE_ENV set, attempt to load that environment specific .env file
if(process.env.NODE_ENV) {
	const environmentSpecificFile = `.env.${process.env.NODE_ENV}`;

	dotenv.config({
		path: environmentSpecificFile,
		override: true
	});
}

const appLogger = createLogger('BOT', process.env.LOG_LEVEL);
let executionStats = {
	startTime: new Date()
};

// -----------------------------------------
// 2. GLOBAL VARIABLES
// -----------------------------------------

let allowedLink = false, currentlySelectedWeb3ClientIndex = -1, currentlySelectedWeb3Client = null,
	eventSubTrading = null, eventSubCallbacks = null, eventSubPairInfos = null,
	web3Clients = [], priorityTransactionMaxPriorityFeePerGas = 50, standardTransactionGasFees = { maxFee: 31, maxPriorityFee: 31 },
	spreadsP = [], openInterests = [], collaterals = [], pairParams = [], pairRolloverFees = [], pairFundingFees = [], maxNegativePnlOnOpenP = 0,
	knownOpenTrades = null, triggeredOrders = new Map(),
	storageContract, tradingContract, callbacksContract, vaultContract, pairsStorageContract, nftRewardsContract,
	maxTradesPerPair = 0, linkContract, pairInfosContract;

// --------------------------------------------
// 3. INIT: CHECK ENV VARS & LINK ALLOWANCE
// --------------------------------------------

appLogger.info("Welcome to the gTrade NFT bot!");
if(!process.env.WSS_URLS || !process.env.PRICES_URL || !process.env.STORAGE_ADDRESS
|| !process.env.PRIVATE_KEY || !process.env.PUBLIC_KEY || !process.env.EVENT_CONFIRMATIONS_SEC
|| !process.env.MAX_GAS_PRICE_GWEI || !process.env.CHECK_REFILL_SEC
|| !process.env.VAULT_REFILL_ENABLED || !process.env.AUTO_HARVEST_SEC || !process.env.MIN_PRIORITY_GWEI
|| !process.env.PRIORITY_GWEI_MULTIPLIER || !process.env.MAX_GAS_PER_TRANSACTION
|| !process.env.PAIR_INFOS_ADDRESS){
	appLogger.info("Please fill all parameters in the .env file.");

	process.exit();
}

// Parse non-fixed string configuration constants from environment variables up front
const MAX_FEE_PER_GAS_WEI_HEX = Web3.utils.toHex(parseInt(process.env.MAX_GAS_PRICE_GWEI, 10) * 1e9),
	  MAX_GAS_PER_TRANSACTION_HEX = Web3.utils.toHex(parseInt(process.env.MAX_GAS_PER_TRANSACTION, 10)),
	  CHECK_REFILL_MS = parseFloat(process.env.CHECK_REFILL_SEC) * 1000,
	  EVENT_CONFIRMATIONS_MS = parseFloat(process.env.EVENT_CONFIRMATIONS_SEC) * 1000,
	  AUTO_HARVEST_MS = parseFloat(process.env.AUTO_HARVEST_SEC) * 1000,
	  FAILED_ORDER_TRIGGER_TIMEOUT_MS = (process.env.FAILED_ORDER_TRIGGER_TIMEOUT_SEC ?? '').length > 0 ? parseFloat(process.env.FAILED_ORDER_TRIGGER_TIMEOUT_SEC) * 1000 : 60 * 1000,
	  PRIORITY_GWEI_MULTIPLIER = parseFloat(process.env.PRIORITY_GWEI_MULTIPLIER),
	  MIN_PRIORITY_GWEI = parseFloat(process.env.MIN_PRIORITY_GWEI),
	  OPEN_TRADES_REFRESH_MS = (process.env.OPEN_TRADES_REFRESH_SEC ?? '').length > 0 ? parseFloat(process.env.OPEN_TRADES_REFRESH_SEC) * 1000 : 120,
	  GAS_REFRESH_INTERVAL_MS = (process.env.GAS_REFRESH_INTERVAL_SEC ?? '').length > 0 ? parseFloat(process.env.GAS_REFRESH_INTERVAL_SEC) * 1000 : 3,
	  WEB3_STATUS_REPORT_INTERVAL_MS = (process.env.WEB3_STATUS_REPORT_INTERVAL_SEC ?? '').length > 0 ? parseFloat(process.env.WEB3_STATUS_REPORT_INTERVAL_SEC) * 1000 : 30 * 1000;

const CHAIN_ID = process.env.CHAIN_ID !== undefined ? parseInt(process.env.CHAIN_ID, 10) : 137; // Polygon chain id
const NETWORK_ID = process.env.NETWORK_ID !== undefined ? parseInt(process.env.NETWORK_ID, 10) : CHAIN_ID;
const CHAIN = process.env.CHAIN ?? "mainnet";
const BASE_CHAIN = process.env.BASE_CHAIN;
const HARDFORK = process.env.HARDFORK ?? "london";

const DRY_RUN_MODE = process.env.DRY_RUN_MODE === 'true';

async function checkLinkAllowance() {
	try {
		const allowance = await linkContract.methods.allowance(process.env.PUBLIC_KEY, process.env.STORAGE_ADDRESS).call();

		if(parseFloat(allowance) > 0){
			allowedLink = true;
			appLogger.info("LINK allowance OK.");
		}else{
			appLogger.info("LINK not allowed, approving now.");

			const tx = createTransaction({
				to : linkContract.options.address,
				data : linkContract.methods.approve(process.env.STORAGE_ADDRESS, "115792089237316195423570985008687907853269984665640564039457584007913129639935").encodeABI(),
				maxPriorityFeePerGas: Web3.utils.toHex(standardTransactionGasFees.maxPriorityFee * 1e9),
				maxFeePerGas: Web3.utils.toHex(standardTransactionGasFees.maxFee * 1e9),
				nonce: nonceManager.getNextNonce(),
			});

			try {
				const signed = await currentlySelectedWeb3Client.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);

				await currentlySelectedWeb3Client.eth.sendSignedTransaction(signed.rawTransaction);

				appLogger.info("LINK successfully approved.");
				allowedLink = true;
			} catch(error) {
				appLogger.error("LINK approve transaction failed!", error);

				throw error;
			}
		}
	} catch {
		setTimeout(() => { checkLinkAllowance(); }, 5*1000);
	}
}

// -----------------------------------------
// 4. WEB3 PROVIDER
// -----------------------------------------

const WEB3_PROVIDER_URLS = process.env.WSS_URLS.split(",");
let currentWeb3ClientBlocks = new Array(WEB3_PROVIDER_URLS.length).fill(0);

async function setCurrentWeb3Client(newWeb3ClientIndex){
	appLogger.info("Switching web3 client to " + WEB3_PROVIDER_URLS[newWeb3ClientIndex] + " (#" + newWeb3ClientIndex + ")...");

	const executionStartTime = performance.now();
	const newWeb3Client = web3Clients[newWeb3ClientIndex];

	storageContract = new newWeb3Client.eth.Contract(abis.STORAGE, process.env.STORAGE_ADDRESS);

	// Retrieve all necessary details from the storage contract
	const [
		aggregatorAddress,
		callbacksAddress,
		tradingAddress,
		vaultAddress,
		linkAddress
	] = await Promise.all([
		storageContract.methods.priceAggregator().call(),
		storageContract.methods.callbacks().call(),
		storageContract.methods.trading().call(),
		storageContract.methods.vault().call(),
		storageContract.methods.linkErc677().call()
	]);

	callbacksContract = new newWeb3Client.eth.Contract(abis.CALLBACKS, callbacksAddress);
	tradingContract = new newWeb3Client.eth.Contract(abis.TRADING, tradingAddress);
	vaultContract = new newWeb3Client.eth.Contract(abis.VAULT, vaultAddress);
	pairInfosContract = new newWeb3Client.eth.Contract(abis.PAIR_INFOS, process.env.PAIR_INFOS_ADDRESS);

	const aggregatorContract = new newWeb3Client.eth.Contract(abis.AGGREGATOR, aggregatorAddress);

	const [
		pairsStorageAddress,
		nftRewardsAddress
	 ] = await Promise.all([
		aggregatorContract.methods.pairsStorage().call(),
		callbacksContract.methods.nftRewards().call()
	 ]);

	pairsStorageContract = new newWeb3Client.eth.Contract(abis.PAIRS_STORAGE, pairsStorageAddress);
	nftRewardsContract = new newWeb3Client.eth.Contract(abis.NFT_REWARDS, nftRewardsAddress);

	linkContract = new newWeb3Client.eth.Contract(abis.LINK, linkAddress);

	// Update the globally selected provider with this new provider
	currentlySelectedWeb3ClientIndex = newWeb3ClientIndex;
	currentlySelectedWeb3Client = newWeb3Client;

	// Subscribe to events using the new provider
	watchLiveTradingEvents();

	await Promise.all([
		nftManager.loadNfts(),
		nonceManager.initialize()
	]);

	// Fire and forget refreshing of data using new provider
	fetchTradingVariables();
	fetchOpenTrades();
	checkLinkAllowance();

	appLogger.info("New web3 client selection completed. Took: " + (performance.now() - executionStartTime) + "ms");
}

function createWeb3Provider(providerUrl) {
	const provider = new Web3.providers.WebsocketProvider(
		providerUrl,
		{
			clientConfig: {
				keepalive:true,
				keepaliveInterval:30*1000,
			},
			reconnect: {
				auto: true,
				delay: 1000,
				onTimeout: true
			}
		});

	provider.on('connect', () => {
		if(provider.connected){
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
};

function createWeb3Client(providerIndex, providerUrl) {
	const provider = createWeb3Provider(providerUrl);
	const web3Client = new Web3(provider);
	web3Client.eth.handleRevert = true;
	web3Client.eth.defaultAccount = process.env.PUBLIC_KEY;
	web3Client.eth.defaultChain = CHAIN;

	if(CHAIN_ID !== undefined) {
		web3Client.eth.defaultCommon = {
			customChain: {
				chainId: CHAIN_ID,
				networkId: NETWORK_ID,
			},
			baseChain: BASE_CHAIN,
			hardfork: HARDFORK,
		};
	}

	web3Client.eth.subscribe('newBlockHeaders').on('data', (header) => {
		const newBlockNumber = header.number;

		if(newBlockNumber === null) {
			appLogger.debug(`Received unfinished block from provider ${providerUrl}; ignoring...`);

			return;
		}

		currentWeb3ClientBlocks[providerIndex] = newBlockNumber;

		appLogger.debug(`New block received ${newBlockNumber} from provider ${providerUrl}...`);

		if(currentlySelectedWeb3ClientIndex === providerIndex) {
			return;
		}

		const blockDiff = currentlySelectedWeb3ClientIndex === -1 ? newBlockNumber : newBlockNumber - currentWeb3ClientBlocks[currentlySelectedWeb3ClientIndex];

		// Check if this block is more recent than the currently selected provider's block by the max drift
		// and, if so, switch now
		if(blockDiff > MAX_PROVIDER_BLOCK_DRIFT) {
			appLogger.info(`Switching to provider ${providerUrl} #${providerIndex} because it is ${blockDiff} block(s) ahead of current provider (${newBlockNumber} vs ${currentWeb3ClientBlocks[currentlySelectedWeb3ClientIndex]})`);

			setCurrentWeb3Client(providerIndex);
		}
	});

	return web3Client;
}

const nonceManager = new NonceManager(
	process.env.PUBLIC_KEY,
	() => currentlySelectedWeb3Client,
	createLogger('NONCE_MANAGER', process.env.LOG_LEVEL));

const nftManager = new NFTManager(
	process.env.STORAGE_ADDRESS,
	() => currentlySelectedWeb3Client,
	createLogger('NFT_MANAGER', process.env.LOG_LEVEL));

for(var web3ProviderUrlIndex = 0; web3ProviderUrlIndex < WEB3_PROVIDER_URLS.length; web3ProviderUrlIndex++){
	web3Clients.push(createWeb3Client(web3ProviderUrlIndex, WEB3_PROVIDER_URLS[web3ProviderUrlIndex]));
}

let MAX_PROVIDER_BLOCK_DRIFT = (process.env.MAX_PROVIDER_BLOCK_DRIFT ?? '').length > 0 ? parseInt(process.env.MAX_PROVIDER_BLOCK_DRIFT, 10) : 2;

if(MAX_PROVIDER_BLOCK_DRIFT < 1) {
	appLogger.warn(`MAX_PROVIDER_BLOCK_DRIFT is set to ${MAX_PROVIDER_BLOCK_DRIFT}; setting to minimum of 1.`);

	MAX_PROVIDER_BLOCK_DRIFT = 1;
}

setInterval(() => {
	if(currentlySelectedWeb3ClientIndex === -1) {
		appLogger.warn("No Web3 client has been selected yet!");
	} else {
		appLogger.info(`Current Web3 Client: ${currentlySelectedWeb3Client.currentProvider.url} (#${currentlySelectedWeb3ClientIndex})`);
	}

	executionStats = {
		...executionStats,
		uptime: DateTime.now().diff(DateTime.fromJSDate(executionStats.startTime), ["days", "hours", "minutes", "seconds"]).toFormat("d'd'h'h'm'm's's'"),
	}

	appLogger.info(`Execution Stats:`, executionStats);
}, WEB3_STATUS_REPORT_INTERVAL_MS);

// -----------------------------------------
// 5. FETCH DYNAMIC GAS PRICE
// -----------------------------------------

setInterval(async () => {
	try {
		const response = await fetch("https://gasstation-mainnet.matic.network/v2/");
		const gasPriceData = await response.json();

		standardTransactionGasFees = { maxFee: Math.round(gasPriceData.standard.maxFee), maxPriorityFee: Math.round(gasPriceData.standard.maxPriorityFee) };

		priorityTransactionMaxPriorityFeePerGas = Math.round(
			Math.max(
				Math.round(gasPriceData.fast.maxPriorityFee) * PRIORITY_GWEI_MULTIPLIER,
				MIN_PRIORITY_GWEI
			)
		);
	} catch(error) {
		appLogger.error("Error while fetching gas prices from gas station!", error)
	};
}, GAS_REFRESH_INTERVAL_MS);

// -----------------------------------------
// 6. FETCH PAIRS, NFTS, AND NFT TIMELOCK
// -----------------------------------------

const FETCH_TRADING_VARIABLES_REFRESH_INTERVAL_MS = (process.env.FETCH_TRADING_VARIABLES_REFRESH_INTERVAL_SEC ?? '').length > 0 ? parseFloat(process.env.FETCH_TRADING_VARIABLES_REFRESH_INTERVAL_SEC) * 1000 : 60 * 1000;

let fetchTradingVariablesTimerId = null;

async function fetchTradingVariables(){
	appLogger.info("Fetching trading variables...");

	if(fetchTradingVariablesTimerId !== null) {
		appLogger.debug(`Canceling existing fetchTradingVariables timer id.`);

		clearTimeout(fetchTradingVariablesTimerId);
		fetchTradingVariablesTimerId = null;
	}

	const executionStart = performance.now();

	try
	{
		const pairsCount = await pairsStorageContract.methods.pairsCount().call();

		await Promise.all([
			fetchPairs(pairsCount),
			fetchPairInfos(pairsCount),
		]);

		appLogger.info(`Done fetching trading variables; took ${performance.now() - executionStart}ms.`);

		if(FETCH_TRADING_VARIABLES_REFRESH_INTERVAL_MS > 0) {
			fetchTradingVariablesTimerId = setTimeout(() => { fetchTradingVariablesTimerId = null; fetchTradingVariables(); }, FETCH_TRADING_VARIABLES_REFRESH_INTERVAL_MS);
		}
	} catch(error) {
		appLogger.error("Error while fetching trading variables!", { error });

		fetchTradingVariablesTimerId = setTimeout(() => { fetchTradingVariablesTimerId = null; fetchTradingVariables(); }, 2*1000);
	};

	async function fetchPairs(pairsCount) {
		const maxPerPair = await storageContract.methods.maxTradesPerPair().call();
		let pairsPromises = new Array(pairsCount);

		for(var i = 0; i < pairsCount; i++){
			pairsPromises[i] = pairsStorageContract.methods.pairsBackend(i).call();
		}

		const pairs = await Promise.all(pairsPromises);
		const newSpreadsP = new Array(pairs.length);
		const newOpenInterests = new Array(pairs.length);
		const newCollaterals = new Array(pairs.length);

		await Promise.all(pairs.map(async (pair, pairIndex) => {
			const [
				openInterestLong,
				openInterestShort,
				openInterestMax,
				collateralLong,
				collateralShort,
				collateralMax
			] = await Promise.all([
				storageContract.methods.openInterestDai(pairIndex, 0).call(),
				storageContract.methods.openInterestDai(pairIndex, 1).call(),
				storageContract.methods.openInterestDai(pairIndex, 2).call(),
				pairsStorageContract.methods.groupsCollaterals(pairIndex, 0).call(),
				pairsStorageContract.methods.groupsCollaterals(pairIndex, 1).call(),
				pairsStorageContract.methods.groupMaxCollateral(pairIndex).call()
			]);

			newOpenInterests[pairIndex] = {long: openInterestLong, short: openInterestShort, max: openInterestMax};
			newCollaterals[pairIndex] = {long: collateralLong, short: collateralShort, max: collateralMax};
			newSpreadsP[pairIndex] = pair["0"].spreadP;
		}));

		maxTradesPerPair = maxPerPair;
		spreadsP = newSpreadsP;
		openInterests = newOpenInterests;
		collaterals = newCollaterals;
	}

	async function fetchPairInfos(pairsCount) {
		const [
			pairInfos,
			newMaxNegativePnlOnOpenP
		 ] = await Promise.all([
			pairInfosContract.methods.getPairInfos([...Array(parseInt(pairsCount)).keys()]).call(),
			pairInfosContract.methods.maxNegativePnlOnOpenP().call()
		 ]);

		pairParams = pairInfos["0"].map((value) => ({
			onePercentDepthAbove: parseFloat(value.onePercentDepthAbove),
			onePercentDepthBelow: parseFloat(value.onePercentDepthBelow),
			rolloverFeePerBlockP: parseFloat(value.rolloverFeePerBlockP) / 1e12,
			fundingFeePerBlockP: parseFloat(value.fundingFeePerBlockP) / 1e12
		}));

		pairRolloverFees = pairInfos["1"].map((value) => ({
			accPerCollateral: parseFloat(value.accPerCollateral) / 1e18,
			lastUpdateBlock: parseInt(value.lastUpdateBlock)
		}));

		pairFundingFees = pairInfos["2"].map((value) => ({
			accPerOiLong: parseFloat(value.accPerOiLong) / 1e18,
			accPerOiShort: parseFloat(value.accPerOiShort) / 1e18,
			lastUpdateBlock: parseInt(value.lastUpdateBlock)
		}));

		maxNegativePnlOnOpenP = parseFloat(newMaxNegativePnlOnOpenP) / 1e10;
	}
}

// -----------------------------------------
// 8. LOAD OPEN TRADES
// -----------------------------------------

function buildTradeIdentifier(trader, pairIndex, index, isPendingOpenLimitOrder) {
	if(isPendingOpenLimitOrder === undefined) {
		throw new Error("isPendingOpenLimitOrder was passed as undefined!");
	}

	return `trade://${trader}/${pairIndex}/${index}?isOpenLimit=${isPendingOpenLimitOrder}`;``
}

function buildTriggerIdentifier(trader, pairIndex, index, limitType) {
	return `trigger://${trader}/${pairIndex}/${index}[lt=${limitType}]`;
}

let fetchOpenTradesRetryTimerId = null;

async function fetchOpenTrades(){
	appLogger.info("Fetching open trades...");

	try {
		if(spreadsP.length === 0){
			appLogger.warn("Spreads are not yet loaded; will retry shortly!");

			scheduleRetryFetchOpenTrades();

			return;
		}

		const start = performance.now();

		const [
			openLimitOrders,
			pairTraders
		] = await Promise.all(
			[
				fetchOpenLimitOrders(),
				fetchOpenPairTrades()
			]);

		const newOpenTrades = new Map(openLimitOrders
			.concat(pairTraders)
			.map(trade => [buildTradeIdentifier(trade.trader, trade.pairIndex, trade.index, trade.openPrice === undefined), trade]));

		knownOpenTrades = newOpenTrades;

		appLogger.info(`Fetched ${knownOpenTrades.size} total open trade(s) in ${performance.now() - start}ms.`);

		// Check if we're supposed to auto-refresh open trades and if so, schedule the next refresh
		if(OPEN_TRADES_REFRESH_MS !== 0) {
			appLogger.debug(`Scheduling auto-refresh of open trades in for ${OPEN_TRADES_REFRESH_MS}ms from now.`);

			setTimeout(() => fetchOpenTrades(), OPEN_TRADES_REFRESH_MS);
		} else {
			appLogger.info(`Auto-refresh of open trades is disabled (OPEN_TRADES_REFRESH=0); will only synchronize based on blockchain events from here out!`);
		}
	} catch(error) {
		appLogger.error("Error fetching open trades!", error);

		scheduleRetryFetchOpenTrades();
	}

	function scheduleRetryFetchOpenTrades() {
		if(fetchOpenTradesRetryTimerId !== null) {
			appLogger.debug("Already scheduled retry fetching open trades; will retry shortly!");

			return;
		}

		fetchOpenTradesRetryTimerId = setTimeout(() => { fetchOpenTradesRetryTimerId = null; fetchOpenTrades(); }, 2*1000);
	}

	async function fetchOpenLimitOrders() {
		appLogger.info("Fetching open limit orders...");

		const openLimitOrders = await storageContract.methods.getOpenLimitOrders().call();

		const openLimitOrdersWithTypes = await Promise.all(openLimitOrders.map(async olo => {
			const type = await nftRewardsContract.methods.openLimitOrderTypes(olo.trader, olo.pairIndex, olo.index).call();

			return { ...olo, type };
		}));

		appLogger.info(`Fetched ${openLimitOrdersWithTypes.length} open limit order(s).`);

		return openLimitOrdersWithTypes;
	}

	async function fetchOpenPairTrades() {
		appLogger.info("Fetching open pair trades...");

		const allOpenPairTrades = (await Promise.all(spreadsP.map(async (_, spreadPIndex) => {
			appLogger.debug(`Fetching pair traders for pairIndex ${spreadPIndex}...`);

			const pairTradersCallStartTime = performance.now();

			const pairTraderAddresses = await storageContract.methods.pairTradersArray(spreadPIndex).call();

			if(pairTraderAddresses.length === 0) {
				appLogger.debug(`No pair traders found for pairIndex ${spreadPIndex}; no processing left to do!`);

				return [];
			}

			appLogger.debug(`Fetched ${pairTraderAddresses.length} pair traders for pairIndex ${spreadPIndex} in ${performance.now() - pairTradersCallStartTime}ms; now fetching all open trades...`);

			const openTradesForPairTraders = await Promise.all(pairTraderAddresses.map(async pairTraderAddress => {
				const openTradesCalls = new Array(maxTradesPerPair);

				const traderOpenTradesCallsStartTime = performance.now();

				for(let pairTradeIndex = 0; pairTradeIndex < maxTradesPerPair; pairTradeIndex++){
					openTradesCalls[pairTradeIndex] = storageContract.methods.openTrades(pairTraderAddress, spreadPIndex, pairTradeIndex).call();
				}

				appLogger.debug(`Waiting on ${openTradesCalls.length} StorageContract::openTrades calls for trader ${pairTraderAddress}...`);

				const openTradesForTraderAddress = await Promise.all(openTradesCalls);

				appLogger.debug(`Received ${openTradesForTraderAddress.length} open trades for trader ${pairTraderAddress} in ${performance.now() - traderOpenTradesCallsStartTime}ms.`);

				// Filter out any of the trades that aren't *really* open (NOTE: these will have an empty trader address, so just test against that)
				const actualOpenTrades = openTradesForTraderAddress.filter(openTrade => openTrade.trader === pairTraderAddress);

				appLogger.debug(`Filtered down to ${actualOpenTrades.length} actual open trades for trader ${pairTraderAddress}; fetching corresponding trade info...`);

				const [actualOpenTradesTradeInfos, actualOpenTradesInitialAccFees] = await Promise.all([
					Promise.all(actualOpenTrades.map(aot => storageContract.methods.openTradesInfo(aot.trader, aot.pairIndex, aot.index).call())),
					Promise.all(actualOpenTrades.map(aot => pairInfosContract.methods.tradeInitialAccFees(aot.trader, aot.pairIndex, aot.index).call()))
				]);

				for(let tradeIndex = 0; tradeIndex < actualOpenTrades.length; tradeIndex++) {
					const tradeInfo = actualOpenTradesTradeInfos[tradeIndex];

					if(tradeInfo === undefined) {
						appLogger.error("No trade info found for open trade while fetching open trades!", { trade: actualOpenTrades[tradeIndex] });

						continue;
					}

					const tradeInitialAccFees = actualOpenTradesInitialAccFees[tradeIndex];

					if(tradeInitialAccFees === undefined) {
						appLogger.error("No initial acc fees found for open trade while fetching open trades!", { trade: actualOpenTrades[tradeIndex] });

						continue;
					}

					// Tack on the additional data to the original trade object
					const trade = actualOpenTrades[tradeIndex];
					trade.tradeInfo = tradeInfo;
					trade.tradeInitialAccFees = {
						rollover: parseInt(tradeInitialAccFees.rollover, 10) / 1e18,
						funding: parseInt(tradeInitialAccFees.funding, 10) / 1e18,
						openedAfterUpdate: tradeInitialAccFees.openedAfterUpdate === true,
					};
				}

				appLogger.debug(`Trade info fetched for ${actualOpenTrades.length} trades; fetching initial fees...`);

				return actualOpenTrades;
			}));

			return openTradesForPairTraders;
		}))).flat(2);

		appLogger.info(`Fetched ${allOpenPairTrades.length} open pair trade(s).`);

		return allOpenPairTrades;
	}
}
// -----------------------------------------
// 9. WATCH TRADING EVENTS
// -----------------------------------------

function watchLiveTradingEvents(){
	try {
		if(eventSubTrading !== null && eventSubTrading.id !== null) {
			eventSubTrading.unsubscribe();
		}

		eventSubTrading = tradingContract.events.allEvents({ fromBlock: 'latest' })
			.on('data', (event) => {
				const eventName = event.event;

				if(eventName !== "OpenLimitPlaced" && eventName !== "OpenLimitUpdated"
				&& eventName !== "OpenLimitCanceled" && eventName !== "TpUpdated"
				&& eventName !== "SlUpdated"){
					return;
				}

				// If no confirmation delay, then execute immediately without timer
				if(EVENT_CONFIRMATIONS_MS === 0) {
					synchronizeOpenTrades(event);
				} else {
					setTimeout(() => synchronizeOpenTrades(event), EVENT_CONFIRMATIONS_MS);
				}
		});

		if(eventSubCallbacks !== null && eventSubCallbacks.id !== null) {
			eventSubCallbacks.unsubscribe();
		}

		eventSubCallbacks = callbacksContract.events.allEvents({ fromBlock: 'latest' })
			.on('data', (event) => {
				const eventName = event.event;

				if(eventName !== "MarketExecuted" && eventName !== "LimitExecuted"
				&& eventName !== "MarketCloseCanceled" && eventName !== "SlUpdated"
				&& eventName !== "SlCanceled"){
					return;
				}

				// If no confirmation delay, then execute immediately without timer
				if(EVENT_CONFIRMATIONS_MS === 0) {
					synchronizeOpenTrades(event);
				} else {
					setTimeout(() => synchronizeOpenTrades(event), EVENT_CONFIRMATIONS_MS);
				}
			});

		if(eventSubPairInfos === null){
			eventSubPairInfos = pairInfosContract.events.allEvents({ fromBlock: 'latest' })
				.on('data', (event) => {
					const eventName = event.event;

					if(eventName !== "AccFundingFeesStored"){
						return;
					}

					// If no confirmation delay, then execute immediately without timer
					if(EVENT_CONFIRMATIONS_MS === 0) {
						refreshPairFundingFees(event);
					} else {
						setTimeout(() => refreshPairFundingFees(event));
					}
				});
		}
	} catch {
		setTimeout(() => { watchLiveTradingEvents(); }, 2*1000);
	}
}

async function synchronizeOpenTrades(event){
	try {
		const currentKnownOpenTrades = knownOpenTrades;

		const eventName = event.event;
		const eventReturnValues = event.returnValues;

		appLogger.verbose(`Synchronizing open trades based on event ${eventName} from block ${event.blockNumber}...`);

		if(currentKnownOpenTrades === null) {
			appLogger.warn(`Known open trades not yet initialized, cannot synchronize ${eventName} from block ${event.blockNumber} at this time!`);

			return;
		}

		if(eventName === "OpenLimitCanceled") {
			const { trader, pairIndex, index } = eventReturnValues;

			const tradeKey = buildTradeIdentifier(trader, pairIndex, index, true);
			const existingKnownOpenTrade = currentKnownOpenTrades.get(tradeKey);

			if(existingKnownOpenTrade !== undefined) {
				currentKnownOpenTrades.delete(tradeKey);

				appLogger.verbose(`Synchronize open trades from event ${eventName}: Removed limit for ${tradeKey}`);
			} else {
				appLogger.verbose(`Synchronize open trades from event ${eventName}: Limit not found for ${tradeKey}`);
			}
		} else if(eventName === "OpenLimitPlaced"
						||
					eventName === "OpenLimitUpdated"){
			const { trader, pairIndex, index } = eventReturnValues;

			const [
					hasOpenLimitOrder,
					openLimitOrderId
			] = await Promise.all([
				storageContract.methods.hasOpenLimitOrder(trader, pairIndex, index).call(),
				storageContract.methods.openLimitOrderIds(trader, pairIndex, index).call()
			]);

			if(hasOpenLimitOrder === false) {
				appLogger.warn(`Open limit order not found for ${trader}/${pairIndex}/${index}; ignoring!`);
			} else {
				const [
					limitOrder,
					type
				] = await Promise.all(
					[
						storageContract.methods.openLimitOrders(openLimitOrderId).call(),
						nftRewardsContract.methods.openLimitOrderTypes(trader, pairIndex, index).call()
					]);

				limitOrder.type = type;

				const tradeKey = buildTradeIdentifier(trader, pairIndex, index, true);

				if(currentKnownOpenTrades.has(tradeKey)) {
					appLogger.verbose(`Synchronize open trades from event ${eventName}: Updating open limit order for ${tradeKey}`);
				} else {
					appLogger.verbose(`Synchronize open trades from event ${eventName}: Storing new open limit order for ${tradeKey}`);
				}

				currentKnownOpenTrades.set(tradeKey, limitOrder);
			}
		} else if(eventName === "TpUpdated" || eventName === "SlUpdated" || eventName === "SlCanceled") {
			const { trader, pairIndex, index } =  eventReturnValues;

			// Fetch all fresh trade information to update known open trades
			const [trade, tradeInfo, tradeInitialAccFees] = await Promise.all([
				storageContract.methods.openTrades(trader, pairIndex, index).call(),
				storageContract.methods.openTradesInfo(trader, pairIndex, index).call(),
				pairInfosContract.methods.tradeInitialAccFees(trader, pairIndex, index).call()
			]);

			trade.tradeInfo = tradeInfo;
			trade.tradeInitialAccFees = {
				rollover: parseInt(tradeInitialAccFees.rollover, 10) / 1e18,
				funding: parseInt(tradeInitialAccFees.funding, 10) / 1e18,
				openedAfterUpdate: tradeInitialAccFees.openedAfterUpdate === true,
			};

			const tradeKey = buildTradeIdentifier(trader, pairIndex, index, false);
			currentKnownOpenTrades.set(tradeKey, trade);

			appLogger.verbose(`Synchronize open trades from event ${eventName}: Updated trade ${tradeKey}`);
		} else if(eventName === "MarketCloseCanceled") {
			const { trader, pairIndex, index } = eventReturnValues.t;
			const tradeKey = buildTradeIdentifier(trader, pairIndex, index, false);

			const trade = await storageContract.methods.openTrades(trader, pairIndex, index).call();

			// Make sure the trade is still actually active
			if(parseInt(trade.leverage, 10) > 0) {
				// Fetch all fresh trade information to update known open trades
				const [tradeInfo, tradeInitialAccFees] = await Promise.all([
					storageContract.methods.openTradesInfo(trader, pairIndex, index).call(),
					pairInfosContract.methods.tradeInitialAccFees(trader, pairIndex, index).call()
				]);

				trade.tradeInfo = tradeInfo;
				trade.tradeInitialAccFees = {
					rollover: parseInt(tradeInitialAccFees.rollover, 10) / 1e18,
					funding: parseInt(tradeInitialAccFees.funding, 10) / 1e18,
					openedAfterUpdate: tradeInitialAccFees.openedAfterUpdate === true,
				};

				currentKnownOpenTrades.set(tradeKey, trade);
			} else {
				currentKnownOpenTrades.delete(tradeKey);
			}

			return;
		} else if((eventName === "MarketExecuted" && eventReturnValues.open === true)
						||
					(eventName === "LimitExecuted" && eventReturnValues.orderType === "3")) {
			const { t: trade, limitIndex } = eventReturnValues;
			const { trader, pairIndex, index } = trade;

			if(eventName === "LimitExecuted") {
				const openTradeKey = buildTradeIdentifier(trader, pairIndex, limitIndex, true);

				if(currentKnownOpenTrades.has(openTradeKey)) {
					appLogger.verbose(`Synchronize open trades from event ${eventName}: Removed open limit trade ${openTradeKey}.`);

					currentKnownOpenTrades.delete(openTradeKey);
				} else {
					appLogger.warn(`Synchronize open trades from event ${eventName}: Open limit trade ${openTradeKey} was not found? Unable to remove.`);
				}
			}

			const [tradeInfo, tradeInitialAccFees] = await Promise.all([
				storageContract.methods.openTradesInfo(trader, pairIndex, index).call(),
				pairInfosContract.methods.tradeInitialAccFees(trader, pairIndex, index).call()
			]);

			const tradeKey = buildTradeIdentifier(trader, pairIndex, index, false);

			currentKnownOpenTrades.set(
				tradeKey,
				{
					...trade,
					tradeInfo,
					tradeInitialAccFees: {
						rollover: parseInt(tradeInitialAccFees.rollover, 10) / 1e18,
						funding: parseInt(tradeInitialAccFees.funding, 10) / 1e18,
						openedAfterUpdate: tradeInitialAccFees.openedAfterUpdate === true,
					}
				});

			appLogger.info(`Synchronize open trades from event ${eventName}: Stored active trade ${tradeKey}`);
		} else if((eventName === "MarketExecuted" && eventReturnValues.open === false)
						||
					(eventName === "LimitExecuted" && eventReturnValues.orderType !== "3")){
			const { trader, pairIndex, index } = eventReturnValues.t;
			const tradeKey = buildTradeIdentifier(trader, pairIndex, index, false);

			const triggeredOrderTrackingInfoIdentifier = buildTriggerIdentifier(
				trader,
				pairIndex,
				index,
				eventReturnValues.orderType ?? 'N/A');

			appLogger.info(`Synchronize open trades from event ${eventName}: event received for ${triggeredOrderTrackingInfoIdentifier}...`);

			const existingKnownOpenTrade = currentKnownOpenTrades.get(tradeKey);

			// If this was a known open trade then we need to remove it now
			if(existingKnownOpenTrade !== undefined) {
				currentKnownOpenTrades.delete(tradeKey);

				appLogger.debug(`Synchronize open trades from event ${eventName}: Removed ${tradeKey} from known open trades.`);
			} else {
				appLogger.debug(`Synchronize open trades from event ${eventName}: Trade ${tradeKey} was not found in known open trades; just ignoring.`);
			}

			const triggeredOrderDetails = triggeredOrders.get(triggeredOrderTrackingInfoIdentifier);

			// If we were tracking this triggered order, stop tracking it now and clear the timeout so it doesn't
			// interrupt the event loop for no reason later
			if(triggeredOrderDetails !== undefined) {
				appLogger.debug(`Synchronize open trades from event ${eventName}: We triggered order ${triggeredOrderTrackingInfoIdentifier}; clearing tracking timer.`);

				// If we actually managed to send the transaction off without error then we can report success and clean
				// up tracking state now
				if(triggeredOrderDetails.transactionSent === true) {
					if(eventReturnValues.nftHolder === process.env.PUBLIC_KEY) {
						appLogger.info(`💰💰💰 SUCCESSFULLY TRIGGERED ORDER ${triggeredOrderTrackingInfoIdentifier} FIRST!!!`);

						executionStats = {
							...executionStats,
							firstTriggers: (executionStats?.firstTriggers ?? 0) + 1,
						}
					} else {
						appLogger.info(`💰 SUCCESSFULLY TRIGGERED ORDER ${triggeredOrderTrackingInfoIdentifier} AS SAME BLOCK!!!`);

						executionStats = {
							...executionStats,
							sameBlockTriggers: (executionStats?.sameBlockTriggers ?? 0) + 1,
						}
					}

					clearTimeout(triggeredOrderDetails.cleanupTimerId);
					triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier);
				}
			} else {
				appLogger.debug(`Synchronize open trades from event ${eventName}: Order ${triggeredOrderTrackingInfoIdentifier} was not being tracked as triggered by us.`);
			}
		}

		executionStats = {
			...executionStats,
			totalEventsProcessed: (executionStats?.totalEventsProcessed ?? 0) + 1,
			lastEventBlockNumber: event.blockNumber,
			lastEventProcessed: new Date(),
		};
	} catch(error) {
		appLogger.error("Error occurred when refreshing trades.", error);
	}
}

async function refreshPairFundingFees(event){
	const pairIndex = parseInt(event.returnValues.pairIndex, 10);
	const pairFundingFees = await pairInfosContract.methods.pairFundingFees(pairIndex).call();

	pairFundingFees[pairIndex] = {
		accPerOiLong: pairFundingFees.accPerOiLong / 1e18,
		accPerOiShort: pairFundingFees.accPerOiShort / 1e18,
		lastUpdateBlock: parseInt(pairFundingFees.lastUpdateBlock)
	};
}


// ---------------------------------------------
// 11. FETCH CURRENT PRICES & TRIGGER ORDERS
// ---------------------------------------------

const MAXIMUM_CHART_CANDLE_AGE_MS = 61000;

function watchPricingStream() {
	appLogger.info("Connecting to pricing stream...");

	let socket = new WebSocket(process.env.PRICES_URL);
	let currentlyProcessingChartsMessage = false;

	socket.onopen = () => {
		appLogger.info("Pricing stream connected.");
	};
	socket.onclose = () => {
		appLogger.error("Pricing stream websocket closed! Will attempt to reconnect in two seconds...");

		setTimeout(() => { watchPricingStream() }, 2000);
	};
	socket.onerror = (error) => {
		appLogger.error("Pricing stream websocket error occurred!", { error });
		socket.close();
	};
	socket.onmessage = (msg) => {
		const currentKnownOpenTrades = knownOpenTrades;

		if(currentKnownOpenTrades === null) {
			appLogger.debug("Known open trades not yet loaded; unable to begin any processing yet!");

			return;
		}

		if(spreadsP.length === 0) {
			appLogger.debug("Spreads are not yet loaded; unable to process any trades!");

			return;
		}

		if(allowedLink === false) {
			appLogger.warn("LINK is not currently allowed for the configured account; unable to process any trades!");

			return;
		}

		// If we're still in the middle of processing the last charts message then debounce
		if(currentlyProcessingChartsMessage === true) {
			appLogger.debug("Still processing last charts msg; debouncing!");

			return;
		}

		const messageData = JSON.parse(msg.data.toString());

		// Ignore non-"charts" messages from the backend
		if(messageData.name !== "charts") {
			appLogger.debug(`Received a message "${messageData.name}" from the pricing stream, but we only care about "charts"; ignoring.`);

			return;
		}

		const chartCandleAge = Date.now() - messageData.time;

		if(chartCandleAge > MAXIMUM_CHART_CANDLE_AGE_MS) {
			appLogger.warn(`Chart candle data is too old to act on (from ${new Date(messageData.time).toISOString()}); skipping!`);

			return;
		}

		currentlyProcessingChartsMessage = true;

		handleOnMessageAsync().catch(error => {
			appLogger.error("Unhandled error occurred when handling pricing stream message!", { error });
		}).finally(() => {
			currentlyProcessingChartsMessage = false;
		});

		async function handleOnMessageAsync() {
			//appLogger.debug(`Beginning processing new "charts" message for ${messageData.time}...`);


			// appLogger.debug(`Received "charts" message, checking if any of the ${currentKnownOpenTrades.size} known open trades should be acted upon...`, { candleTime: messageData.time, chartCandleAge, knownOpenTradesCount: currentKnownOpenTrades.size });

			await Promise.allSettled([...currentKnownOpenTrades.values()].map(async openTrade => {
				const { trader, pairIndex, index, buy } = openTrade;
				const isPendingOpenLimitOrder = openTrade.openPrice === undefined;
				const openTradeKey = buildTradeIdentifier(trader, pairIndex, index, isPendingOpenLimitOrder);

				const price = messageData.closes[pairIndex];

				// Under certain conditions (forex/stock market just opened, server restart, etc) the price is not
				// available, so we need to make sure we skip any processing in that case
				if((price ?? 0) <= 0) {
					// appLogger.debug(`Received ${price} for close price for pair ${pairIndex}; skipping processing of ${openTradeKey}!`);

					return;
				}

				let orderType = -1;

				if(isPendingOpenLimitOrder === false) {
					const tp = parseFloat(openTrade.tp)/1e10;
					const sl = parseFloat(openTrade.sl)/1e10;
					const liqPrice = getTradeLiquidationPrice(openTradeKey, openTrade);

					if(tp !== 0 && ((buy && price >= tp) || (!buy && price <= tp))) {
						orderType = 0;
					} else if(sl !== 0 && ((buy && price <= sl) || (!buy && price >= sl))) {
						orderType = 1;
					} else if(sl === 0 && ((buy && price <= liqPrice) || (!buy && price >= liqPrice))) {
						orderType = 2;
					} else {
						//appLogger.debug(`Open trade ${openTradeKey} is not ready for us to act on yet.`);
					}
				} else {
					const posDai = parseFloat(openTrade.leverage) * parseFloat(openTrade.positionSize);

					const baseSpreadP = spreadsP[openTrade.pairIndex]/1e10*(100-openTrade.spreadReductionP)/100;

					const onePercentDepth = buy ? pairParams[openTrade.pairIndex].onePercentDepthAbove : pairParams[openTrade.pairIndex].onePercentDepthBelow;
					const interestDai = buy ? parseFloat(openInterests[openTrade.pairIndex].long) : parseFloat(openInterests[openTrade.pairIndex].short);

   					const priceImpactP = (interestDai / 1e18 + (posDai / 1e18) / 2) / onePercentDepth;
   					const spreadP = onePercentDepth > 0 ? baseSpreadP + priceImpactP : baseSpreadP;
					const priceIncludingSpread = !buy ? price * (1 - spreadP / 100) : price * (1 + spreadP/100);

					const collateralDai = buy ? parseFloat(collaterals[openTrade.pairIndex].long) : parseFloat(collaterals[openTrade.pairIndex].short);

					const newInterestDai = (interestDai + posDai);
					const newCollateralDai = (collateralDai + parseFloat(openTrade.positionSize));

					const maxInterestDai = parseFloat(openInterests[openTrade.pairIndex].max);
					const maxCollateralDai = parseFloat(collaterals[openTrade.pairIndex].max);

					const minPrice = parseFloat(openTrade.minPrice)/1e10;
					const maxPrice = parseFloat(openTrade.maxPrice)/1e10;

					if(newInterestDai <= maxInterestDai
							&&
						newCollateralDai <= maxCollateralDai
							&&
						(onePercentDepth === 0
								||
							priceImpactP * openTrade.leverage <= maxNegativePnlOnOpenP)) {
						const tradeType = openTrade.type;

						if(tradeType === "0" && priceIncludingSpread >= minPrice && priceIncludingSpread <= maxPrice
							|| tradeType === "1" && (buy ? priceIncludingSpread <= maxPrice : priceIncludingSpread >= minPrice)
							|| tradeType === "2" && (buy ? priceIncludingSpread >= minPrice : priceIncludingSpread <= maxPrice)) {
							orderType = 3;
						} else {
							//appLogger.debug(`Limit trade ${openTradeKey} is not ready for us to act on yet.`);
						}
					}
				}

				// If it's not an order type we want to act on yet, just skip it
				if(orderType === -1) {
					return;
				}

				const triggeredOrderTrackingInfoIdentifier = buildTriggerIdentifier(
					trader,
					pairIndex,
					index,
					orderType);

				// Make sure this order hasn't already been triggered
				if(triggeredOrders.has(triggeredOrderTrackingInfoIdentifier)) {
					appLogger.debug(`Order ${triggeredOrderTrackingInfoIdentifier} has already been triggered by us and is pending!`);

					return;
				}

				// Attempt to lease an available NFT to process this order
				const availableNft = await nftManager.leaseAvailableNft(currentlySelectedWeb3Client);

				// If there are no more NFTs available, we can stop trying to trigger any other trades
				if(availableNft === null) {
					appLogger.warn("No NFTS available; unable to trigger any other trades at this time!");

					return;
				}

				try {
					// Make sure the trade is still known to us at this point because it's possible that the trade was
					// removed from known open trades asynchronously which is why we check again here even though we're
					// looping through the set of what we thought were the known open trades here
					if(!currentKnownOpenTrades.has(openTradeKey)) {
						appLogger.warn(`Trade ${openTradeKey} no longer exists in our known open trades list; skipping order!`);

						return;
					}

					const triggeredOrderDetails = {
						cleanupTimerId: null,
						transactionSent: false,
						error: null
					};

					// Track that we're triggering this order
					triggeredOrders.set(triggeredOrderTrackingInfoIdentifier, triggeredOrderDetails);

					appLogger.info(`🤞 Trying to trigger ${triggeredOrderTrackingInfoIdentifier} order with NFT ${availableNft.id}...`);

					try {
						const orderTransaction = createTransaction({
							to: tradingContract.options.address,
							data : tradingContract.methods.executeNftOrder(orderType, trader, pairIndex, index, availableNft.id, availableNft.type).encodeABI(),
							maxPriorityFeePerGas: Web3.utils.toHex(priorityTransactionMaxPriorityFeePerGas*1e9),
							maxFeePerGas: MAX_FEE_PER_GAS_WEI_HEX,
						});

						// NOTE: technically this should execute synchronously because we're supplying all necessary details on
						// the transaction object up front
						const signedTransaction = await currentlySelectedWeb3Client.eth.accounts.signTransaction(orderTransaction, process.env.PRIVATE_KEY);

						if(DRY_RUN_MODE === false) {
							await currentlySelectedWeb3Client.eth.sendSignedTransaction(signedTransaction.rawTransaction);
						} else {
							appLogger.info(`DRY RUN MODE ACTIVE: skipping actually sending transaction for order: ${triggeredOrderTrackingInfoIdentifier}`, orderTransaction);
						}

						triggeredOrderDetails.transactionSent = true;

						// If we successfully send the transaction, we set up a timer to make sure we've heard about its
						// eventual completion and, if not, we clean up tracking and log that we didn't hear back
						triggeredOrderDetails.cleanupTimerId = setTimeout(() => {
							if(triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier)) {
								appLogger.warn(`❕ Never heard back from the blockchain about triggered order ${triggeredOrderTrackingInfoIdentifier}; removed from tracking.`);

								executionStats = {
									...executionStats,
									missedTriggers: (executionStats.missedTriggers ?? 0) + 1
								}
							}
						}, FAILED_ORDER_TRIGGER_TIMEOUT_MS);

						appLogger.info(`⚡️ Triggered order for ${triggeredOrderTrackingInfoIdentifier} with NFT ${availableNft.id}.`);
					} catch(error) {
						const executionStatsTriggerErrors = executionStats.triggerErrors ?? {};
						const errorReason = error.reason ?? "UNKNOWN_TRANSACTION_ERROR";

						executionStatsTriggerErrors[errorReason] = (executionStatsTriggerErrors[errorReason] ?? 0) + 1;

						executionStats = {
							...executionStats,
							triggerErrors: executionStatsTriggerErrors,
						}

						switch(errorReason) {
							case "SAME_BLOCK_LIMIT":
							case "TOO_LATE":
								// The trade has been triggered by others, delay removing it and maybe we'll have a
								// chance to try again if original trigger fails
								appLogger.warn(`⭕️ Order ${triggeredOrderTrackingInfoIdentifier} was already triggered and we got a "${errorReason}"; will remove from triggered tracking shortly and it may be tried again if original trigger didn't hit!`);

								// Wait a bit and then clean from triggered orders list so it might get tried again
								triggeredOrderDetails.cleanupTimerId = setTimeout(() => {
									if(!triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier)) {
										appLogger.debug(`Tried to clean up triggered order ${triggeredOrderTrackingInfoIdentifier} which previously failed due to "${errorReason}", but it was already removed.`);
									}

								}, FAILED_ORDER_TRIGGER_TIMEOUT_MS / 2);

								break;

							case "NO_TRADE":
								appLogger.warn(`❌ Order ${triggeredOrderTrackingInfoIdentifier} missed due to "${errorReason}" error; removing order from known trades and triggered tracking.`);

								// The trade is gone, just remove it from known trades
								triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier);
								currentKnownOpenTrades.delete(openTradeKey);

								break;

							case "NO_SL":
							case "NO_TP":
							case "SUCCESS_TIMELOCK":
								appLogger.warn(`❗️ Order ${triggeredOrderTrackingInfoIdentifier} missed due to "${errorReason}" error; will remove order from triggered tracking.`);

								// Wait a bit and then clean from triggered orders list so it might get tried again
								triggeredOrderDetails.cleanupTimerId = setTimeout(() => {
									if(!triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier)) {
										appLogger.warn(`Tried to clean up triggered order ${triggeredOrderTrackingInfoIdentifier} which previously failed due to "${errorReason}", but it was already removed.`);
									}

								}, FAILED_ORDER_TRIGGER_TIMEOUT_MS);

								break;

							default:
								const errorMessage = error.message?.toLowerCase();

								if(errorMessage !== undefined && (errorMessage.includes("nonce too low") || errorMessage.includes("replacement transaction underpriced"))) {
									appLogger.error(`⁉️ Some how we ended up with a nonce that was too low; forcing a refresh now and the trade may be tried again if still available.`);

									await nonceManager.refreshNonceFromOnChainTransactionCount();
									triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier);

									appLogger.info("Nonce refreshed and tracking of triggered order cleared so it can possibly be retried.");
								} else {
									appLogger.error(`🔥 Order ${triggeredOrderTrackingInfoIdentifier} transaction failed for unexpected reason "${errorReason}"; removing order from tracking.`, { error });

									// Wait a bit and then clean from triggered orders list so it might get tried again
									triggeredOrderDetails.cleanupTimerId = setTimeout(() => {
										if(!triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier)) {
											appLogger.debug(`Tried to clean up triggered order ${triggeredOrderTrackingInfoIdentifier} which previously failed, but it was already removed?`);
										}

									}, FAILED_ORDER_TRIGGER_TIMEOUT_MS);
								}
						}
					}
				} finally {
					// Always release the NFT back to the NFT manager
					nftManager.releaseNft(availableNft);
				}
			}));
		}
	}

	function getTradeLiquidationPrice(tradeKey, trade) {
		const { tradeInfo, tradeInitialAccFees } = trade;
		const posDai = trade.initialPosToken / 1e18 * tradeInfo.tokenPriceDai / 1e10;

		const openPrice = parseFloat(trade.openPrice) / 1e10;
		const buy = trade.buy === true;

		const tradeOpenedAfterFundingFeesUpdate = trade.tradeInitialAccFees.openedAfterUpdate;

		let rolloverFee;
		let fundingFee;

		if(tradeOpenedAfterFundingFeesUpdate === true) {
			rolloverFee = getRolloverFee(
				posDai,
				trade.pairIndex,
				tradeInitialAccFees.rollover,
				tradeInitialAccFees.openedAfterUpdate);

			fundingFee = getFundingFee(
				posDai * trade.leverage,
				trade.pairIndex,
				tradeInitialAccFees.funding,
				buy,
				tradeInitialAccFees.openedAfterUpdate)

			// appLogger.debug(`Trade ${tradeKey} was opened AFTER funding fees update; funding and roller fees will be used in calculations.`);
		} else {
			// appLogger.debug(`Trade ${tradeKey} was opened BEFORE funding fees update; no funding or rollover fees will be used in calculations.`);

			rolloverFee = 0;
			fundingFee = 0;
		}

		const liqPriceDistance =
			(openPrice *
				(posDai * 0.9 -
					rolloverFee -
					fundingFee)) /
			posDai /
			trade.leverage;

		return buy === true ? openPrice - liqPriceDistance : openPrice + liqPriceDistance;

		// Calculate liquidation price
		function getRolloverFee (
			posDai,
			pairIndex,
			initialAccRolloverFees,
			openedAfterUpdate
		) {
			// If this is a legacy trade (e.g. before v6.1) there are no rollover fees applied
			if(openedAfterUpdate === false) {
				return 0;
			}

			const { accPerCollateral, lastUpdateBlock } = pairRolloverFees[pairIndex];
			const { rolloverFeePerBlockP } = pairParams[pairIndex];

			const pendingAccRolloverFees = accPerCollateral + (currentWeb3ClientBlocks[currentlySelectedWeb3ClientIndex] - lastUpdateBlock) * rolloverFeePerBlockP;

			return posDai * (pendingAccRolloverFees - initialAccRolloverFees);
		}

		function getFundingFee(
			leveragedPosDai,
			pairIndex,
			initialAccFundingFees,
			buy,
			openedAfterUpdate
		) {
			// If this is a legacy trade (e.g. before v6.1) there are no funding fees applied
			if(openedAfterUpdate === false) {
				return 0;
			}

			const { accPerOiLong, accPerOiShort, lastUpdateBlock } = pairFundingFees[pairIndex];
			const { fundingFeePerBlockP } = pairParams[pairIndex];

			const { long: longOi, short: shortOi } = openInterests[pairIndex];
			const fundingFeesPaidByLongs = (longOi - shortOi) * fundingFeePerBlockP * (currentWeb3ClientBlocks[currentlySelectedWeb3ClientIndex] - lastUpdateBlock);

			let pendingAccFundingFees = 0;

			if(buy === true) {
				pendingAccFundingFees = accPerOiLong;

				if(longOi > 0) {
					pendingAccFundingFees += fundingFeesPaidByLongs / longOi;
				}
			} else {
				pendingAccFundingFees = accPerOiShort;

				if(shortOi > 0) {
					pendingAccFundingFees += (fundingFeesPaidByLongs * -1) / shortOi;
				}
			}

			const fundingFee = leveragedPosDai * (pendingAccFundingFees - initialAccFundingFees);

			return fundingFee;
		}
	}
}

watchPricingStream();

// ------------------------------------------
// 12. REFILL VAULT IF CAN BE REFILLED
// ------------------------------------------

if(process.env.VAULT_REFILL_ENABLED === "true") {
	async function refill(){
		const tx = createTransaction({
			to : vaultContract.options.address,
			data : vaultContract.methods.refill().encodeABI(),
			maxPriorityFeePerGas: Web3.utils.toHex(standardTransactionGasFees.maxPriorityFee*1e9),
			maxFeePerGas: Web3.utils.toHex(standardTransactionGasFees.maxFee*1e9),
			nonce: nonceManager.getNextNonce(),
		});

		try{
			const signed = await currentlySelectedWeb3Client.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY)

			await currentlySelectedWeb3Client.eth.sendSignedTransaction(signed.rawTransaction);

			appLogger.info("Vault successfully refilled.");
		} catch(error) {
			appLogger.error("Vault refill transaction failed!", error);
		};
	}

	async function deplete(){
		const tx = createTransaction({
			to : vaultContract.options.address,
			data : vaultContract.methods.deplete().encodeABI(),
			maxPriorityFeePerGas: Web3.utils.toHex(standardTransactionGasFees.maxPriorityFee*1e9),
			maxFeePerGas: Web3.utils.toHex(standardTransactionGasFees.maxFee*1e9),
			nonce: nonceManager.getNextNonce(),
		});

		try {
			const signed = await currentlySelectedWeb3Client.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);

			await currentlySelectedWeb3Client.eth.sendSignedTransaction(signed.rawTransaction);

			appLogger.info("Vault successfully depleted.");
		} catch(error) {
			appLogger.error("Vault deplete transaction failed!", error);
		}
	}

	setInterval(() => {
		refill();
		deplete();
	}, CHECK_REFILL_MS);
}

// ------------------------------------------
// 13. AUTO HARVEST REWARDS
// ------------------------------------------

if(AUTO_HARVEST_MS > 0){
	async function claimTokens(){
		const tx = createTransaction({
			to : nftRewardsContract.options.address,
			data : nftRewardsContract.methods.claimTokens().encodeABI(),
			maxPriorityFeePerGas: Web3.utils.toHex(standardTransactionGasFees.maxPriorityFee*1e9),
			maxFeePerGas: Web3.utils.toHex(standardTransactionGasFees.maxFee*1e9),
			nonce: nonceManager.getNextNonce(),
		});


		try {
			const signed = await currentlySelectedWeb3Client.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);

			await currentlySelectedWeb3Client.eth.sendSignedTransaction(signed.rawTransaction);

			appLogger.info("Tokens claimed.");
		} catch (error) {
			appLogger.error("Claim tokens transaction failed!", error);
		};
	}

	async function claimPoolTokens(){
		let currentRound = await nftRewardsContract.methods.currentRound().call();
		currentRound = parseFloat(currentRound.toString());

		if(currentRound === 0) {
			appLogger.info("Current round is 0, skipping claimPoolTokens for now.");

			return;
		}

		const fromRound = currentRound < 101 ? 0 : currentRound-101;
		const toRound =  currentRound - 1;

		const tx = createTransaction({
			to : nftRewardsContract.options.address,
			data : nftRewardsContract.methods.claimPoolTokens(fromRound, toRound).encodeABI(),
			maxPriorityFeePerGas: Web3.utils.toHex(standardTransactionGasFees.maxPriorityFee*1e9),
			maxFeePerGas: Web3.utils.toHex(standardTransactionGasFees.maxFee*1e9),
			nonce: nonceManager.getNextNonce(),
		});


		try {
			const signed = await currentlySelectedWeb3Client.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);

			await currentlySelectedWeb3Client.eth.sendSignedTransaction(signed.rawTransaction)

			appLogger.info("Pool Tokens claimed.");
		} catch (error) {
			appLogger.error("Claim pool tokens transaction failed!", error);
		}
	}

	setInterval(async () => {
		appLogger.info("Harvesting rewards...");

		try
		{
			await Promise.all(
				[
					claimTokens(),
					claimPoolTokens()
				]);
		} catch (error) {
			appLogger.error("Harvesting rewards failed unexpectedly!", error);
		}
	}, AUTO_HARVEST_MS);
}

/**
 * Creates a base transaction object using fixed, configured values and optionally fills out any additionally
 * supplied properties.
 * @param {Object} additionalTransactionProps - Any additional properties that should be applied to (or overridden on)
 * the base transaction object.
*/
function createTransaction(additionalTransactionProps) {
	const transaction = {
		gas: MAX_GAS_PER_TRANSACTION_HEX,
		...additionalTransactionProps
	}

	return transaction;
}
