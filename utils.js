import { pack } from '@gainsnetwork/sdk';
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
      tokenPriceDai: tradeInfo.tokenPriceDai.toString(), // GNS/COLLATERAL
      openInterestDai: tradeInfo.openInterestDai.toString(),
      tpLastUpdated: tradeInfo.tpLastUpdated.toString(),
      slLastUpdated: tradeInfo.slLastUpdated.toString(),
    },
    tradeData: {},
    tradeInitialAccFees: {
      borrowing: {
        accPairFee: initialAccFees.borrowing.accPairFee / 1e10,
        accGroupFee: initialAccFees.borrowing.accGroupFee / 1e10,
        block: initialAccFees.borrowing.block,
      },
    },
  }));

export const buildTradeIdentifier = (collateral, trader, pairIndex, index, isPendingOpenLimitOrder) => {
  if (isPendingOpenLimitOrder === undefined) {
    throw new Error('isPendingOpenLimitOrder was passed as undefined!');
  }

  return `trade://${collateral}/${trader}/${pairIndex}/${index}?isOpenLimit=${isPendingOpenLimitOrder}`;
};

export const transformLastUpdated = (collateral, ol, olLastUpdated, t, tLastUpdated) => {
  return [
    ...olLastUpdated.map((l, i) => [
      buildTradeIdentifier(collateral, ol[i].trader, ol[i].pairIndex, ol[i].index, true),
      { sl: l.sl, tp: l.tp, limit: l.limit },
    ]),
    ...tLastUpdated.map((l, i) => [
      buildTradeIdentifier(collateral, t[i].trader, t[i].pairIndex, t[i].index, false),
      { sl: l.sl, tp: l.tp, limit: l.limit },
    ]),
  ];
};

export const convertOpenInterest = (interest, collateralPrecision = 1e18) => ({
  long: parseFloat(interest.long) / collateralPrecision,
  short: parseFloat(interest.short) / collateralPrecision,
  max: parseFloat(interest.max) / collateralPrecision,
});

export const convertTrade = (trade) => {
  const { buy, trader } = trade;
  return {
    buy,
    trader,
    index: parseInt(trade.index),
    initialPosToken: parseFloat(trade.initialPosToken) / 1e18, // 1e18 GNS
    leverage: parseInt(trade.leverage),
    openPrice: parseFloat(trade.openPrice) / 1e10,
    pairIndex: parseInt(trade.pairIndex),
    sl: parseFloat(trade.sl) / 1e10,
    tp: parseFloat(trade.tp) / 1e10,
  };
};

export const convertTradeInfo = (tradeInfo, collateralPrecision = 1e18) => ({
  openInterestDai: parseFloat(tradeInfo.openInterestDai) / collateralPrecision, // collateral precision
  slLastUpdated: parseInt(tradeInfo.slLastUpdated),
  tokenPriceDai: parseFloat(tradeInfo.tokenPriceDai) / 1e10,
  tpLastUpdated: parseInt(tradeInfo.tpLastUpdated),
});

export const convertTradeInitialAccFees = (initialAccFees) => ({
  borrowing: {
    accPairFee: parseFloat(initialAccFees.borrowing?.accPairFee || '0') / 1e10,
    accGroupFee: parseFloat(initialAccFees.borrowing?.accGroupFee || '0') / 1e10,
    block: parseInt(initialAccFees.borrowing?.block || '0'),
  },
});

export const packNft = (a, b, c, d, e, f) => {
  return pack([a, b, c, d, e, f].map(BigInt), [8, 160, 16, 16, 16, 16].map(BigInt));
};

// OI Windows
// 1e18 USD normalized
export const convertOpenCollateral = (collateral) => ({
  oiLongUsd: parseFloat(collateral.oiLongUsd) / 1e18, //
  oiShortUsd: parseFloat(collateral.oiShortUsd) / 1e18,
});

export const convertOiWindows = (oiWindows) => {
  return oiWindows.map((pairWindows) =>
    Object.fromEntries(Object.entries(pairWindows).map(([key, oiWindow]) => [key, convertOpenCollateral(oiWindow)]))
  );
};

export const increaseWindowOi = (oiWindows, pairIndex, windowId, long, openInterest) => {
  if (!oiWindows[pairIndex][windowId]) oiWindows[pairIndex][windowId] = { oiLongUsd: 0, oiShortUsd: 0 };

  const oi = parseFloat(openInterest) / 1e18;

  if (long) {
    oiWindows[pairIndex][windowId].oiLongUsd += oi;
  } else {
    oiWindows[pairIndex][windowId].oiShortUsd += oi;
  }
};

export const decreaseWindowOi = (oiWindows, pairIndex, windowId, long, openInterest, notOutdated) => {
  if (!notOutdated) return;

  if (!oiWindows[pairIndex][windowId]) {
    return;
  }

  const oi = parseFloat(openInterest) / 1e18;
  if (long) {
    oiWindows[pairIndex][windowId].oiLongUsd -= oi;
  } else {
    oiWindows[pairIndex][windowId].oiShortUsd -= oi;
  }
};

export const transferOiWindows = (oiWindows, pairsCount, prevCurrentWindowId, prevEarliestWindowId, newCurrentWindowId) => {
  const newOiWindows = [];

  for (let i = 0; i < pairsCount; i++) {
    const oi = { oiLongUsd: 0, oiShortUsd: 0 };

    for (let id = prevEarliestWindowId; id <= prevCurrentWindowId; id++) {
      const window = oiWindows?.[i]?.[id] || { oiLongUsd: 0, oiShortUsd: 0 };
      oi.oiLongUsd += window.oiLongUsd;
      oi.oiShortUsd += window.oiShortUsd;
    }

    newOiWindows.push({ [newCurrentWindowId]: { oiLongUsd: oi.oiLongUsd, oiShortUsd: oi.oiShortUsd } });
  }

  return newOiWindows;
};

export const updateWindowsDuration = (oiWindowsSettings, windowsDuration) => {
  oiWindowsSettings.windowsDuration = parseFloat(windowsDuration);
};

export const updateWindowsCount = (oiWindowsSettings, windowsCount) => {
  oiWindowsSettings.windowsCount = parseFloat(windowsCount);
};
