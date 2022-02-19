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

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const Web3 = require("web3");
const WebSocket = require('ws');
const fetch = require('node-fetch');
const forex = require('./forex.js');
const abis = require('./abis');

// -----------------------------------------
// 2. GLOBAL VARIABLES
// -----------------------------------------

let allowedLink = false, selectedProvider = null, eventSubTrading = null, eventSubCallbacks = null, nonce = null,
	providers = [], web3 = [], blocks = [], maxPriorityFeePerGas = 50,
	openTrades = [], spreadsP = [], openInterests = [], collaterals = [], nfts = [], nftsBeingUsed = [], ordersTriggered = [],
	storageContract, tradingContract, tradingAddress, callbacksContract, vaultContract, pairsStorageContract, nftRewardsContract,
	nftTimelock, maxTradesPerPair = 0,
	nftContract1, nftContract2, nftContract3, nftContract4, nftContract5, linkContract;

// --------------------------------------------
// 3. INIT: CHECK ENV VARS & LINK ALLOWANCE
// --------------------------------------------

console.log("Welcome to the gTrade NFT bot!");
if(!process.env.WSS_URLS || !process.env.PRICES_URL || !process.env.STORAGE_ADDRESS
|| !process.env.PRIVATE_KEY || !process.env.PUBLIC_KEY || !process.env.EVENT_CONFIRMATIONS_SEC 
|| !process.env.TRIGGER_TIMEOUT || !process.env.MAX_GAS_PRICE_GWEI || !process.env.CHECK_REFILL_SEC 
|| !process.env.VAULT_REFILL_ENABLED || !process.env.AUTO_HARVEST_SEC || !process.env.MIN_PRIORITY_GWEI
|| !process.env.PRIORITY_GWEI_MULTIPLIER || !process.env.PAIR_INFOS_ADDRESS){
	console.log("Please fill all parameters in the .env file.");
	process.exit();
}

// Parse non-string configuration constants from environment variables up front
const MAX_GAS_PRICE_GWEI = parseInt(process.env.MAX_GAS_PRICE_GWEI, 10),
	  CHECK_REFILL_SEC = parseInt(process.env.CHECK_REFILL_SEC, 10),
	  EVENT_CONFIRMATIONS_SEC = parseInt(process.env.EVENT_CONFIRMATIONS_SEC, 10),
	  TRIGGER_TIMEOUT = parseInt(process.env.TRIGGER_TIMEOUT, 10),
	  AUTO_HARVEST_SEC = parseInt(process.env.AUTO_HARVEST_SEC, 10);

async function checkLinkAllowance(){
	web3[selectedProvider].eth.net.isListening().then(async () => {
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
				maxPriorityFeePerGas: web3[selectedProvider].utils.toHex(maxPriorityFeePerGas*1e9),
				maxFeePerGas: web3[selectedProvider].utils.toHex(MAX_GAS_PRICE_GWEI*1e9),
				gas: web3[selectedProvider].utils.toHex("100000")
			};

			web3[selectedProvider].eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY).then(signed => {
				web3[selectedProvider].eth.sendSignedTransaction(signed.rawTransaction)
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
	}).catch(() => {
		setTimeout(() => { checkLinkAllowance(); }, 5*1000);
	});
}

// -----------------------------------------
// 4. WEB3 PROVIDER
// -----------------------------------------

const WSS_URLS = process.env.WSS_URLS.split(",");
blocks = new Array(WSS_URLS.length).fill(0);

async function selectProvider(newProvider){
	console.log("Selecting new provider...");
	
	const executionStartTime = Date.now();

	// Unsubscribe from existing events first
	if(eventSubTrading !== null && eventSubTrading.id !== null){ eventSubTrading.unsubscribe(); }
	if(eventSubCallbacks !== null && eventSubCallbacks.id !== null){ eventSubCallbacks.unsubscribe(); }
	eventSubTrading = null;
	eventSubCallbacks = null;
	
	storageContract = new web3[newProvider].eth.Contract(abis.STORAGE, process.env.STORAGE_ADDRESS);

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

	const aggregatorContract = new web3[newProvider].eth.Contract(abis.AGGREGATOR, aggregatorAddress);
	
	// Retrieve all necessary details from the aggregator contract
	const [
		pairsStorageAddress,
		nftRewardsAddress
	 ] = await Promise.all([
		aggregatorContract.methods.pairsStorage().call(),
		aggregatorContract.methods.nftRewards().call()
	 ]);
	
	pairsStorageContract = new web3[newProvider].eth.Contract(abis.PAIRS_STORAGE, pairsStorageAddress);
	nftRewardsContract = new web3[newProvider].eth.Contract(abis.NFT_REWARDS, nftRewardsAddress);

	callbacksContract = new web3[newProvider].eth.Contract(abis.CALLBACKS, callbacksAddress);
	tradingContract = new web3[newProvider].eth.Contract(abis.TRADING, tradingAddress);
	vaultContract = new web3[newProvider].eth.Contract(abis.VAULT, vaultAddress);

	nftContract1 = new web3[newProvider].eth.Contract(abis.NFT, nftAddress1);
	nftContract2 = new web3[newProvider].eth.Contract(abis.NFT, nftAddress2);
	nftContract3 = new web3[newProvider].eth.Contract(abis.NFT, nftAddress3);
	nftContract4 = new web3[newProvider].eth.Contract(abis.NFT, nftAddress4);
	nftContract5 = new web3[newProvider].eth.Contract(abis.NFT, nftAddress5);

	linkContract = new web3[newProvider].eth.Contract(abis.LINK, linkAddress);

	// Update the globally selected provider with this new provider
	selectedProvider = newProvider;
	
	// Subscribe to events using the new provider
	watchLiveTradingEvents();
	
	// Fire and forget refreshing of data using new provider
	fetchTradingVariables();
	fetchOpenTrades();
	
	console.log("New provider selection completed. Took: " + (Date.now() - executionStartTime) + "ms");
}

const getProvider = (wssId) => {
	const provider = new Web3.providers.WebsocketProvider(WSS_URLS[wssId], {clientConfig:{keepalive:true,keepaliveInterval:30*1000}});

	provider.on('close', () => {
		setTimeout(() => {
			if(!provider.connected){
				console.log(WSS_URLS[wssId]+' closed: trying to reconnect...');

				let connectedProvider = -1;
				for(var i = 0; i < WSS_URLS.length; i++){
					if(providers[i].connected){
						connectedProvider = i;
						break;
					}
				}
				if(connectedProvider > -1 && selectedProvider === wssId){
					selectProvider(connectedProvider);
					console.log("Switched to WSS " + WSS_URLS[selectedProvider]);
				}else if(connectedProvider === -1 && selectedProvider === wssId){
					console.log("No WSS to switch to...");
				}

				providers[wssId] = getProvider(wssId);
				web3[wssId] = new Web3(providers[wssId]);
			}
		}, 1*1000);
	});

	provider.on('connect', () => {
		setTimeout(() => {
			if(provider.connected){
				console.log('Connected to WSS '+WSS_URLS[wssId]+'.');

				let connectedProvider = -1;
				for(var i = 0; i < WSS_URLS.length; i++){
					if(providers[i].connected && i !== wssId){
						connectedProvider = i;
						break;
					}
				}
				if(connectedProvider === -1 || selectedProvider === null){
					selectProvider(wssId);
					console.log("Switched to WSS " + WSS_URLS[selectedProvider]);
					checkLinkAllowance();
				}else{
					console.log("No need to switch WSS, already connected to " + WSS_URLS[selectedProvider]);
				}
			}
		}, 1*1000);
	});
	provider.on('error', () => { console.log("WSS "+WSS_URLS[wssId]+" error"); provider.disconnect(); });
	return provider;
};

for(var i = 0; i < WSS_URLS.length; i++){
	const provider = getProvider(i);
	providers.push(provider);
	web3.push(new Web3(provider));
}

function checkWssAlive(){
	let promises = [];
	for(let i = 0; i < WSS_URLS.length; i++){
		(function(index) {
			web3[index].eth.getBlockNumber().then((b) => {
				blocks[index] = b;
			}).catch(() => {
				blocks[index] = 0;
			});
		})(i);
	}

	setTimeout(() => {
		console.log("Blocks: ", blocks);
		for(var i = 0; i < WSS_URLS.length; i++){
			if(blocks[i] >= blocks[selectedProvider] + 5){
				console.log("Switched to WSS "+WSS_URLS[i]+" #"+i+" (" + blocks[i] + " vs " + blocks[selectedProvider]+")");
				selectProvider(i);
				break;
			}
		}
	}, 3*1000);
}

checkWssAlive();
setInterval(async () => {
	checkWssAlive();
}, 10*1000);

setInterval(() => {
	console.log("Current WSS: " + web3[selectedProvider].currentProvider.url + " (#"+selectedProvider+")");
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
		await web3[selectedProvider].eth.net.isListening();
		
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

		nfts = await Promise.all(
			[
				{ nftContract: nftContract1, nftType: 1, count: nftsCount1 }, 
				{ nftContract: nftContract2, nftType: 2, count: nftsCount2 },
				{ nftContract: nftContract3, nftType: 3, count: nftsCount3 },
				{ nftContract: nftContract4, nftType: 4, count: nftsCount4 },
				{ nftContract: nftContract5, nftType: 5, count: nftsCount5 }
			].map(async nft =>
				{
					for(let i = 0; i < nft.count; i++) {
						const nftId = await nft.nftContract.methods.tokenOfOwnerByIndex(process.env.PUBLIC_KEY, i).call();
						
						return { id: nftId, type: nft.nftType };
					}
				}));

		nftTimelock = nftSuccessTimelock;
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

setInterval(() => {
	fetchTradingVariables();
	fetchOpenTrades();
}, 60*5*1000);

// -----------------------------------------
// 7. SELECT NFT TO EXECUTE ORDERS
// -----------------------------------------

async function selectNft(){
	console.log("Selecting NFT...");

	if(nftTimelock === undefined) {
		console.log("NFT Timelock not loaded yet.");
	} 
	
	if(nfts.length === 0) { 
		console.log("No NFTs loaded yet.");

		return null; 
	}

	console.log("NFTs: total loaded=" + nfts.length + ";currently in use=" + nftsBeingUsed.length + ";");

	try
	{
		await web3[selectedProvider].eth.net.isListening();

		const currentBlock = parseFloat(await web3[selectedProvider].eth.getBlockNumber());

		// Load the last successful block for each NFT that we know is not actively being used
		const nftsWithLastSuccesses = await Promise.all(
				nfts
					.filter(nft => !nftsBeingUsed.includes(nft.id))
					.map(async nft => ({ 
						nft,
						lastSuccess: parseFloat(await storageContract.methods.nftLastSuccess(nfts[i].id).call())
					})));

		// Try to find the first NFT whose last successful block is older than the current block by the required timelock amount
		const firstEligibleNft = nftsWithLastSuccesses.find(nftwls => currentBlock - nftwls.lastSuccess > nftTimelock);

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

async function fetchOpenTrades(){
	console.log("Fetching open trades...");
	
	try {
		await web3[selectedProvider].eth.net.isListening();

		if(spreadsP.length === 0){
			console.log("Spreads are not yet loaded; will retry loading open trades shortly!");
			
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
		
		openTrades = openLimitOrders.concat(pairTraders);

		console.log("Fetched " + openTrades.length + " total open trade(s).");

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
	web3[selectedProvider].eth.net.isListening().then(async () => {
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

		if(eventSubPairInfos === null){
			eventSubPairInfos = pairInfosContract.events.allEvents({ fromBlock: 'latest' }).on('data', function (event){
				const eventName = event.event.toString();

				if(eventName !== "AccFundingFeesStored"){
					return;
				}

				setTimeout(() => {
					refreshPairFundingFees(event);
				}, process.env.EVENT_CONFIRMATIONS_SEC*1000);
			});
		}
	}).catch(() => {
		setTimeout(() => { watchLiveTradingEvents(); }, 2*1000);
	});
}

// -----------------------------------------
// 10. REFRESH INTERNAL OPEN TRADES LIST
// -----------------------------------------

async function refreshOpenTrades(event){
	web3[selectedProvider].eth.net.isListening().then(async () => {
		const eventName = event.event.toString();
		const v = event.returnValues;
		let failed = false;

		// UNREGISTER OPEN LIMIT ORDER
		// => IF OPEN LIMIT CANCELED OR OPEN LIMIT EXECUTED
		if(eventName === "OpenLimitCanceled" 
		|| (eventName === "LimitExecuted" && v.orderType.toString() === "3")){

			const trader = eventName === "OpenLimitCanceled" ? v.trader : v.t[0];
			const pairIndex = eventName === "OpenLimitCanceled" ? v.pairIndex : v.t[1];
			const index = eventName === "OpenLimitCanceled" ? v.index : v.limitIndex;

			const hasLimitOrder = await storageContract.methods.hasOpenLimitOrder(trader, pairIndex, index).call();

			if(hasLimitOrder.toString() === "false"){

				for(var i = 0; i < openTrades.length; i++){

					if(openTrades[i].trader === trader 
					&& openTrades[i].pairIndex === pairIndex
					&& openTrades[i].index === index){

						openTrades[i] = openTrades[openTrades.length-1];
						openTrades.pop();

						console.log("Watch events ("+eventName+"): Removed limit");
						break;
					}
				}
			}else{
				failed = true;
			}
		}

		// STORE/UPDATE OPEN LIMIT ORDER
		// => IF OPEN LIMIT ORDER PLACED OR OPEN LIMIT ORDER UPDATED
		if(eventName === "OpenLimitPlaced" 
		|| eventName === "OpenLimitUpdated"){

			const hasLimitOrder = await storageContract.methods.hasOpenLimitOrder(v.trader, v.pairIndex, v.index).call();

			if(hasLimitOrder.toString() === "true"){

				const id = await storageContract.methods.openLimitOrderIds(v.trader, v.pairIndex, v.index).call();
				const limit = await storageContract.methods.openLimitOrders(id).call();
				let found = false;

				const type = await nftRewardsContract.methods.openLimitOrderTypes(v.trader, v.pairIndex, v.index).call();
				limit.type = type;

				for(var i = 0; i < openTrades.length; i++){

					if(openTrades[i].trader === v.trader 
					&& openTrades[i].pairIndex === v.pairIndex
					&& openTrades[i].index === v.index){

						openTrades[i] = limit;
						found = true;

						console.log("Watch events ("+eventName+"): Updated limit");
						break;
					}
				}

				if(!found){ 
					openTrades.push(limit); 
					console.log("Watch events ("+eventName+"): Stored limit");
				}
			}else{
				failed = true;
			}
		}

		// STORE/UPDATE TRADE
		// => IF MARKET OPEN EXECUTED OR OPEN TRADE LIMIT EXECUTED OR TP/SL UPDATED OR TRADE UPDATED (MARKET CLOSED)
		if((eventName === "MarketExecuted" && v.open.toString() === "true") 
		|| (eventName === "LimitExecuted" && v.orderType.toString() === "3")
		|| eventName === "TpUpdated" || eventName === "SlUpdated" || eventName === "SlCanceled"
		|| eventName === "MarketCloseCanceled"){

			const trader = eventName !== "MarketExecuted" && eventName !== "LimitExecuted" ? v.trader : v.t[0];
			const pairIndex = eventName !== "MarketExecuted" && eventName !== "LimitExecuted" ? v.pairIndex : v.t[1];
			const index = eventName !== "MarketExecuted" && eventName !== "LimitExecuted" ? v.index : v.t[2];

			const [trade, tradeInfo, initialAccFees] = await Promise.all([
				storageContract.methods.openTrades(trader, pairIndex, index).call(),
				storageContract.methods.openTradesInfo(trader, pairIndex, index).call(),
				pairInfosContract.methods.tradeInitialAccFees(trader, pairIndex, index).call()
			]);
			
			if(parseFloat(trade.leverage) > 0){
				let found = false;

				for(var i = 0; i < openTrades.length; i++){

					if(openTrades[i] !== undefined
					&& openTrades[i].trade !== undefined 
					&& openTrades[i].trade.trader === trader 
					&& openTrades[i].trade.pairIndex === pairIndex
					&& openTrades[i].trade.index === index){

						openTrades[i].trade = trade;
						found = true;

						console.log("Watch events ("+eventName+"): Updated trade");
						break;
					}
				}

				if(!found){ 
					openTrades.push({trade, tradeInfo, initialAccFees: {
						rollover: initialAccFees.rollover / 1e18,
						funding: initialAccFees.funding / 1e18,
						openedAfterUpdate: initialAccFees.openedAfterUpdate.toString() === "true",
					}});

					console.log("Watch events ("+eventName+"): Stored trade");
				}
			}else{
				failed = true;
			}
		}

		// UNREGISTER TRADE
		// => IF MARKET CLOSE EXECUTED OR CLOSE LIMIT EXECUTED
		if((eventName === "MarketExecuted" && v.open.toString() === "false") 
		|| (eventName === "LimitExecuted" && v.orderType !== "3")){

			const trade = await storageContract.methods.openTrades(v.t[0], v.t[1], v.t[2]).call();

			if(parseFloat(trade.leverage) === 0){
				for(var i = 0; i < openTrades.length; i++){

					if(openTrades[i] !== undefined
					&& openTrades[i].trade !== undefined
					&& openTrades[i].trade.trader === v.t[0] 
					&& openTrades[i].trade.pairIndex === v.t[1]
					&& openTrades[i].trade.index === v.t[2]){

						openTrades[i] = openTrades[openTrades.length-1];
						openTrades.pop();

						console.log("Watch events ("+eventName+"): Removed trade");
						break;
					}
				}
			}else{
				failed = true;
			}
		}
		if(failed){

			if(event.triedTimes == 10){ return; }
			event.triedTimes ++;

			setTimeout(() => {
				refreshOpenTrades(event);
			}, EVENT_CONFIRMATIONS_SEC*1000);

			console.log("Watch events ("+eventName+"): Trade not found on the blockchain, trying again in "+(EVENT_CONFIRMATIONS_SEC/2)+" seconds.");
		}
	}).catch((e) => { console.log("Problem when refreshing trades", e); });
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
	for(var i = 0; i < ordersTriggered.length; i++){
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

// Calculate liquidation price
function getRolloverFee (
  posDai,
  pairIndex,
  initialAccRolloverFees,
  openedAfterUpdate
){
	if(!openedAfterUpdate || !blocks[selectedProvider]) return 0;

	const { accPerCollateral, lastUpdateBlock } = pairRolloverFees[pairIndex];
	const { rolloverFeePerBlockP } = pairParams[pairIndex];

	const pendingAccRolloverFees = accPerCollateral + (blocks[selectedProvider] - lastUpdateBlock) * rolloverFeePerBlockP;

	return posDai * (pendingAccRolloverFees - initialAccRolloverFees);
};
function getFundingFee(
  leveragedPosDai,
  pairIndex,
  initialAccFundingFees,
  buy,
  openedAfterUpdate
){
	if(!openedAfterUpdate || !blocks[selectedProvider]) return 0;

	const { accPerOiLong, accPerOiShort, lastUpdateBlock } = pairFundingFees[pairIndex];
	const { fundingFeePerBlockP } = pairParams[pairIndex];

	const { long: longOi, short: shortOi } = openInterests[pairIndex];
	const fundingFeesPaidByLongs = (longOi - shortOi) * fundingFeePerBlockP * (blocks[selectedProvider] - lastUpdateBlock);

	const pendingAccFundingFees = buy
	? accPerOiLong + fundingFeesPaidByLongs / longOi
	: accPerOiShort + (fundingFeesPaidByLongs * -1) / shortOi;

	return leveragedPosDai * (pendingAccFundingFees - initialAccFundingFees);
};
function getTradeLiquidationPrice(t){
	const {trade, tradeInfo, initialAccFees} = t;
	const posDai = trade.initialPosToken / 1e18 * tradeInfo.tokenPriceDai / 1e10;

	const openPrice = parseFloat(trade.openPrice) / 1e10;
	const buy = trade.buy.toString() === "true";

	const liqPriceDistance =
		(openPrice *
			(posDai * 0.9 -
				getRolloverFee(
					posDai,
					trade.pairIndex,
					initialAccFees.rollover,
					initialAccFees.openedAfterUpdate
				) -
				getFundingFee(
					posDai * trade.leverage,
					trade.pairIndex,
					initialAccFees.funding,
					trade.buy,
					initialAccFees.openedAfterUpdate
				))) /
		posDai /
		trade.leverage;

 	return trade.buy ? openPrice - liqPriceDistance : openPrice + liqPriceDistance;
}

function wss(){
	let socket = new WebSocket(process.env.PRICES_URL);
	socket.onclose = () => { setTimeout(() => { wss() }, 2000); };
	socket.onerror = () => { socket.close(); };
	socket.onmessage = async (msg) => {
		const p = JSON.parse(msg.data);
		if(p.closes === undefined) return;
		
		if(spreadsP.length > 0 && allowedLink){
			const isForexMarketClosed = forex.isForexCurrentlyOpen() === false;

			for(var i = 0; i < openTrades.length; i++){
				const t = openTrades[i].trade !== undefined ? openTrades[i].trade : openTrades[i];

				if(isForexMarketClosed && t.pairIndex >= 21 && t.pairIndex <= 30) continue;

				const price = p.closes[t.pairIndex];
				if(!(price > 0)) continue;

				let orderType = -1;

				if(openTrades[i].trade !== undefined){
					const buy = t.buy.toString() === "true";

					const tp = parseFloat(t.tp)/1e10;
					const sl = parseFloat(t.sl)/1e10;
					const lev = parseFloat(t.leverage);
					const liqPrice = getTradeLiquidationPrice(openTrades[i]);

					if(tp.toString() !== "0" && ((buy && price >= tp) || (!buy && price <= tp))){
						orderType = 0;
					}else if(sl.toString() !== "0" && ((buy && price <= sl) || (!buy && price >= sl))){
						orderType = 1;
					}else if((buy && price <= liqPrice) || (!buy && price >= liqPrice)){
						orderType = 2;
					}

				}else{
					const buy = t.buy.toString() === "true";
					const posDai = parseFloat(t.leverage) * parseFloat(t.positionSize);

					const baseSpreadP = spreadsP[t.pairIndex]/1e10*(100-t.spreadReductionP)/100;
					
					const onePercentDepth = buy ? pairParams[t.pairIndex].onePercentDepthAbove : pairParams[t.pairIndex].onePercentDepthBelow;
					const interestDai = buy ? parseFloat(openInterests[t.pairIndex].long) : parseFloat(openInterests[t.pairIndex].short);
   					
   					const priceImpactP = (interestDai / 1e18 + (posDai / 1e18) / 2) / onePercentDepth;
   					const spreadP = onePercentDepth > 0 ? baseSpreadP + priceImpactP : baseSpreadP;
					const priceIncludingSpread = !buy ? price * (1 - spreadP / 100) : price * (1 + spreadP/100);

					const collateralDai = buy ? parseFloat(collaterals[t.pairIndex].long) : parseFloat(collaterals[t.pairIndex].short);
					
					const newInterestDai = (interestDai + posDai);
					const newCollateralDai = (collateralDai + parseFloat(t.positionSize));
					
					const maxInterestDai = parseFloat(openInterests[t.pairIndex].max);
					const maxCollateralDai = parseFloat(collaterals[t.pairIndex].max);
					
					const minPrice = parseFloat(t.minPrice)/1e10;
					const maxPrice = parseFloat(t.maxPrice)/1e10;

					if(newInterestDai <= maxInterestDai && newCollateralDai <= maxCollateralDai
					&& (onePercentDepth === 0 || priceImpactP * t.leverage <= maxNegativePnlOnOpenP)){
						if(t.type.toString() === "0" && priceIncludingSpread >= minPrice && priceIncludingSpread <= maxPrice
						|| t.type.toString() === "1" && (buy ? priceIncludingSpread <= maxPrice : priceIncludingSpread >= minPrice)
						|| t.type.toString() === "2" && (buy ? priceIncludingSpread >= minPrice : priceIncludingSpread <= maxPrice)){
							orderType = 3;
						}
					}
				}

				if(orderType > -1 && !alreadyTriggered(t, orderType)){
					const nft = await selectNft();

					if(nft === null){ 
						console.log("No NFT available to execute this order at this time.");

						return;
					}

					const orderInfo = {nftId: nft.id, trade: t, type: orderType,
						name: orderType === 0 ? "TP" : orderType === 1 ? "SL" : orderType === 2 ? "LIQ" : "OPEN"};

					//console.log("Try to trigger (order type: " + orderInfo.name + ", nft id: "+orderInfo.nftId+")");

					tradingContract.methods.executeNftOrder(orderType, t.trader, t.pairIndex, t.index, nft.id, nft.type)
					.estimateGas({from: process.env.PUBLIC_KEY}, (error, result) => {
						if(error){
							console.log("Tx error (order type: " + orderInfo.name + ", nft id: "+orderInfo.nftId+"), not triggering: ", error.message);
						}else{
							if(alreadyTriggered(t, orderType) || nftsBeingUsed.includes(nft.id)) return;

							nftsBeingUsed.push(nft.id);
							ordersTriggered.push({trade: t, orderType: orderType});

							const tx = {
								from: process.env.PUBLIC_KEY,
								to : tradingAddress,
								data : tradingContract.methods.executeNftOrder(orderType, t.trader, t.pairIndex, t.index, nft.id, nft.type).encodeABI(),
								maxPriorityFeePerGas: web3[selectedProvider].utils.toHex(maxPriorityFeePerGas*1e9),
								maxFeePerGas: web3[selectedProvider].utils.toHex(MAX_GAS_PRICE_GWEI*1e9),
								gas: web3[selectedProvider].utils.toHex("2000000")
							};

							web3[selectedProvider].eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY).then(signed => {
								web3[selectedProvider].eth.sendSignedTransaction(signed.rawTransaction)
								.on('receipt', () => {
									console.log("Triggered (order type: " + orderInfo.name + ", nft id: "+orderInfo.nftId+")");
									setTimeout(() => {
										ordersTriggered = ordersTriggered.filter(item => JSON.stringify(item) !== JSON.stringify({trade:orderInfo.trade, orderType: orderInfo.type}));
										nftsBeingUsed = nftsBeingUsed.filter(item => item !== orderInfo.nftId);
									}, TRIGGER_TIMEOUT*1000);
								}).on('error', (e) => {
									console.log("Failed to trigger (order type: " + orderInfo.name + ", nft id: "+orderInfo.nftId+")");
									//console.log("Tx error (" + e + ")");
									setTimeout(() => {
										ordersTriggered = ordersTriggered.filter(item => JSON.stringify(item) !== JSON.stringify({trade:orderInfo.trade, orderType: orderInfo.type}));
										nftsBeingUsed = nftsBeingUsed.filter(item => item !== orderInfo.nftId);
									}, TRIGGER_TIMEOUT*1000);
								});
							}).catch(e => {
								console.log("Failed to trigger (order type: " + orderInfo.name + ", nft id: "+orderInfo.nftId+")");
								//console.log("Tx error (" + e + ")");
								setTimeout(() => {
									ordersTriggered = ordersTriggered.filter(item => JSON.stringify(item) !== JSON.stringify({trade:orderInfo.trade, orderType: orderInfo.type}));
									nftsBeingUsed = nftsBeingUsed.filter(item => item !== orderInfo.nftId);
								}, TRIGGER_TIMEOUT*1000);
							});
						}
					});
				}
			}
		}
	};
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
					maxPriorityFeePerGas: web3[selectedProvider].utils.toHex(maxPriorityFeePerGas*1e9),
					maxFeePerGas: web3[selectedProvider].utils.toHex(MAX_GAS_PRICE_GWEI*1e9),
					gas: web3[selectedProvider].utils.toHex("1000000")
				};

				web3[selectedProvider].eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY).then(signed => {
					web3[selectedProvider].eth.sendSignedTransaction(signed.rawTransaction)
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
					maxPriorityFeePerGas: web3[selectedProvider].utils.toHex(maxPriorityFeePerGas*1e9),
					maxFeePerGas: web3[selectedProvider].utils.toHex(MAX_GAS_PRICE_GWEI*1e9),
					gas: web3[selectedProvider].utils.toHex("1000000")
				};

				web3[selectedProvider].eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY).then(signed => {
					web3[selectedProvider].eth.sendSignedTransaction(signed.rawTransaction)
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
			maxPriorityFeePerGas: web3[selectedProvider].utils.toHex(maxPriorityFeePerGas*1e9),
			maxFeePerGas: web3[selectedProvider].utils.toHex(MAX_GAS_PRICE_GWEI*1e9),
			gas: web3[selectedProvider].utils.toHex("1000000")
		};

		const signed = await web3[selectedProvider].eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);

		try {
			await web3[selectedProvider].eth.sendSignedTransaction(signed.rawTransaction);
			
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
			maxPriorityFeePerGas: web3[selectedProvider].utils.toHex(maxPriorityFeePerGas*1e9),
			maxFeePerGas: web3[selectedProvider].utils.toHex(MAX_GAS_PRICE_GWEI*1e9),
			gas: web3[selectedProvider].utils.toHex("3000000")
		};

		const signed = await web3[selectedProvider].eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
			
		try {	
			await web3[selectedProvider].eth.sendSignedTransaction(signed.rawTransaction)
			
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

// -------------------------------------------------
// 14. CREATE SERVER (USEFUL FOR CLOUD PLATFORMS)
// -------------------------------------------------

const port = process.env.PORT || 4002;
server.listen(port, () => console.log(`Listening on port ${port}`));