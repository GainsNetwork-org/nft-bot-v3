// ------------------------------------
// 1. DEPENDENCIES
// ------------------------------------

const dotenv = require("dotenv");

// Load base .env file first
dotenv.config();

// If there's a specific NODE_ENV set, attempt to load that environment specific .env file
if(process.env.NODE_ENV) {
	const environmentSpecificFile = `.env.${process.env.NODE_ENV}`;
	const fs = require("fs");

	if(fs.existsSync(environmentSpecificFile)) {
		dotenv.config({
			path: environmentSpecificFile,
			override: true
		});	
	}
}

const Web3 = require("web3");
const WebSocket = require('ws');
const fetch = require('node-fetch');
const forex = require('./forex.js');
const abis = require('./abis');

// -----------------------------------------
// 2. GLOBAL VARIABLES
// -----------------------------------------

let allowedLink = false, currentlySelectedWeb3ClientIndex = -1, eventSubTrading = null, eventSubCallbacks = null,
	web3Providers = [], web3Clients = [], maxPriorityFeePerGas = 50,
	knownOpenTrades = new Map(), spreadsP = [], openInterests = [], collaterals = [], nfts = [], nftsBeingUsed = new Set(), triggeredOrders = new Map(),
	storageContract, tradingContract, callbacksContract, vaultContract, pairsStorageContract, nftRewardsContract,
	nftTimelock = 0, maxTradesPerPair = 0,
	nftContract1, nftContract2, nftContract3, nftContract4, nftContract5, linkContract;

// --------------------------------------------
// 3. INIT: CHECK ENV VARS & LINK ALLOWANCE
// --------------------------------------------

console.log("Welcome to the gTrade NFT bot!");
if(!process.env.WSS_URLS || !process.env.PRICES_URL || !process.env.STORAGE_ADDRESS
|| !process.env.PRIVATE_KEY || !process.env.PUBLIC_KEY || !process.env.EVENT_CONFIRMATIONS_SEC 
|| !process.env.MAX_GAS_PRICE_GWEI || !process.env.CHECK_REFILL_SEC
|| !process.env.VAULT_REFILL_ENABLED || !process.env.AUTO_HARVEST_SEC || !process.env.MIN_PRIORITY_GWEI
|| !process.env.PRIORITY_GWEI_MULTIPLIER || !process.env.PAIR_INFOS_ADDRESS){
	console.log("Please fill all parameters in the .env file.");
	process.exit();
}

// Parse non-string configuration constants from environment variables up front
const MAX_GAS_PRICE_GWEI = parseInt(process.env.MAX_GAS_PRICE_GWEI, 10),
	  CHECK_REFILL_SEC = parseInt(process.env.CHECK_REFILL_SEC, 10),
	  EVENT_CONFIRMATIONS_SEC = parseInt(process.env.EVENT_CONFIRMATIONS_SEC, 10),
	  AUTO_HARVEST_SEC = parseInt(process.env.AUTO_HARVEST_SEC, 10),
	  FAILED_ORDER_TRIGGER_TIMEOUT_MS = (process.env.FAILED_ORDER_TRIGGER_TIMEOUT_SEC ?? '').length > 0 ? parseInt(process.env.FAILED_ORDER_TRIGGER_TIMEOUT_SEC, 10) * 1000 : 60 * 1000;

async function checkLinkAllowance(){
	try {
		const allowance = await linkContract.methods.allowance(process.env.PUBLIC_KEY, process.env.STORAGE_ADDRESS).call();
		if(parseFloat(allowance) > 0){
			allowedLink = true;
			console.log("LINK allowance OK.");
		}else{
			console.log("LINK not allowed, approving now.");

			const tx = {
				from: process.env.PUBLIC_KEY,
				to : linkContract.options.address,
				data : linkContract.methods.approve(process.env.STORAGE_ADDRESS, "115792089237316195423570985008687907853269984665640564039457584007913129639935").encodeABI(),
				maxPriorityFeePerGas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex(maxPriorityFeePerGas*1e9),
				maxFeePerGas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex(MAX_GAS_PRICE_GWEI*1e9),
				gas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex("100000")
			};

			web3Clients[currentlySelectedWeb3ClientIndex].eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY).then(signed => {
				web3Clients[currentlySelectedWeb3ClientIndex].eth.sendSignedTransaction(signed.rawTransaction)
				.on('receipt', () => {
					console.log("LINK successfully approved.");
					allowedLink = true;
				}).on('error', (e) => {
					console.log("LINK approve tx fail (" + e + ")");
					setTimeout(() => { checkLinkAllowance(); }, 2*1000);
				});
			}).catch(e => {
				console.log("LINK approve tx fail (" + e + ")");
				setTimeout(() => { checkLinkAllowance(); }, 2*1000);
			});
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
	console.log("Switching web3 client to " + WEB3_PROVIDER_URLS[newWeb3ClientIndex] + " (#" + newWeb3ClientIndex + ")...");
	
	const executionStartTime = Date.now();

	// Unsubscribe from existing events first
	if(eventSubTrading !== null && eventSubTrading.id !== null){ eventSubTrading.unsubscribe(); }
	if(eventSubCallbacks !== null && eventSubCallbacks.id !== null){ eventSubCallbacks.unsubscribe(); }
	eventSubTrading = null;
	eventSubCallbacks = null;
	
	storageContract = new web3Clients[newWeb3ClientIndex].eth.Contract(abis.STORAGE, process.env.STORAGE_ADDRESS);

	// Retrieve all necessary details from the storage contract
	const [
		aggregatorAddress,
		callbacksAddress,
		tradingAddress,
		vaultAddress,
		nftAddress1,
		nftAddress2,
		nftAddress3,
		nftAddress4,
		nftAddress5,
		linkAddress
	] = await Promise.all([
		storageContract.methods.priceAggregator().call(),
		storageContract.methods.callbacks().call(),
		storageContract.methods.trading().call(),
		storageContract.methods.vault().call(),
		storageContract.methods.nfts(0).call(),
		storageContract.methods.nfts(1).call(),
		storageContract.methods.nfts(2).call(),
		storageContract.methods.nfts(3).call(),
		storageContract.methods.nfts(4).call(),
		storageContract.methods.linkErc677().call()
	]);

	const aggregatorContract = new web3Clients[newWeb3ClientIndex].eth.Contract(abis.AGGREGATOR, aggregatorAddress);
	
	// Retrieve all necessary details from the aggregator contract
	const [
		pairsStorageAddress,
		nftRewardsAddress
	 ] = await Promise.all([
		aggregatorContract.methods.pairsStorage().call(),
		aggregatorContract.methods.nftRewards().call()
	 ]);
	
	pairsStorageContract = new web3Clients[newWeb3ClientIndex].eth.Contract(abis.PAIRS_STORAGE, pairsStorageAddress);
	nftRewardsContract = new web3Clients[newWeb3ClientIndex].eth.Contract(abis.NFT_REWARDS, nftRewardsAddress);

	callbacksContract = new web3Clients[newWeb3ClientIndex].eth.Contract(abis.CALLBACKS, callbacksAddress);
	tradingContract = new web3Clients[newWeb3ClientIndex].eth.Contract(abis.TRADING, tradingAddress);
	vaultContract = new web3Clients[newWeb3ClientIndex].eth.Contract(abis.VAULT, vaultAddress);

	nftContract1 = new web3Clients[newWeb3ClientIndex].eth.Contract(abis.NFT, nftAddress1);
	nftContract2 = new web3Clients[newWeb3ClientIndex].eth.Contract(abis.NFT, nftAddress2);
	nftContract3 = new web3Clients[newWeb3ClientIndex].eth.Contract(abis.NFT, nftAddress3);
	nftContract4 = new web3Clients[newWeb3ClientIndex].eth.Contract(abis.NFT, nftAddress4);
	nftContract5 = new web3Clients[newWeb3ClientIndex].eth.Contract(abis.NFT, nftAddress5);

	linkContract = new web3Clients[newWeb3ClientIndex].eth.Contract(abis.LINK, linkAddress);

	// Update the globally selected provider with this new provider
	currentlySelectedWeb3ClientIndex = newWeb3ClientIndex;
	
	// Subscribe to events using the new provider
	watchLiveTradingEvents();
	
	// Fire and forget refreshing of data using new provider
	fetchTradingVariables();
	fetchOpenTrades();
	checkLinkAllowance();
	
	console.log("New web3 client selection completed. Took: " + (Date.now() - executionStartTime) + "ms");
}

const getWeb3Provider = (web3ProviderUrlIndex) => {
	const provider = new Web3.providers.WebsocketProvider(WEB3_PROVIDER_URLS[web3ProviderUrlIndex], {clientConfig:{keepalive:true,keepaliveInterval:30*1000}});

	provider.on('close', () => {
		setTimeout(() => {
			if(!provider.connected){
				console.log(WEB3_PROVIDER_URLS[web3ProviderUrlIndex]+' closed: trying to reconnect...');

				let connectedProvider = -1;
				for(let i = 0; i < WEB3_PROVIDER_URLS.length; i++){
					if(web3Providers[i].connected){
						connectedProvider = i;
						break;
					}
				}
				if(connectedProvider > -1 && currentlySelectedWeb3ClientIndex === web3ProviderUrlIndex){
					setCurrentWeb3Client(connectedProvider);
					console.log("Switched to WSS " + WEB3_PROVIDER_URLS[currentlySelectedWeb3ClientIndex]);
				}else if(connectedProvider === -1 && currentlySelectedWeb3ClientIndex === web3ProviderUrlIndex){
					console.log("No WSS to switch to...");
				}

				web3Providers[web3ProviderUrlIndex] = getWeb3Provider(web3ProviderUrlIndex);
				web3Clients[web3ProviderUrlIndex] = new Web3(web3Providers[web3ProviderUrlIndex]);
			}
		}, 1*1000);
	});

	provider.on('connect', () => {
		if(provider.connected){
			console.log('Connected to WSS '+WEB3_PROVIDER_URLS[web3ProviderUrlIndex]+'.');
		}
	});
	provider.on('error', () => { console.log("WSS "+WEB3_PROVIDER_URLS[web3ProviderUrlIndex]+" error"); provider.disconnect(); });
	return provider;
};

for(var i = 0; i < WEB3_PROVIDER_URLS.length; i++){
	const provider = getWeb3Provider(i);
	web3Providers.push(provider);
	web3Clients.push(new Web3(provider));
}

// TODO: consider making this a config value
const MAX_PROVIDER_BLOCK_DRIFT = 5;

async function checkWeb3ClientLiveness() {
	console.log("Checking liveness of all " + WEB3_PROVIDER_URLS.length + " web3 client(s)...");

	const executionStartTime = Date.now();

	const latestWeb3ProviderBlocks = await Promise.all(WEB3_PROVIDER_URLS.map(async (wssUrl, wssIndex) => {
		try
		{
			return await web3Clients[wssIndex].eth.getBlockNumber();
		} catch (error) {
			console.log("Error retrieving current block number from web3 client " + wssUrl + ": " + error.message, error);

			return Number.MIN_SAFE_INTEGER;
		}
	}));
	
	console.log("Current vs. latest provider blocks: ", WEB3_PROVIDER_URLS, currentWeb3ClientBlocks, latestWeb3ProviderBlocks);

	// Update global to latest blocks
	currentWeb3ClientBlocks = latestWeb3ProviderBlocks;

	const originalWeb3ClientIndex = currentlySelectedWeb3ClientIndex;

	// Check if no client has been selected yet (i.e. this is initialization phase of app)
	if(originalWeb3ClientIndex === -1){
		await selectInitialProvider();
	} else {
		await ensureCurrentlySelectedProviderHasLatestBlock();
	}

	console.log("Web3 client liveness check completed. Took: " + (Date.now() - executionStartTime) + "ms");

	async function selectInitialProvider() {
		// Find the most recent block
		const maxBlock = Math.max(...currentWeb3ClientBlocks);
		
		const clientWithMaxBlockIndex = currentWeb3ClientBlocks.findIndex(v => v === maxBlock);
		
		// Start with the provider with the most recent block
		await setCurrentWeb3Client(clientWithMaxBlockIndex);

		console.log("Initial Web3 client selected: " + WEB3_PROVIDER_URLS[clientWithMaxBlockIndex]);
	}

	async function ensureCurrentlySelectedProviderHasLatestBlock() {
		const currentlySelectedWeb3ClientIndexMaxDriftBlock = currentWeb3ClientBlocks[currentlySelectedWeb3ClientIndex] + MAX_PROVIDER_BLOCK_DRIFT;
		
		for(let i = 0; i < currentWeb3ClientBlocks.length; i++){
			// Don't check the currently selected client against itself
			if(i === currentlySelectedWeb3ClientIndex) {
				continue;
			}
			
			// If the current provider is ahead of the selected provider by more N blocks then switch to this provider instead
			if(currentWeb3ClientBlocks[i] >= currentlySelectedWeb3ClientIndexMaxDriftBlock){
				console.log("Switching to provider " + WEB3_PROVIDER_URLS[i] + " #" + i + " (" + currentWeb3ClientBlocks[i] + " vs " + currentWeb3ClientBlocks[currentlySelectedWeb3ClientIndex] + ")");
				
				await setCurrentWeb3Client(i);
				
				break;
			}
		}

		if(currentlySelectedWeb3ClientIndex === originalWeb3ClientIndex) {
			console.log("No need to switch to a different client; sticking with " + WEB3_PROVIDER_URLS[currentlySelectedWeb3ClientIndex] + ".");
		} else {
			console.log("Switched to client " + WEB3_PROVIDER_URLS[currentlySelectedWeb3ClientIndex] + " completed.");
		}
	}
}

checkWeb3ClientLiveness();
setInterval(async () => {
	checkWeb3ClientLiveness();
}, 10*1000);

setInterval(() => {
	console.log("Current Web3 client: " + web3Clients[currentlySelectedWeb3ClientIndex].currentProvider.url + " (#"+currentlySelectedWeb3ClientIndex+")");
}, 120*1000);

// -----------------------------------------
// 5. FETCH DYNAMIC GAS PRICE
// -----------------------------------------

setInterval(() => {
	fetch("https://gasstation-mainnet.matic.network/v2/").then(r => r.json()).then((r) => {
		maxPriorityFeePerGas = Math.round(
			Math.max(
				Math.round(r.fast.maxPriorityFee) * process.env.PRIORITY_GWEI_MULTIPLIER, 
				process.env.MIN_PRIORITY_GWEI
			)
		);
	}).catch(() => { console.log("Error while fetching fastest gwei from gas station.") });
}, 3*1000);

// -----------------------------------------
// 6. FETCH PAIRS, NFTS, AND NFT TIMELOCK
// -----------------------------------------

async function fetchTradingVariables(){
	const executionStartTime = new Date().getTime();

	try
	{
		await Promise.all(
			[
				fetchNfts(),
				fetchPairs()
			]);

		const executionEndTime = new Date().getTime();

		console.log("Done fetching trading variables. Took: " + (executionEndTime - executionStartTime) + "ms");
	} catch(error) {
		console.log("Error while fetching trading variables: " + error.message, error);

		setTimeout(() => { fetchTradingVariables(); }, 2*1000);
	};

	async function fetchNfts() {
		console.log("Fetching available NFTs...");
		
		const [
			nftSuccessTimelock, 
			nftsCount1,
			nftsCount2,
			nftsCount3,
			nftsCount4,
			nftsCount5
		] = await Promise.all(
			[
				storageContract.methods.nftSuccessTimelock().call(),
				nftContract1.methods.balanceOf(process.env.PUBLIC_KEY).call(),
				nftContract2.methods.balanceOf(process.env.PUBLIC_KEY).call(),
				nftContract3.methods.balanceOf(process.env.PUBLIC_KEY).call(),
				nftContract4.methods.balanceOf(process.env.PUBLIC_KEY).call(),
				nftContract4.methods.balanceOf(process.env.PUBLIC_KEY).call(),
			]);
	
		nfts = (await Promise.all(
			[
				{ nftContract: nftContract1, nftType: 1, count: nftsCount1 }, 
				{ nftContract: nftContract2, nftType: 2, count: nftsCount2 },
				{ nftContract: nftContract3, nftType: 3, count: nftsCount3 },
				{ nftContract: nftContract4, nftType: 4, count: nftsCount4 },
				{ nftContract: nftContract5, nftType: 5, count: nftsCount5 }
			].map(async nft => {
				const allNftIdsOfTypeCalls = new Array(nft.count);
				
				for(let i = 0; i < nft.count; i++) {
					allNftIdsOfTypeCalls[i] = nft.nftContract.methods.tokenOfOwnerByIndex(process.env.PUBLIC_KEY, i).call()
				}
	
				const allNftIdsOfType = await Promise.all(allNftIdsOfTypeCalls);
	
				return allNftIdsOfType
					.filter(nftId => nftId !== "0")
					.map(nftId => ({ id: nftId, type: nft.nftType }));
			}))).flat();
	
		nftTimelock = parseInt(nftSuccessTimelock, 10);
		
		console.log("NFTs fetched: available=" + nfts.length + ";timelock=" + nftTimelock);
	}

	async function fetchPairs() {
		const [
			maxPerPair, 
			pairsCount
		] = await Promise.all(
			[
				storageContract.methods.maxTradesPerPair().call(),
				pairsStorageContract.methods.pairsCount().call()
			]);
			
		let pairsPromises = [];
		for(var i = 0; i < pairsCount; i++){
			pairsPromises.push(pairsStorageContract.methods.pairsBackend(i).call());
		}

		const pairs = await Promise.all(pairsPromises);
		spreadsP = new Array(pairs.length);
		
		await Promise.all(pairs.map(async (pair, pairIndex) => {
			const [
				openInterestLong,
				openInterestShort,
				openInterestMax,
				collateralLong,
				collateralShort,
				collateralMax
				] = await Promise.all(
					[
					storageContract.methods.openInterestDai(pairIndex, 0).call(),
					storageContract.methods.openInterestDai(pairIndex, 1).call(),
					storageContract.methods.openInterestDai(pairIndex, 2).call(),
					pairsStorageContract.methods.groupsCollaterals(pairIndex, 0).call(),
					pairsStorageContract.methods.groupsCollaterals(pairIndex, 1).call(),
					pairsStorageContract.methods.groupMaxCollateral(pairIndex).call()
				]);

			openInterests[pairIndex] = {long: openInterestLong, short: openInterestShort, max: openInterestMax};
			collaterals[pairIndex] = {long: collateralLong, short: collateralShort, max: collateralMax};
			spreadsP[pairIndex] = pair["0"].spreadP;
		}));

		maxTradesPerPair = maxPerPair;
	}
}

// Force refresh every 60 seconds (for now)
setInterval(() => {
	fetchTradingVariables();
	fetchOpenTrades();
}, 60*1000);

// -----------------------------------------
// 7. SELECT NFT TO EXECUTE ORDERS
// -----------------------------------------

let selectNft = () => {
	if(nfts.length === 0) { 
		console.log("No NFTs loaded yet.");

		return null; 
	}

	// Self patch to the optimal implementation on first call
	if(nfts.length === 1) {
		selectNft = selectOnlyNft;
	} else {
		selectNft = selectNftFromMultiple;
	}

	return selectNft();
}

async function selectOnlyNft() {
	const onlyNft = nfts[0];

	// If there's no timelock then just return immediately
	if(nftTimelock === 0) {
		return onlyNft;
	}

	const currentBlock = await web3Clients[currentlySelectedWeb3ClientIndex].eth.getBlockNumber();

	// Make sure the NFT is outside the timelock
	if(currentBlock - onlyNft.lastSuccess <= nftTimelock) {
		return null;	
	}
	
	return onlyNft;	
}

async function selectNftFromMultiple() {
	console.log("NFTs: total loaded=" + nfts.length);
	
	if(nftTimelock === 0) {
		return selectNftRoundRobin();
	}
	
	return await selectNftUsingTimelock();
}

function selectNftRoundRobin() {
	let nextNftIndex = nfts.nextIndex ?? 0;

	const nextNft = nfts[nextNftIndex];
	
	// If we're about to go past the end of the array, just go back to beginning
	nfts.nextIndex = nextNftIndex === nfts.length - 1 ? 0 : nextNftIndex + 1;

	return nextNft;
}

async function selectNftUsingTimelock() {
	try
	{
		const currentBlock = await web3Clients[currentlySelectedWeb3ClientIndex].eth.getBlockNumber();

		// Load the last successful block for each NFT that we know is not actively being used
		const nftsWithLastSuccesses = await Promise.all(
				nfts
					.filter(nft => !nftsBeingUsed.has(nft.id))
					.map(async nft => ({ 
						nft,
						lastSuccess: parseFloat(await storageContract.methods.nftLastSuccess(nft.id).call())
					})));

		// Try to find the first NFT whose last successful block is older than the current block by the required timelock amount
		const firstEligibleNft = nftsWithLastSuccesses.find(nftwls => currentBlock - nftwls.lastSuccess >= nftTimelock);

		if(firstEligibleNft !== undefined) {
			return firstEligibleNft.nft;
		}

		console.log("No suitable NFT to select.");
			
		return null;
	} catch(error) { 
		console.log("Error occurred while trying to select NFT: " + error.message, error);

		return null;
	}
}

// -----------------------------------------
// 8. LOAD OPEN TRADES
// -----------------------------------------

function buildOpenTradeKey(tradeDetails) {
	return `t=${tradeDetails.trader};pi=${tradeDetails.pairIndex};i=${tradeDetails.index};`;
}

function buildTriggeredOrderTrackingInfoIdentifier(orderTrackingInfo) {
	return orderTrackingInfo.trade.trader + "-" + orderTrackingInfo.trade.pairIndex + "-" + orderTrackingInfo.trade.index + "-" + orderTrackingInfo.type;
}

async function fetchOpenTrades(){
	console.log("Fetching open trades...");
	
	try {
		if(spreadsP.length === 0){
			console.log("Spreads are not yet loaded; will retry fetching open trades shortly!");
			
			setTimeout(() => { fetchOpenTrades(); }, 2*1000);

			return;
		}

		const [
			openLimitOrders, 
			pairTraders
		] = await Promise.all(
			[
				fetchOpenLimitOrders(),
				fetchOpenPairTrades()
			]);
		
		knownOpenTrades = new Map(openLimitOrders.concat(pairTraders).map(trade => [buildOpenTradeKey(trade), trade]));

		console.log("Fetched " + knownOpenTrades.size + " total open trade(s).");

	} catch(error) {
		console.log("Error fetching open trades: " + error.message, error);
		
		setTimeout(() => { fetchOpenTrades(); }, 2*1000);
	}
	
	async function fetchOpenLimitOrders() {		
		console.log("Fetching open limit orders...");
		
		const openLimitOrders = await storageContract.methods.getOpenLimitOrders().call();
		
		const openLimitOrdersWithTypes = await Promise.all(openLimitOrders.map(async olo => {
			const type = await nftRewardsContract.methods.openLimitOrderTypes(olo.trader, olo.pairIndex, olo.index).call();

			return { ...olo, type };
		}));

		console.log("Fetched " + openLimitOrdersWithTypes.length + " open limit order(s).");

		return openLimitOrdersWithTypes;
	}

	async function fetchOpenPairTrades() {
		console.log("Fetching open pair trades...");

		const allOpenPairTrades = (await Promise.all(spreadsP.map(async (_, spreadPIndex) => {
			const pairTraderAddresses = await storageContract.methods.pairTradersArray(spreadPIndex).call();

			const openTradesForPairTraders = await Promise.all(pairTraderAddresses.map(async pairTraderAddress => {
				const openTradesCalls = new Array(maxTradesPerPair);

				for(let pairTradeIndex = 0; pairTradeIndex < maxTradesPerPair; pairTradeIndex++){
					openTradesCalls[pairTradeIndex] = storageContract.methods.openTrades(pairTraderAddress, spreadPIndex, pairTradeIndex).call();
				}
				
				const openTradesForTraderAddress = await Promise.all(openTradesCalls);
				
				// Filter out any of the trades that aren't *really* open (NOTE: these will have an empty trader address, so just test against that)
				return openTradesForTraderAddress.filter(openTrade => openTrade.trader === pairTraderAddress);
			}));

			return openTradesForPairTraders;
		}))).flat(2);

		console.log("Fetched " + allOpenPairTrades.length + " open pair trade(s).");

		return allOpenPairTrades;
	}
}
// -----------------------------------------
// 9. WATCH TRADING EVENTS
// -----------------------------------------

function watchLiveTradingEvents(){
	try {
		if(eventSubTrading === null){
			eventSubTrading = tradingContract.events.allEvents({ fromBlock: 'latest' }).on('data', function (event){
				const eventName = event.event.toString();

				if(eventName !== "OpenLimitPlaced" && eventName !== "OpenLimitUpdated"
				&& eventName !== "OpenLimitCanceled" && eventName !== "TpUpdated"
				&& eventName !== "SlUpdated"){
					return;
				}

				event.triedTimes = 1;

				setTimeout(() => {
					refreshOpenTrades(event);
				}, EVENT_CONFIRMATIONS_SEC*1000);
			});
		}

		if(eventSubCallbacks === null){
			eventSubCallbacks = callbacksContract.events.allEvents({ fromBlock: 'latest' }).on('data', function (event){
				const eventName = event.event.toString();

				if(eventName !== "MarketExecuted" && eventName !== "LimitExecuted"
				&& eventName !== "MarketCloseCanceled" && eventName !== "SlUpdated" 
				&& eventName !== "SlCanceled"){
					return;
				}

				event.triedTimes = 1;

				setTimeout(() => {
					refreshOpenTrades(event);
				}, EVENT_CONFIRMATIONS_SEC*1000);
			});
		}
	} catch {
		setTimeout(() => { watchLiveTradingEvents(); }, 2*1000);
	}
}

// -----------------------------------------
// 10. REFRESH INTERNAL OPEN TRADES LIST
// -----------------------------------------
const MAX_EVENT_RETRY_TIMES = 10;

async function refreshOpenTrades(event){
	try {
		const eventName = event.event;
		const eventValues = event.returnValues;
		let failed = false;

		// UNREGISTER OPEN LIMIT ORDER
		// => IF OPEN LIMIT CANCELED OR OPEN LIMIT EXECUTED
		if(eventName === "OpenLimitCanceled" 
				|| 
			(eventName === "LimitExecuted" && eventValues.orderType.toString() === "3")) {
			const trader = eventName === "OpenLimitCanceled" ? eventValues.trader : eventValues.t[0];
			const pairIndex = eventName === "OpenLimitCanceled" ? eventValues.pairIndex : eventValues.t[1];
			const index = eventName === "OpenLimitCanceled" ? eventValues.index : eventValues.limitIndex;

			const hasLimitOrder = await storageContract.methods.hasOpenLimitOrder(trader, pairIndex, index).call();

			if(hasLimitOrder.toString() === "false") {
				const tradeKey = buildOpenTradeKey({ trader, pairIndex, index });
				const existingKnownOpenTrade = knownOpenTrades.get(tradeKey);

				if(existingKnownOpenTrade !== undefined && existingKnownOpenTrade.hasOwnProperty('minPrice')) {
					knownOpenTrades.delete(tradeKey);
					
					console.log("Watch events ("+eventName+"): Removed limit");
				}
			}else{
				failed = true;
			}
		}

		// STORE/UPDATE OPEN LIMIT ORDER
		// => IF OPEN LIMIT ORDER PLACED OR OPEN LIMIT ORDER UPDATED
		if(eventName === "OpenLimitPlaced" 
				|| 
			eventName === "OpenLimitUpdated"){
			const { trader, pairIndex, index } = eventValues;
			const hasLimitOrder = await storageContract.methods.hasOpenLimitOrder(trader, pairIndex, index).call();

			if(hasLimitOrder.toString() === "true") {
				const id = await storageContract.methods.openLimitOrderIds(trader, pairIndex, index).call();
				
				const [
					limitOrder,
					type 
				] = await Promise.all(
					[
						storageContract.methods.openLimitOrders(id).call(),
						nftRewardsContract.methods.openLimitOrderTypes(trader, pairIndex, index).call()
					]);

				limitOrder.type = type;

				const tradeKey = buildOpenTradeKey(eventValues);
				const existingKnownOpenTrade = knownOpenTrades.get(tradeKey);

				if(existingKnownOpenTrade !== undefined && existingKnownOpenTrade.hasOwnProperty('minPrice')){
					knownOpenTrades.set(tradeKey, limitOrder);

					console.log("Watch events ("+eventName+"): Updated limit");
				} else {
					knownOpenTrades.set(tradeKey, limitOrder); 

					console.log("Watch events ("+eventName+"): Stored limit");
				}
			} else {
				failed = true;
			}
		}

		// STORE/UPDATE TRADE
		// => IF MARKET OPEN EXECUTED OR OPEN TRADE LIMIT EXECUTED OR TP/SL UPDATED OR TRADE UPDATED (MARKET CLOSED)
		if((eventName === "MarketExecuted" && eventValues.open === true) 
				|| 
			(eventName === "LimitExecuted" && eventValues.orderType.toString() === "3")
				|| 
			eventName === "TpUpdated" || eventName === "SlUpdated" || eventName === "SlCanceled"
				|| 
			eventName === "MarketCloseCanceled"){
			const trader = eventName !== "MarketExecuted" && eventName !== "LimitExecuted" ? eventValues.trader : eventValues.t[0];
			const pairIndex = eventName !== "MarketExecuted" && eventName !== "LimitExecuted" ? eventValues.pairIndex : eventValues.t[1];
			const index = eventName !== "MarketExecuted" && eventName !== "LimitExecuted" ? eventValues.index : eventValues.t[2];

			const [trade, tradeInfo, initialAccFees] = await Promise.all([
				storageContract.methods.openTrades(trader, pairIndex, index).call(),
				storageContract.methods.openTradesInfo(trader, pairIndex, index).call(),
				pairInfosContract.methods.tradeInitialAccFees(trader, pairIndex, index).call()
			]);
			
			if(parseFloat(trade.leverage) > 0) {
				const tradeKey = buildOpenTradeKey({ trader, pairIndex, index });
				const existingKnownOpenTrade = knownOpenTrades.get(tradeKey);

				if(existingKnownOpenTrade !== undefined && existingKnownOpenTrade.hasOwnProperty('openPrice')) {
					knownOpenTrades.set(tradeKey, trade); 

					console.log("Watch events ("+eventName+"): Updated trade");
				} else {
					knownOpenTrades.set(tradeKey, trade); 

					console.log("Watch events ("+eventName+"): Stored trade");
				}
			} else {
				failed = true;
			}
		}

		// UNREGISTER TRADE
		// => IF MARKET CLOSE EXECUTED OR CLOSE LIMIT EXECUTED
		if((eventName === "MarketExecuted" && eventValues.open.toString() === "false") 
				|| 
			(eventName === "LimitExecuted" && eventValues.orderType !== "3")){
			const [ trader, pairIndex, index ] = eventValues.t;
			const trade = await storageContract.methods.openTrades(trader, pairIndex, index).call();

			if(parseFloat(trade.leverage) === 0){
				const triggeredOrderTrackingInfoIdentifier = buildTriggeredOrderTrackingInfoIdentifier({
					trade: trade, 
					type: eventValues.orderType,
				});

				const triggeredOrderTimerId = triggeredOrders.get(triggeredOrderTrackingInfoIdentifier);
				
				// If we were tracking this triggered order, stop tracking it now and clear the timeout so it doesn't
				// interrupt the event loop for no reason later
				if(triggeredOrderTimerId !== undefined) {
					clearTimeout(triggeredOrderTimerId);
					
					triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier);
				}

				const tradeKey = buildOpenTradeKey({ trader, pairIndex, index });
				const existingKnownOpenTrade = knownOpenTrades.get(tradeKey);
				
				if(existingKnownOpenTrade !== undefined && existingKnownOpenTrade.hasOwnProperty('openPrice')) {
					knownOpenTrades.delete(tradeKey);

					console.log("Watch events (" + eventName + "): Removed trade");
				}
			} else {
				failed = true;
			}
		}

		if(failed) {
			if(event.triedTimes == MAX_EVENT_RETRY_TIMES) { 
				console.log("WARNING: Failed to process event '" + eventName + "' (from block #" + event.blockNumber + ") the max number of times (" + MAX_EVENT_RETRY_TIMES + "). This event will be dropped and not tried again.", event);
				
				return; 
			}

			event.triedTimes++;

			setTimeout(() => {
				refreshOpenTrades(event);
			}, EVENT_CONFIRMATIONS_SEC/2*1000);

			console.log("Watch events ("+eventName+"): Trade not found on the blockchain, trying again in " + (EVENT_CONFIRMATIONS_SEC/2) + " seconds.");
		}
	} catch(error) {
		console.log("Problem when refreshing trades: " + error.message, error); 
	}
}

async function refreshPairFundingFees(event){
	web3[selectedProvider].eth.net.isListening().then(async () => {
		const pairIndex = parseInt(event.returnValues.pairIndex);
		const pairFundingFees = await pairInfosContract.methods.pairFundingFees(pairIndex).call();

		pairFundingFees[pairIndex] = {
			accPerOiLong: pairFundingFees.accPerOiLong / 1e18, 
			accPerOiShort: pairFundingFees.accPerOiShort / 1e18, 
			lastUpdateBlock: parseInt(pairFundingFees.lastUpdateBlock)
		};
	});
}

// ---------------------------------------------
// 11. FETCH CURRENT PRICES & TRIGGER ORDERS
// ---------------------------------------------

function alreadyTriggered(trade, orderType){
	for(var i = 0; i < ordersTriggered.size; i++){
		if(ordersTriggered[i].orderType === orderType){
			const t = ordersTriggered[i].trade;
			if(trade.trader === t.trader && trade.pairIndex === t.pairIndex && trade.index === t.index){
				return true;
			}
		}
	}
	return false;
}

// Start monitoring forex
forex.startForexMonitoring();

function wss() {
	let socket = new WebSocket(process.env.PRICES_URL);
	socket.onclose = () => { setTimeout(() => { wss() }, 2000); };
	socket.onerror = () => { socket.close(); };
	socket.onmessage = async (msg) => {
		if(spreadsP.length === 0) {
			console.log("WARNING: Spreads are not yet loaded; unable to process any trades!");

			return;
		}

		if(!allowedLink) {
			//console.log("WARNING: link is not currently allowed; unable to process any trades!");

			return;
		}

		const messageData = JSON.parse(msg.data);
		
		if(messageData.closes === undefined) {
			console.log('No closes in this message; ignoring.')

			return;
		}

		const forexMarketClosed = !forex.isForexMarketOpen();

		for(const openTrade of knownOpenTrades.values()) {
			if(forexMarketClosed && openTrade.pairIndex >= 21 && openTrade.pairIndex <= 30) {
				console.log("The trade is a forex trade, but the forex market is currently closed; skipping.");

				continue;
			}

			const price = messageData.closes[openTrade.pairIndex];
			const buy = openTrade.buy.toString() === "true";
			let orderType = -1;

			if(openTrade.openPrice !== undefined) {
				const tp = parseFloat(openTrade.tp)/1e10;
				const sl = parseFloat(openTrade.sl)/1e10;
				const open = parseFloat(openTrade.openPrice)/1e10;
				const lev = parseFloat(openTrade.leverage);
				const liqPrice = buy ? open - 0.9/lev*open : open + 0.9/lev*open;

				if(tp.toString() !== "0" && ((buy && price >= tp) || (!buy && price <= tp))) {
					orderType = 0;
				} else if(sl.toString() !== "0" && ((buy && price <= sl) || (!buy && price >= sl))) {
					orderType = 1;
				} else if(sl.toString() === "0" && ((buy && price <= liqPrice) || (!buy && price >= liqPrice))) {
					orderType = 2;
				}
			} else {
				const spread = spreadsP[openTrade.pairIndex]/1e10*(100-openTrade.spreadReductionP)/100;
				const priceIncludingSpread = !buy ? price*(1-spread/100) : price*(1+spread/100);
				const interestDai = buy ? parseFloat(openInterests[openTrade.pairIndex].long) : parseFloat(openInterests[openTrade.pairIndex].short);
				const collateralDai = buy ? parseFloat(collaterals[openTrade.pairIndex].long) : parseFloat(collaterals[openTrade.pairIndex].short);
				const newInterestDai = (interestDai + parseFloat(openTrade.leverage)*parseFloat(openTrade.positionSize));
				const newCollateralDai = (collateralDai + parseFloat(openTrade.positionSize));
				const maxInterestDai = parseFloat(openInterests[openTrade.pairIndex].max);
				const maxCollateralDai = parseFloat(collaterals[openTrade.pairIndex].max);
				const minPrice = parseFloat(openTrade.minPrice)/1e10;
				const maxPrice = parseFloat(openTrade.maxPrice)/1e10;

				if(newInterestDai <= maxInterestDai && newCollateralDai <= maxCollateralDai){
					if(openTrade.type.toString() === "0" && priceIncludingSpread >= minPrice && priceIncludingSpread <= maxPrice
					|| openTrade.type.toString() === "1" && (buy ? priceIncludingSpread <= maxPrice : priceIncludingSpread >= minPrice)
					|| openTrade.type.toString() === "2" && (buy ? priceIncludingSpread >= minPrice : priceIncludingSpread <= maxPrice)){
						orderType = 3;
					}
				}
			}

			if(orderType > -1) {
				const triggeredOrderTrackingInfo = {
					trade: openTrade, 
					type: orderType
				};

				const triggeredOrderTrackingInfoIdentifier = buildTriggeredOrderTrackingInfoIdentifier(triggeredOrderTrackingInfo);

				if(triggeredOrders.has(triggeredOrderTrackingInfoIdentifier)) {
					console.log("Order has already been triggered; skipping.");

					continue;
				}

				const availableNft = await selectNft();

				// If there are no more NFTs available, we can stop trying to trigger any other trades
				if(availableNft === null) { 
					console.log("No NFTS available; unable to trigger any other trades at this time!");

					return; 
				}

				//console.log("Trying to trigger " + triggeredOrderTrackingInfo.name + " order with nft: " + triggeredOrderTrackingInfo.id + ")");

				const tx = {
					from: process.env.PUBLIC_KEY,
					to: tradingContract.options.address,
					data : tradingContract.methods.executeNftOrder(orderType, openTrade.trader, openTrade.pairIndex, openTrade.index, availableNft.id, availableNft.type).encodeABI(),
					maxPriorityFeePerGas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex(maxPriorityFeePerGas*1e9),
					maxFeePerGas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex(MAX_GAS_PRICE_GWEI*1e9),
					gas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex("2000000")
				};

				const signedTransaction = await web3Clients[currentlySelectedWeb3ClientIndex].eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
				let triggeredOrderCleanupTimerId;

				try
				{
					// Track that these are being actively used in processing of this order
					nftsBeingUsed.add(availableNft.id);
					
					await web3Clients[currentlySelectedWeb3ClientIndex].eth.sendSignedTransaction(signedTransaction.rawTransaction)
					
					console.log("Triggered (order type: " + triggeredOrderTrackingInfo.name + ", nft id: " + availableNft.id + ")");

					triggeredOrderCleanupTimerId = setTimeout(() => {
						if(triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier)) {
							console.log(`Never heard back from the blockchain about triggered order ${triggeredOrderTrackingInfoIdentifier}; removed from tracking.`);
						}
					}, FAILED_ORDER_TRIGGER_TIMEOUT_MS * 10);
				} catch(error) {
					console.log("An unexpected error occurred trying to trigger an order (order type: " + triggeredOrderTrackingInfo.name + ", nft id: " + availableNft.id + ")", error);

					triggeredOrderCleanupTimerId = setTimeout(() => {
						if(!triggeredOrders.delete(triggeredOrderTrackingInfoIdentifier)) {
							console.log(`Tried to clean up triggered order ${triggeredOrderTrackingInfoIdentifier} which previous failed, but it was already removed?`);
						}

					}, FAILED_ORDER_TRIGGER_TIMEOUT_MS);
				} finally {
					// Always clean up tracking state around active processing of this order
					nftsBeingUsed.delete(availableNft.id);
					triggeredOrders.set(triggeredOrderTrackingInfoIdentifier, triggeredOrderCleanupTimerId);
				}
			}
		}		
	}
}

wss();

// ------------------------------------------
// 12. REFILL VAULT IF CAN BE REFILLED
// ------------------------------------------

if(process.env.VAULT_REFILL_ENABLED){
	async function refill(){
		vaultContract.methods.refill().estimateGas({from: process.env.PUBLIC_KEY}, (error, result) => {
			if(!error){
				const tx = {
					from: process.env.PUBLIC_KEY,
					to : vaultContract.options.address,
					data : vaultContract.methods.refill().encodeABI(),
					maxPriorityFeePerGas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex(maxPriorityFeePerGas*1e9),
					maxFeePerGas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex(MAX_GAS_PRICE_GWEI*1e9),
					gas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex("1000000")
				};

				web3Clients[currentlySelectedWeb3ClientIndex].eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY).then(signed => {
					web3Clients[currentlySelectedWeb3ClientIndex].eth.sendSignedTransaction(signed.rawTransaction)
					.on('receipt', () => {
						console.log("Vault successfully refilled.");
					}).on('error', (e) => {
						console.log("Vault refill tx fail", e);
					});
				}).catch(e => {
					console.log("Vault refill tx fail", e);
				});
			}
		});
	}

	async function deplete(){
		vaultContract.methods.deplete().estimateGas({from: process.env.PUBLIC_KEY}, (error, result) => {
			if(!error){
				const tx = {
					from: process.env.PUBLIC_KEY,
					to : vaultContract.options.address,
					data : vaultContract.methods.deplete().encodeABI(),
					maxPriorityFeePerGas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex(maxPriorityFeePerGas*1e9),
					maxFeePerGas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex(MAX_GAS_PRICE_GWEI*1e9),
					gas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex("1000000")
				};

				web3Clients[currentlySelectedWeb3ClientIndex].eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY).then(signed => {
					web3Clients[currentlySelectedWeb3ClientIndex].eth.sendSignedTransaction(signed.rawTransaction)
					.on('receipt', () => {
						console.log("Vault successfully depleted.");
					}).on('error', (e) => {
						console.log("Vault deplete tx fail", e);
					});
				}).catch(e => {
					console.log("Vault deplete tx fail", e);
				});
			}
		});
	}

	setInterval(() => {
		refill();
		deplete();
	}, CHECK_REFILL_SEC*1000);
}

// ------------------------------------------
// 13. AUTO HARVEST REWARDS
// ------------------------------------------

if(AUTO_HARVEST_SEC > 0){
	async function claimTokens(){
		const tx = {
			from: process.env.PUBLIC_KEY,
			to : nftRewardsContract.options.address,
			data : nftRewardsContract.methods.claimTokens().encodeABI(),
			maxPriorityFeePerGas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex(maxPriorityFeePerGas*1e9),
			maxFeePerGas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex(MAX_GAS_PRICE_GWEI*1e9),
			gas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex("1000000")
		};

		const signed = await web3Clients[currentlySelectedWeb3ClientIndex].eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);

		try {
			await web3Clients[currentlySelectedWeb3ClientIndex].eth.sendSignedTransaction(signed.rawTransaction);
			
			console.log("Tokens claimed.");
		} catch (error) {
			console.log("claimTokens tx fail: " + error.message, error);
		};
	}

	async function claimPoolTokens(){
		let currentRound = await nftRewardsContract.methods.currentRound().call();
		currentRound = parseFloat(currentRound.toString());

		if(currentRound === 0) {
			console.log("Current round is 0, skipping claimPoolTokens for now.");

			return;
		}

		const fromRound = currentRound < 101 ? 0 : currentRound-101;
		const toRound =  currentRound - 1;

		const tx = {
			from: process.env.PUBLIC_KEY,
			to : nftRewardsContract.options.address,
			data : nftRewardsContract.methods.claimPoolTokens(fromRound, toRound).encodeABI(),
			maxPriorityFeePerGas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex(maxPriorityFeePerGas*1e9),
			maxFeePerGas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex(MAX_GAS_PRICE_GWEI*1e9),
			gas: web3Clients[currentlySelectedWeb3ClientIndex].utils.toHex("3000000")
		};

		const signed = await web3Clients[currentlySelectedWeb3ClientIndex].eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
			
		try {	
			await web3Clients[currentlySelectedWeb3ClientIndex].eth.sendSignedTransaction(signed.rawTransaction)
			
			console.log("Pool Tokens claimed.");
		} catch (error) {
			console.log("claimPoolTokens tx fail: " + error.message, error);
		}
	}

	setInterval(async () => {
		console.log("Harvesting rewards...");
		
		try
		{
			await Promise.all(
				[
					claimTokens(),
					claimPoolTokens()
				]);
		} catch (error) {
			console.log("Harvesting rewards failed unexpectedly: " + error.message, error);
		}
	}, AUTO_HARVEST_SEC*1000);
}