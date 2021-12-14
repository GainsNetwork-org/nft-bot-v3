// ------------------------------------
// 1. DEPENDENCIES
// ------------------------------------

require("dotenv").config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const Web3 = require("web3");
const WebSocket = require('ws');
const fetch = require('node-fetch');

// -----------------------------------------
// 2. GLOBAL VARIABLES
// -----------------------------------------

const STORAGE_ABI = [{"inputs":[{"internalType":"contractTokenInterfaceV5","name":"_dai","type":"address"},{"internalType":"contractTokenInterfaceV5","name":"_token","type":"address"},{"internalType":"contractTokenInterfaceV5","name":"_linkErc677","type":"address"},{"internalType":"contractNftInterfaceV5[5]","name":"_nfts","type":"address[5]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"AddressUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contractNftInterfaceV5[5]","name":"nfts","type":"address[5]"}],"name":"NftsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"NumberUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"NumberUpdatedPair","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256[5]","name":"","type":"uint256[5]"}],"name":"SpreadReductionsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"SupportedTokenAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"TradingContractAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"TradingContractRemoved","type":"event"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"PRECISION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"callbacks","outputs":[{"internalType":"contractPausableInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"dai","outputs":[{"internalType":"contractTokenInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"defaultLeverageUnlocked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"dev","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"devFeesDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"devFeesToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"gov","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"govFeesDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"govFeesToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isTradingContract","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"linkErc677","outputs":[{"internalType":"contractTokenInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxGainP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxPendingMarketOrders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxSlP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxTradesPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxTradesPerPair","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nftLastSuccess","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"nftRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"nftSuccessTimelock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nfts","outputs":[{"internalType":"contractNftInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"openInterestDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"openLimitOrderIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"openLimitOrders","outputs":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"positionSize","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"},{"internalType":"uint256","name":"minPrice","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"openLimitOrdersCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"openTrades","outputs":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"openTradesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"openTradesInfo","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"tokenPriceDai","type":"uint256"},{"internalType":"uint256","name":"openInterestDai","type":"uint256"},{"internalType":"uint256","name":"tpLastUpdated","type":"uint256"},{"internalType":"uint256","name":"slLastUpdated","type":"uint256"},{"internalType":"bool","name":"beingMarketClosed","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pairTraders","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pairTradersId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pendingMarketCloseCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pendingMarketOpenCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pendingOrderIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"pool","outputs":[{"internalType":"contractPoolInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"priceAggregator","outputs":[{"internalType":"contractAggregatorInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"reqID_pendingMarketOrder","outputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.Trade","name":"trade","type":"tuple"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"wantedPrice","type":"uint256"},{"internalType":"uint256","name":"slippageP","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"reqID_pendingNftOrder","outputs":[{"internalType":"address","name":"nftHolder","type":"address"},{"internalType":"uint256","name":"nftId","type":"uint256"},{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"enumGFarmTestnetTradingStorageV5.LimitOrder","name":"orderType","type":"uint8"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"spreadReductionsP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"supportedTokens","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"token","outputs":[{"internalType":"contractTokenInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"tokenDaiRouter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"tokensBurned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"tokensMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"traders","outputs":[{"internalType":"uint256","name":"leverageUnlocked","type":"uint256"},{"internalType":"address","name":"referral","type":"address"},{"internalType":"uint256","name":"referralRewardsTotal","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tradesPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"trading","outputs":[{"internalType":"contractPausableInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"vault","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_gov","type":"address"}],"name":"setGov","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_dev","type":"address"}],"name":"setDev","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contractTokenInterfaceV5","name":"_newToken","type":"address"}],"name":"updateToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contractNftInterfaceV5[5]","name":"_nfts","type":"address[5]"}],"name":"updateNfts","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trading","type":"address"}],"name":"addTradingContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trading","type":"address"}],"name":"removeTradingContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"addSupportedToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"setPriceAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_pool","type":"address"}],"name":"setPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_vault","type":"address"}],"name":"setVault","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trading","type":"address"}],"name":"setTrading","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_callbacks","type":"address"}],"name":"setCallbacks","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenDaiRouter","type":"address"}],"name":"setTokenDaiRouter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxTradesPerBlock","type":"uint256"}],"name":"setMaxTradesPerBlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxTradesPerPair","type":"uint256"}],"name":"setMaxTradesPerPair","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxPendingMarketOrders","type":"uint256"}],"name":"setMaxPendingMarketOrders","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_max","type":"uint256"}],"name":"setMaxGainP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_lev","type":"uint256"}],"name":"setDefaultLeverageUnlocked","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_max","type":"uint256"}],"name":"setMaxSlP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_blocks","type":"uint256"}],"name":"setNftSuccessTimelock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[5]","name":"_r","type":"uint256[5]"}],"name":"setSpreadReductionsP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_newMaxOpenInterest","type":"uint256"}],"name":"setMaxOpenInterestDai","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.Trade","name":"_trade","type":"tuple"},{"components":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"tokenPriceDai","type":"uint256"},{"internalType":"uint256","name":"openInterestDai","type":"uint256"},{"internalType":"uint256","name":"tpLastUpdated","type":"uint256"},{"internalType":"uint256","name":"slLastUpdated","type":"uint256"},{"internalType":"bool","name":"beingMarketClosed","type":"bool"}],"internalType":"structGFarmTestnetTradingStorageV5.TradeInfo","name":"_tradeInfo","type":"tuple"}],"name":"storeTrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"unregisterTrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.Trade","name":"trade","type":"tuple"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"wantedPrice","type":"uint256"},{"internalType":"uint256","name":"slippageP","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.PendingMarketOrder","name":"_order","type":"tuple"},{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"bool","name":"_open","type":"bool"}],"name":"storePendingMarketOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"bool","name":"_open","type":"bool"}],"name":"unregisterPendingMarketOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"positionSize","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"},{"internalType":"uint256","name":"minPrice","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.OpenLimitOrder","name":"o","type":"tuple"}],"name":"storeOpenLimitOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"positionSize","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"},{"internalType":"uint256","name":"minPrice","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.OpenLimitOrder","name":"_o","type":"tuple"}],"name":"updateOpenLimitOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"unregisterOpenLimitOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"nftHolder","type":"address"},{"internalType":"uint256","name":"nftId","type":"uint256"},{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"enumGFarmTestnetTradingStorageV5.LimitOrder","name":"orderType","type":"uint8"}],"internalType":"structGFarmTestnetTradingStorageV5.PendingNftOrder","name":"_nftOrder","type":"tuple"},{"internalType":"uint256","name":"_orderId","type":"uint256"}],"name":"storePendingNftOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_order","type":"uint256"}],"name":"unregisterPendingNftOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"uint256","name":"_newSl","type":"uint256"}],"name":"updateSl","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"uint256","name":"_newTp","type":"uint256"}],"name":"updateTp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.Trade","name":"_t","type":"tuple"}],"name":"updateTrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"address","name":"_referral","type":"address"}],"name":"storeReferral","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_referral","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"increaseReferralRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"distributeLpRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nftId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"increaseNftRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_newLeverage","type":"uint256"}],"name":"setLeverageUnlocked","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_leveragedPositionSize","type":"uint256"},{"internalType":"bool","name":"_dai","type":"bool"},{"internalType":"bool","name":"_fullFee","type":"bool"}],"name":"handleDevGovFees","outputs":[{"internalType":"uint256","name":"fee","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"bool","name":"_mint","type":"bool"}],"name":"handleTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferDai","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_leveragedPosDai","type":"uint256"}],"name":"transferLinkToAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"}],"name":"firstEmptyTradeIndex","outputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"}],"name":"firstEmptyOpenLimitIndex","outputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"hasOpenLimitOrder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_trader","type":"address"}],"name":"getReferral","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_trader","type":"address"}],"name":"getLeverageUnlocked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"pairTradersArray","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_trader","type":"address"}],"name":"getPendingOrderIds","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_trader","type":"address"}],"name":"pendingOrderIdsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getOpenLimitOrder","outputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"positionSize","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"},{"internalType":"uint256","name":"minPrice","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.OpenLimitOrder","name":"","type":"tuple"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getOpenLimitOrders","outputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"positionSize","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"},{"internalType":"uint256","name":"minPrice","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.OpenLimitOrder[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getSupportedTokens","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getSpreadReductionsArray","outputs":[{"internalType":"uint256[5]","name":"","type":"uint256[5]"}],"stateMutability":"view","type":"function","constant":true}];
const TRADING_ABI = [{"inputs":[{"internalType":"contractStorageInterfaceV5","name":"_storageT","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"AddressUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"orderId","type":"uint256"},{"components":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"internalType":"structStorageInterfaceV5.Trade","name":"trade","type":"tuple"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"wantedPrice","type":"uint256"},{"internalType":"uint256","name":"slippageP","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"indexed":false,"internalType":"structStorageInterfaceV5.PendingMarketOrder","name":"order","type":"tuple"}],"name":"ChainlinkCallbackTimeout","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"string","name":"message","type":"string"}],"name":"CouldNotCloseTrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"bool","name":"open","type":"bool"},{"indexed":false,"internalType":"uint256","name":"orderId","type":"uint256"}],"name":"MarketOrderInitiated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"nftHolder","type":"address"},{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"orderId","type":"uint256"}],"name":"NftOrderInitiated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"NumberUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"OpenLimitCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"OpenLimitPlaced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"OpenLimitUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"paused","type":"bool"}],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"SlUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"TpUpdated","type":"event"},{"inputs":[],"name":"isPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"limitOrdersTimelock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxPosDaiP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"minPosDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"orderTimeout","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"storageT","outputs":[{"internalType":"contractStorageInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"contractStorageInterfaceV5","name":"_storageT","type":"address"}],"name":"setStorageT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxP","type":"uint256"}],"name":"setMaxPosDaiP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_min","type":"uint256"}],"name":"setMinPosDai","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_blocks","type":"uint256"}],"name":"setLimitOrdersTimelock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_orderTimeout","type":"uint256"}],"name":"setOrderTimeout","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"internalType":"structStorageInterfaceV5.Trade","name":"t","type":"tuple"},{"internalType":"bool","name":"_limit","type":"bool"},{"internalType":"uint256","name":"_spreadReductionId","type":"uint256"},{"internalType":"uint256","name":"_slippageP","type":"uint256"},{"internalType":"address","name":"_referral","type":"address"}],"name":"openTrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_slippageP","type":"uint256"},{"internalType":"uint256","name":"_tp","type":"uint256"},{"internalType":"uint256","name":"_sl","type":"uint256"}],"name":"updateOpenLimitOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"cancelOpenLimitOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"uint256","name":"_newTp","type":"uint256"}],"name":"updateTp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"uint256","name":"_newSl","type":"uint256"}],"name":"updateSl","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"closeTradeMarket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"enumStorageInterfaceV5.LimitOrder","name":"_orderType","type":"uint8"},{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"uint256","name":"_nftId","type":"uint256"},{"internalType":"uint256","name":"_nftType","type":"uint256"}],"name":"executeNftOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_order","type":"uint256"}],"name":"openTradeMarketTimeout","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_order","type":"uint256"}],"name":"closeTradeMarketTimeout","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const CALLBACKS_ABI = [{"inputs":[{"internalType":"contractStorageInterfaceV5","name":"_storageT","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"AddressUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"orderId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"limitIndex","type":"uint256"},{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"indexed":false,"internalType":"structStorageInterfaceV5.Trade","name":"t","type":"tuple"},{"components":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"tokenPriceDai","type":"uint256"},{"internalType":"uint256","name":"openInterestDai","type":"uint256"},{"internalType":"uint256","name":"tpLastUpdated","type":"uint256"},{"internalType":"uint256","name":"slLastUpdated","type":"uint256"},{"internalType":"bool","name":"beingMarketClosed","type":"bool"}],"indexed":false,"internalType":"structStorageInterfaceV5.TradeInfo","name":"tInfo","type":"tuple"},{"indexed":true,"internalType":"address","name":"nftHolder","type":"address"},{"indexed":false,"internalType":"enumStorageInterfaceV5.LimitOrder","name":"orderType","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"indexed":false,"internalType":"int256","name":"percentProfit","type":"int256"},{"indexed":false,"internalType":"uint256","name":"tokenPriceDai","type":"uint256"}],"name":"LimitExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"orderId","type":"uint256"},{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"wantedPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"currentPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"slippageToleranceP","type":"uint256"}],"name":"MarketCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"orderId","type":"uint256"},{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"indexed":false,"internalType":"structStorageInterfaceV5.Trade","name":"t","type":"tuple"},{"indexed":false,"internalType":"bool","name":"open","type":"bool"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"indexed":false,"internalType":"int256","name":"percentProfit","type":"int256"},{"indexed":false,"internalType":"uint256","name":"tokenPriceDai","type":"uint256"}],"name":"MarketExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"NumberUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"paused","type":"bool"}],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"orderId","type":"uint256"},{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"TradeUpdatedMarketClosed","type":"event"},{"inputs":[],"name":"LIQ_THRESHOLD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"isPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"storageT","outputs":[{"internalType":"contractStorageInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"contractStorageInterfaceV5","name":"_storageT","type":"address"}],"name":"setStorageT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"order","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"spreadP","type":"uint256"}],"internalType":"structGFarmTestnetTradingCallbacksV5.AggregatorAnswer","name":"a","type":"tuple"}],"name":"openTradeMarketCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"order","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"spreadP","type":"uint256"}],"internalType":"structGFarmTestnetTradingCallbacksV5.AggregatorAnswer","name":"a","type":"tuple"}],"name":"closeTradeMarketCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"order","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"spreadP","type":"uint256"}],"internalType":"structGFarmTestnetTradingCallbacksV5.AggregatorAnswer","name":"a","type":"tuple"}],"name":"executeNftOpenOrderCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"order","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"spreadP","type":"uint256"}],"internalType":"structGFarmTestnetTradingCallbacksV5.AggregatorAnswer","name":"a","type":"tuple"}],"name":"executeNftCloseOrderCallback","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const AGGREGATOR_ABI = [{"inputs":[{"internalType":"contractStorageInterfaceV5","name":"_tradingStorage","type":"address"},{"internalType":"address","name":"_linkErc20","type":"address"},{"internalType":"contractLpInterfaceV5","name":"_linkErc20DaiLp","type":"address"},{"internalType":"contractLpInterfaceV5","name":"_tokenDaiLp","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"AddressUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"components":[{"internalType":"address","name":"feed1","type":"address"},{"internalType":"address","name":"feed2","type":"address"},{"internalType":"enumGFarmTestnetPriceAggregatorV5.FeedCalculation","name":"feedCalculation","type":"uint8"},{"internalType":"uint256","name":"maxDeviation","type":"uint256"}],"indexed":false,"internalType":"structGFarmTestnetPriceAggregatorV5.Feed","name":"feed","type":"tuple"}],"name":"FeedUpdatedPair","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"jobIndex","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"value","type":"bytes32"}],"name":"JobUpdatedPair","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"fromPairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"toPairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"jobIndex","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"value","type":"bytes32"}],"name":"JobUpdatedPairs","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"NodeAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"address","name":"old","type":"address"},{"indexed":false,"internalType":"address","name":"newA","type":"address"}],"name":"NodeReplaced","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"NumberUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"NumberUpdatedPair","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"from","type":"string"},{"indexed":false,"internalType":"string","name":"to","type":"string"}],"name":"PairAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"request","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"order","type":"uint256"},{"indexed":false,"internalType":"address","name":"node","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"referencePrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"linkFee","type":"uint256"}],"name":"PriceReceived","type":"event"},{"inputs":[],"name":"currentOrder","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"name":"isPairListed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"linkErc20","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"linkErc20DaiLp","outputs":[{"internalType":"contractLpInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"minAnswers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nodes","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"orderAnswers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"pairs","outputs":[{"internalType":"string","name":"from","type":"string"},{"internalType":"string","name":"to","type":"string"},{"internalType":"uint256","name":"spreadP","type":"uint256"},{"components":[{"internalType":"address","name":"feed1","type":"address"},{"internalType":"address","name":"feed2","type":"address"},{"internalType":"enumGFarmTestnetPriceAggregatorV5.FeedCalculation","name":"feedCalculation","type":"uint8"},{"internalType":"uint256","name":"maxDeviation","type":"uint256"}],"internalType":"structGFarmTestnetPriceAggregatorV5.Feed","name":"feed","type":"tuple"},{"internalType":"uint256","name":"minLeverage","type":"uint256"},{"internalType":"uint256","name":"maxLeverage","type":"uint256"},{"internalType":"uint256","name":"minOpenLimitSlippageP","type":"uint256"},{"internalType":"uint256","name":"openFeeP","type":"uint256"},{"internalType":"uint256","name":"closeFeeP","type":"uint256"},{"internalType":"uint256","name":"oracleFeeP","type":"uint256"},{"internalType":"uint256","name":"nftLimitOrderFeeP","type":"uint256"},{"internalType":"uint256","name":"referralP","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"pairsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"requests","outputs":[{"internalType":"uint256","name":"orderId","type":"uint256"},{"internalType":"enumGFarmTestnetPriceAggregatorV5.OrderType","name":"orderType","type":"uint8"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"bool","name":"initiated","type":"bool"},{"internalType":"uint256","name":"linkFee","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"tokenDaiLp","outputs":[{"internalType":"contractLpInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"tradingStorage","outputs":[{"internalType":"contractStorageInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"contractStorageInterfaceV5","name":"_tradingStorage","type":"address"}],"name":"setTradingStorage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contractLpInterfaceV5","name":"_lp","type":"address"}],"name":"updateTokenDaiLp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"}],"name":"addNode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"address","name":"_a","type":"address"}],"name":"replaceNode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_minAnswers","type":"uint256"}],"name":"setMinAnswers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"string","name":"from","type":"string"},{"internalType":"string","name":"to","type":"string"},{"internalType":"bytes32[20]","name":"jobs","type":"bytes32[20]"},{"internalType":"uint256","name":"spreadP","type":"uint256"},{"components":[{"internalType":"address","name":"feed1","type":"address"},{"internalType":"address","name":"feed2","type":"address"},{"internalType":"enumGFarmTestnetPriceAggregatorV5.FeedCalculation","name":"feedCalculation","type":"uint8"},{"internalType":"uint256","name":"maxDeviation","type":"uint256"}],"internalType":"structGFarmTestnetPriceAggregatorV5.Feed","name":"feed","type":"tuple"},{"internalType":"uint256","name":"minLeverage","type":"uint256"},{"internalType":"uint256","name":"maxLeverage","type":"uint256"},{"internalType":"uint256","name":"minOpenLimitSlippageP","type":"uint256"},{"internalType":"uint256","name":"openFeeP","type":"uint256"},{"internalType":"uint256","name":"closeFeeP","type":"uint256"},{"internalType":"uint256","name":"oracleFeeP","type":"uint256"},{"internalType":"uint256","name":"nftLimitOrderFeeP","type":"uint256"},{"internalType":"uint256","name":"referralP","type":"uint256"}],"internalType":"structGFarmTestnetPriceAggregatorV5.Pair","name":"_pair","type":"tuple"}],"name":"addPair","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_spreadP","type":"uint256"}],"name":"updateSpread","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_jobIndex","type":"uint256"},{"internalType":"bytes32","name":"_newJob","type":"bytes32"}],"name":"updateJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_fromPairIndex","type":"uint256"},{"internalType":"uint256","name":"_toPairIndex","type":"uint256"},{"internalType":"uint256","name":"_jobIndex","type":"uint256"},{"internalType":"bytes32","name":"_newJob","type":"bytes32"}],"name":"updateJobs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"components":[{"internalType":"address","name":"feed1","type":"address"},{"internalType":"address","name":"feed2","type":"address"},{"internalType":"enumGFarmTestnetPriceAggregatorV5.FeedCalculation","name":"feedCalculation","type":"uint8"},{"internalType":"uint256","name":"maxDeviation","type":"uint256"}],"internalType":"structGFarmTestnetPriceAggregatorV5.Feed","name":"_feed","type":"tuple"}],"name":"updateFeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_min","type":"uint256"},{"internalType":"uint256","name":"_max","type":"uint256"}],"name":"updateMinMaxLeverage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_min","type":"uint256"}],"name":"updateMinOpenLimitSlippageP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_openFeeP","type":"uint256"}],"name":"updateOpenFeeP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_closeFeeP","type":"uint256"}],"name":"updateCloseFeeP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_fee","type":"uint256"}],"name":"updateOracleFeeP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_fee","type":"uint256"}],"name":"updateReferralP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_fee","type":"uint256"}],"name":"updateNftLimitOrderFeeP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"enumGFarmTestnetPriceAggregatorV5.OrderType","name":"_orderType","type":"uint8"},{"internalType":"uint256","name":"_leveragedPosDai","type":"uint256"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_requestId","type":"bytes32"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"fulfill","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimBackLink","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_leveragedPosDai","type":"uint256"}],"name":"linkFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"linkPriceDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"tokenDaiReservesLp","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"tokenPriceDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"oracleNodesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"pairJobs","outputs":[{"internalType":"bytes32[20]","name":"","type":"bytes32[20]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"pairFeed","outputs":[{"components":[{"internalType":"address","name":"feed1","type":"address"},{"internalType":"address","name":"feed2","type":"address"},{"internalType":"enumGFarmTestnetPriceAggregatorV5.FeedCalculation","name":"feedCalculation","type":"uint8"},{"internalType":"uint256","name":"maxDeviation","type":"uint256"}],"internalType":"structGFarmTestnetPriceAggregatorV5.Feed","name":"","type":"tuple"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"openFeeP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"closeFeeP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"oracleFeeP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"referralP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"nftLimitOrderFeeP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"pairMinLeverage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"pairMaxLeverage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"pairMinOpenLimitSlippageP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true}];
const NFT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const LINK_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
const VAULT_ABI = [{"inputs":[{"internalType":"contractStorageInterfaceV5","name":"_storageT","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"AddressUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newCurrentBalanceDai","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"maxBalanceDai","type":"uint256"}],"name":"Claimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256","name":"daiAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newCurrentBalanceDai","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"maxBalanceDai","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensBurnt","type":"uint256"}],"name":"Depleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newCurrentBalanceDai","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newMaxBalanceDai","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"NumberUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"daiAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"vaultFeeDai","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newCurrentBalanceDai","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"maxBalanceDai","type":"uint256"}],"name":"ReceivedFromTrader","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256","name":"daiAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newCurrentBalanceDai","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"maxBalanceDai","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensMinted","type":"uint256"}],"name":"Refilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newCurrentBalanceDai","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"maxBalanceDai","type":"uint256"}],"name":"Sent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"currentBalanceDai","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"maxBalanceDai","type":"uint256"}],"name":"ToClaim","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newCurrentBalanceDai","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newMaxBalanceDai","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[],"name":"PRECISION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"accDaiPerDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"accMaticPerDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"blocksBaseDeplete","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"blocksBaseRefill","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"blocksMinDeplete","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"coeffDepleteP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"currentBalanceDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"daiToClaim","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"depleteLiqP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"lastActionBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maticEndBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maticLastRewardBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maticPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maticStartBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxBalanceDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxWithdrawP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"powerRefill","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"refillLiqP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"rewardDistributor","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"rewardsDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"rewardsMatic","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"storageT","outputs":[{"internalType":"contractStorageInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"swapFeeP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"thresholdDepleteP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"daiDeposited","type":"uint256"},{"internalType":"uint256","name":"maxDaiDeposited","type":"uint256"},{"internalType":"uint256","name":"withdrawBlock","type":"uint256"},{"internalType":"uint256","name":"debtDai","type":"uint256"},{"internalType":"uint256","name":"debtMatic","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"withdrawTimelock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_blocksBaseRefill","type":"uint256"}],"name":"setBlocksBaseRefill","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_blocksBaseDeplete","type":"uint256"}],"name":"setBlocksBaseDeplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_blocksMinDeplete","type":"uint256"}],"name":"setBlocksMinDeplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_refillLiqP","type":"uint256"}],"name":"setRefillLiqP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_depleteLiqP","type":"uint256"}],"name":"setDepleteLiqP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_powerRefill","type":"uint256"}],"name":"setPowerRefill","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_coeffDepleteP","type":"uint256"}],"name":"setCoeffDepleteP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_thresholdDepleteP","type":"uint256"}],"name":"setThresholdDepleteP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_swapFeeP","type":"uint256"}],"name":"setSwapFeeP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_withdrawTimelock","type":"uint256"}],"name":"setWithdrawTimelock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxWithdrawP","type":"uint256"}],"name":"setMaxWithdrawP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"refill","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_currentBalanceDai","type":"uint256"},{"internalType":"uint256","name":"_maxBalanceDai","type":"uint256"}],"name":"blocksBetweenRefills","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"deplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_currentBalanceDai","type":"uint256"},{"internalType":"uint256","name":"_maxBalanceDai","type":"uint256"}],"name":"blocksBetweenDepletes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"harvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"depositDai","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawDai","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_startBlock","type":"uint256"},{"internalType":"uint256","name":"_endBlock","type":"uint256"}],"name":"distributeRewardMatic","outputs":[],"stateMutability":"payable","type":"function","payable":true},{"inputs":[],"name":"pendingRewardMatic","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"pendingRewardDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"sendDaiToTrader","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimDai","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_vaultFee","type":"uint256"}],"name":"receiveDaiFromTrader","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trader","type":"address"}],"name":"backend","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"components":[{"internalType":"uint256","name":"leverageUnlocked","type":"uint256"},{"internalType":"address","name":"referral","type":"address"},{"internalType":"uint256","name":"referralRewardsTotal","type":"uint256"}],"internalType":"structStorageInterfaceV5.Trader","name":"","type":"tuple"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"components":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"internalType":"structStorageInterfaceV5.Trade","name":"trade","type":"tuple"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"wantedPrice","type":"uint256"},{"internalType":"uint256","name":"slippageP","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"structStorageInterfaceV5.PendingMarketOrder[]","name":"","type":"tuple[]"},{"internalType":"uint256[][5]","name":"","type":"uint256[][5]"}],"stateMutability":"view","type":"function","constant":true}];

let allowedLink = false, selectedProvider = null, eventSubTrading = null, eventSubCallbacks = null, nonce = null,
	providers = [], web3 = [], blocks = [], gasPriceGwei = process.env.MIN_GAS_PRICE_GWEI,
	openTrades = [], pairs = [], openInterests = [], nfts = [], nftsBeingUsed = [], ordersTriggered = [],
	storageContract, tradingContract, tradingAddress, aggregatorContract, callbacksContract, vaultContract,
	nftTimelock, maxTradesPerPair,
	nftContract1, nftContract2, nftContract3, nftContract4, nftContract5, linkContract;

// --------------------------------------------
// 3. INIT: CHECK ENV VARS & LINK ALLOWANCE
// --------------------------------------------

console.log("Welcome to the Gains.farm NFT bot!");
if(!process.env.WSS_URLS || !process.env.PRICES_URL || !process.env.STORAGE_ADDRESS
|| !process.env.PRIVATE_KEY || !process.env.PUBLIC_KEY || !process.env.EVENT_CONFIRMATIONS_SEC 
|| !process.env.TRIGGER_TIMEOUT || !process.env.MIN_GAS_PRICE_GWEI || !process.env.MAX_GAS_PRICE_GWEI 
|| !process.env.CHECK_REFILL_SEC || !process.env.VAULT_REFILL_ENABLED){
	console.log("Please fill all parameters in the .env file.");
	process.exit();
}

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
			    gasPrice: web3[selectedProvider].utils.toHex(gasPriceGwei*1e9),
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

async function selectProvider(n){
	selectedProvider = n;
	storageContract = new web3[n].eth.Contract(STORAGE_ABI, process.env.STORAGE_ADDRESS);

	const callbacksAddress = await storageContract.methods.callbacks().call();
	tradingAddress = await storageContract.methods.trading().call();
	const aggregatorAddress = await storageContract.methods.priceAggregator().call();
	const vaultAddress = await storageContract.methods.vault().call();
	const nftAddress1 = await storageContract.methods.nfts(0).call();
	const nftAddress2 = await storageContract.methods.nfts(1).call();
	const nftAddress3 = await storageContract.methods.nfts(2).call();
	const nftAddress4 = await storageContract.methods.nfts(3).call();
	const nftAddress5 = await storageContract.methods.nfts(4).call();
	const linkAddress = await storageContract.methods.linkErc677().call();

	callbacksContract = new web3[n].eth.Contract(CALLBACKS_ABI, callbacksAddress);
	tradingContract = new web3[n].eth.Contract(TRADING_ABI, tradingAddress);
	aggregatorContract = new web3[n].eth.Contract(AGGREGATOR_ABI, aggregatorAddress);
	vaultContract = new web3[n].eth.Contract(VAULT_ABI, vaultAddress);

	nftContract1 = new web3[n].eth.Contract(NFT_ABI, nftAddress1);
	nftContract2 = new web3[n].eth.Contract(NFT_ABI, nftAddress2);
	nftContract3 = new web3[n].eth.Contract(NFT_ABI, nftAddress3);
	nftContract4 = new web3[n].eth.Contract(NFT_ABI, nftAddress4);
	nftContract5 = new web3[n].eth.Contract(NFT_ABI, nftAddress5);

	linkContract = new web3[n].eth.Contract(LINK_ABI, linkAddress);

	if(eventSubTrading !== null && eventSubTrading.id !== null){ eventSubTrading.unsubscribe(); }
	if(eventSubCallbacks !== null && eventSubCallbacks.id !== null){ eventSubCallbacks.unsubscribe(); }
	eventSubTrading = null;
	eventSubCallbacks = null;

	fetchTradingVariables();
	fetchOpenTrades();
	watchLiveTradingEvents();
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
	fetch("https://gasstation-mainnet.matic.network/").then(r => r.json()).then((r) => {
		gasPriceGwei = Math.round(r.fastest);
		gasPriceGwei = gasPriceGwei < process.env.MIN_GAS_PRICE_GWEI ? parseFloat(process.env.MIN_GAS_PRICE_GWEI) : gasPriceGwei;
		gasPriceGwei = gasPriceGwei > process.env.MAX_GAS_PRICE_GWEI ? parseFloat(process.env.MAX_GAS_PRICE_GWEI) : gasPriceGwei;
	}).catch(() => { console.log("Error while fetching fastest gwei from gas station.") });
}, 3*1000);

// -----------------------------------------
// 6. FETCH PAIRS, NFTS, AND NFT TIMELOCK
// -----------------------------------------

async function fetchTradingVariables(){
	web3[selectedProvider].eth.net.isListening().then(async () => {
		const maxPerPair = await storageContract.methods.maxTradesPerPair().call();
		const nftSuccessTimelock = await storageContract.methods.nftSuccessTimelock().call();
		const pairsCount = await aggregatorContract.methods.pairsCount().call();
		nfts = [];

		const nftsCount1 = await nftContract1.methods.balanceOf(process.env.PUBLIC_KEY).call();
		const nftsCount2 = await nftContract2.methods.balanceOf(process.env.PUBLIC_KEY).call();
		const nftsCount3 = await nftContract3.methods.balanceOf(process.env.PUBLIC_KEY).call();
		const nftsCount4 = await nftContract4.methods.balanceOf(process.env.PUBLIC_KEY).call();
		const nftsCount5 = await nftContract5.methods.balanceOf(process.env.PUBLIC_KEY).call();

		for(var i = 0; i < nftsCount1; i++){
			const id = await nftContract1.methods.tokenOfOwnerByIndex(process.env.PUBLIC_KEY, i).call();
			nfts.push({id: id, type: 1});
		}
		for(var i = 0; i < nftsCount2; i++){
			const id = await nftContract2.methods.tokenOfOwnerByIndex(process.env.PUBLIC_KEY, i).call();
			nfts.push({id: id, type: 2});
		}
		for(var i = 0; i < nftsCount3; i++){
			const id = await nftContract3.methods.tokenOfOwnerByIndex(process.env.PUBLIC_KEY, i).call();
			nfts.push({id: id, type: 3});
		}
		for(var i = 0; i < nftsCount4; i++){
			const id = await nftContract4.methods.tokenOfOwnerByIndex(process.env.PUBLIC_KEY, i).call();
			nfts.push({id: id, type: 4});
		}
		for(var i = 0; i < nftsCount5; i++){
			const id = await nftContract5.methods.tokenOfOwnerByIndex(process.env.PUBLIC_KEY, i).call();
			nfts.push({id: id, type: 5});
		}

		let pairsPromises = [];
		for(var i = 0; i < pairsCount; i++){
			pairsPromises.push(aggregatorContract.methods.pairs(i).call());
		}

		Promise.all(pairsPromises).then(async (s) => {
			for(var j = 0; j < s.length; j++){
				const openInterestLong = await storageContract.methods.openInterestDai(j, 0).call();
				const openInterestShort = await storageContract.methods.openInterestDai(j, 1).call();
				const openInterestMax = await storageContract.methods.openInterestDai(j, 2).call();
				openInterests[j] = {long: openInterestLong, short: openInterestShort, max: openInterestMax};
			}

			pairs = [];
			for(var j = 0; j < s.length; j++){
				pairs.push(s[j]);
			}
			nftTimelock = nftSuccessTimelock;
			maxTradesPerPair = maxPerPair;
			console.log("Fetched trading variables.");
		});
	}).catch(() => {
		setTimeout(() => { fetchTradingVariables(); }, 2*1000);
	});
}

setInterval(() => {
	fetchTradingVariables();
	fetchOpenTrades();
}, 60*5*1000);

// -----------------------------------------
// 7. SELECT NFT TO EXECUTE ORDERS
// -----------------------------------------

async function selectNft(){
	return new Promise(async resolve => {
		if(nftTimelock === undefined || nfts.length === 0){ resolve(null); return; }
		
		web3[selectedProvider].eth.net.isListening().then(async () => {
			const currentBlock = await web3[selectedProvider].eth.getBlockNumber();

			for(var i = 0; i < nfts.length; i++){
				const lastSuccess = await storageContract.methods.nftLastSuccess(nfts[i].id).call();
				if(parseFloat(currentBlock) - parseFloat(lastSuccess) >= nftTimelock
				&& !nftsBeingUsed.includes(nfts[i].id)){
					console.log("Selected NFT #" + nfts[i].id);
					resolve(nfts[i]);
					return;
				}
			}

			console.log("No suitable NFT to select.");
			resolve(null);

		}).catch(() => {
			resolve(null);
		});
	});
}

// -----------------------------------------
// 8. LOAD OPEN TRADES
// -----------------------------------------

async function fetchOpenTrades(){
	web3[selectedProvider].eth.net.isListening().then(async () => {

		if(pairs.length === 0){
			setTimeout(() => { fetchOpenTrades(); }, 2*1000);
			return;
		}

		openTrades = [];

		let openLimitOrdersPromises = [];
		const openLimitOrders = await storageContract.methods.getOpenLimitOrders().call();
		for(var i = 0; i < openLimitOrders.length; i++){
			openLimitOrdersPromises.push(storageContract.methods.openLimitOrders(i).call());
		}

		let promisesPairTradersArray = [];
		for(var i = 0; i < pairs.length; i++){
			promisesPairTradersArray.push(storageContract.methods.pairTradersArray(i).call());
		}

		Promise.all(openLimitOrdersPromises).then(async (l) => {
			for(var j = 0; j < l.length; j++){
				openTrades.push(l[j]);
			}

			Promise.all(promisesPairTradersArray).then(async (r) => {
				let promisesTrade = [];

				for(var j = 0; j < r.length; j ++){
					for(var a = 0; a < r[j].length; a++){
						for(var b = 0; b < maxTradesPerPair; b++){
							promisesTrade.push(storageContract.methods.openTrades(r[j][a], j, b).call());
						}
					}
				}

				Promise.all(promisesTrade).then((trades) => {
					for(var j = 0; j < trades.length; j++){
						if(trades[j].leverage.toString() === "0"){ continue; }
						openTrades.push(trades[j]);
					}

					console.log("Fetched open trades: " + openTrades.length);
				});
			});
		});
	}).catch(() => {
		setTimeout(() => { fetchOpenTrades(); }, 2*1000);
	});
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
				}, process.env.LIVE_EVENT_CONFIRMATIONS_SEC*1000);
			});
		}

		if(eventSubCallbacks === null){
			eventSubCallbacks = callbacksContract.events.allEvents({ fromBlock: 'latest' }).on('data', function (event){
				const eventName = event.event.toString();

				if(eventName !== "MarketExecuted" && eventName !== "LimitExecuted"
				&& eventName !== "TradeUpdatedMarketClosed"){
					return;
				}

				event.triedTimes = 1;

				setTimeout(() => {
					refreshOpenTrades(event);
				}, process.env.LIVE_EVENT_CONFIRMATIONS_SEC*1000);
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
					&& openTrades[i].index === index
					&& openTrades[i].hasOwnProperty('minPrice')){

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

				for(var i = 0; i < openTrades.length; i++){

					if(openTrades[i].trader === v.trader 
					&& openTrades[i].pairIndex === v.pairIndex
					&& openTrades[i].index === v.index
					&& openTrades[i].hasOwnProperty('minPrice')){

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
		|| eventName === "TpUpdated" || eventName === "SlUpdated"
		|| eventName === "TradeUpdatedMarketClosed"){

			const trader = eventName !== "MarketExecuted" && eventName !== "LimitExecuted" ? v.trader : v.t[0];
			const pairIndex = eventName !== "MarketExecuted" && eventName !== "LimitExecuted" ? v.pairIndex : v.t[1];
			const index = eventName !== "MarketExecuted" && eventName !== "LimitExecuted" ? v.index : v.t[2];

			const trade = await storageContract.methods.openTrades(trader, pairIndex, index).call();
			
			if(parseFloat(trade.leverage) > 0){
				let found = false;

				for(var i = 0; i < openTrades.length; i++){

					if(openTrades[i] !== undefined
					&& openTrades[i].trader === trader 
					&& openTrades[i].pairIndex === pairIndex
					&& openTrades[i].index === index 
					&& openTrades[i].hasOwnProperty('openPrice')){

						openTrades[i] = trade;
						found = true;

						console.log("Watch events ("+eventName+"): Updated trade");
						break;
					}
				}

				if(!found){ 
					openTrades.push(trade); 
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
					&& openTrades[i].trader === v.t[0] 
					&& openTrades[i].pairIndex === v.t[1]
					&& openTrades[i].index === v.t[2] 
					&& openTrades[i].hasOwnProperty('openPrice')){

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
			}, process.env.EVENT_CONFIRMATIONS_SEC*1000);

			console.log("Watch events ("+eventName+"): Trade not found on the blockchain, trying again in "+(process.env.EVENT_CONFIRMATIONS_SEC/2)+" seconds.");
		}
	}).catch((e) => { console.log("Problem when refreshing trades", e); });
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

function wss(){
	let socket = new WebSocket(process.env.PRICES_URL);
	socket.onclose = () => { setTimeout(() => { wss() }, 2000); };
	socket.onerror = () => { socket.close(); };
	socket.onmessage = async (msg) => {
		const p = JSON.parse(msg.data);
		if(p.closes === undefined) return;
		
		if(pairs.length > 0 && allowedLink){
			for (let i = openTrades.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				const temp = openTrades[i];
				openTrades[i] = openTrades[j];
				openTrades[j] = temp;
			}

			for(var i = 0; i < openTrades.length; i++){
				const t = openTrades[i];
				const price = p.closes[t.pairIndex];
				const buy = t.buy.toString() === "true";
				let orderType = -1;

				if(t.openPrice !== undefined){
					const tp = parseFloat(t.tp)/1e10;
					const sl = parseFloat(t.sl)/1e10;
					const open = parseFloat(t.openPrice)/1e10;
					const lev = parseFloat(t.leverage);
					const liqPrice = buy ? open - 0.9/lev*open : open + 0.9/lev*open;

					if(tp.toString() !== "0" && ((buy && price >= tp) || (!buy && price <= tp))){
						orderType = 0;
					}else if(sl.toString() !== "0" && ((buy && price <= sl) || (!buy && price >= sl))){
						orderType = 1;
					}else if((buy && price <= liqPrice) || (!buy && price >= liqPrice)){
						orderType = 2;
					}
				}else{
					const spread = pairs[t.pairIndex].spreadP/1e10*(100-t.spreadReductionP)/100;
					const priceIncludingSpread = !buy ? price*(1-spread/100) : price*(1+spread/100);
					const interestDai = buy ? parseFloat(openInterests[t.pairIndex].long) : parseFloat(openInterests[t.pairIndex].short);
					const newInterestDai = (interestDai + parseFloat(t.leverage)*parseFloat(t.positionSize));
					const maxInterestDai = parseFloat(openInterests[t.pairIndex].max);

					if(priceIncludingSpread >= parseFloat(t.minPrice)/1e10 && priceIncludingSpread <= parseFloat(t.maxPrice)/1e10
					&& newInterestDai <= maxInterestDai){
						orderType = 3;
					}
				}

				if(orderType > -1 && !alreadyTriggered(t, orderType)){
					const nft = await selectNft();
					if(nft === null){ 
						return; 
					}

					const orderInfo = {nftId: nft.id, trade: t, type: orderType,
						name: orderType === 0 ? "TP" : orderType === 1 ? "SL" : orderType === 2 ? "LIQ" : "OPEN LIMIT"};

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
							    gasPrice: web3[selectedProvider].utils.toHex(gasPriceGwei*1e9),
							    gas: web3[selectedProvider].utils.toHex("2000000"),
							    gasLimit: web3[selectedProvider].utils.toHex("3000000")
							};

							web3[selectedProvider].eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY).then(signed => {
							    web3[selectedProvider].eth.sendSignedTransaction(signed.rawTransaction)
							    .on('receipt', () => {
									console.log("Triggered (order type: " + orderInfo.name + ", nft id: "+orderInfo.nftId+")");
									setTimeout(() => {
										ordersTriggered = ordersTriggered.filter(item => JSON.stringify(item) !== JSON.stringify({trade:orderInfo.trade, orderType: orderInfo.type}));
										nftsBeingUsed = nftsBeingUsed.filter(item => item !== orderInfo.nftId);
									}, process.env.TRIGGER_TIMEOUT*1000);
							    }).on('error', (e) => {
							    	console.log("Failed to trigger (order type: " + orderInfo.name + ", nft id: "+orderInfo.nftId+")");
									//console.log("Tx error (" + e + ")");
							    	setTimeout(() => {
										ordersTriggered = ordersTriggered.filter(item => JSON.stringify(item) !== JSON.stringify({trade:orderInfo.trade, orderType: orderInfo.type}));
										nftsBeingUsed = nftsBeingUsed.filter(item => item !== orderInfo.nftId);
									}, process.env.TRIGGER_TIMEOUT*1000);
							    });
							}).catch(e => {
								console.log("Failed to trigger (order type: " + orderInfo.name + ", nft id: "+orderInfo.nftId+")");
								//console.log("Tx error (" + e + ")");
						    	setTimeout(() => {
									ordersTriggered = ordersTriggered.filter(item => JSON.stringify(item) !== JSON.stringify({trade:orderInfo.trade, orderType: orderInfo.type}));
									nftsBeingUsed = nftsBeingUsed.filter(item => item !== orderInfo.nftId);
								}, process.env.TRIGGER_TIMEOUT*1000);
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
				    gasPrice: web3[selectedProvider].utils.toHex(gasPriceGwei*1e9),
				    gas: web3[selectedProvider].utils.toHex("1000000"),
				    gasLimit: web3[selectedProvider].utils.toHex("500000")
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
				    gasPrice: web3[selectedProvider].utils.toHex(gasPriceGwei*1e9),
				    gas: web3[selectedProvider].utils.toHex("1000000"),
				    gasLimit: web3[selectedProvider].utils.toHex("500000")
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
	}, process.env.CHECK_REFILL_SEC*1000);
}

// -------------------------------------------------
// 13. CREATE SERVER (USEFUL FOR CLOUD PLATFORMS)
// -------------------------------------------------

const port = process.env.PORT || 4002;
server.listen(port, () => console.log(`Listening on port ${port}`));