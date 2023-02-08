export const transformRawTrades = (rawTrades) =>
	rawTrades?.map(({ trade, tradeInfo, initialAccFees }) => ({
		trader: trade.trader,
		pairIndex: trade.pairIndex.toString(),
		index: trade.index.toString(),
		initialPosToken: trade.initialPosToken.toString(),
		openPrice: trade.openPrice.toString(),
		buy: trade.buy,
		leverage: trade.leverage.toString(),
		tp: trade.tp.toString(),
		sl: trade.sl.toString(),
		tradeInfo: {
			beingMarketClosed: tradeInfo.beingMarketClosed,
			tokenPriceDai: tradeInfo.tokenPriceDai.toString(),
			openInterestDai: tradeInfo.openInterestDai.toString(),
			tpLastUpdated: tradeInfo.tpLastUpdated.toString(),
			slLastUpdated: tradeInfo.slLastUpdated.toString(),
		},
		tradeInitialAccFees: {
			rollover: parseInt(initialAccFees.rollover.toString(), 10) / 1e18,
			funding: parseInt(initialAccFees.funding.toString(), 10) / 1e18,
			openedAfterUpdate: initialAccFees.openedAfterUpdate,
		},
	}));
