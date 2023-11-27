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
      tokenPriceDai: tradeInfo.tokenPriceDai.toString(),
      openInterestDai: tradeInfo.openInterestDai.toString(),
      tpLastUpdated: tradeInfo.tpLastUpdated.toString(),
      slLastUpdated: tradeInfo.slLastUpdated.toString(),
    },
    tradeInitialAccFees: {
      rollover: parseInt(initialAccFees.rollover.toString(), 10) / 1e18,
      funding: parseInt(initialAccFees.funding.toString(), 10) / 1e18,
      openedAfterUpdate: initialAccFees.openedAfterUpdate,
      borrowing: {
        accPairFee: initialAccFees.borrowing.accPairFee / 1e10,
        accGroupFee: initialAccFees.borrowing.accGroupFee / 1e10,
        block: initialAccFees.borrowing.block,
      },
    },
  }));

export const buildTradeIdentifier = (trader, pairIndex, index, isPendingOpenLimitOrder) => {
  if (isPendingOpenLimitOrder === undefined) {
    throw new Error('isPendingOpenLimitOrder was passed as undefined!');
  }

  return `trade://${trader}/${pairIndex}/${index}?isOpenLimit=${isPendingOpenLimitOrder}`;
};

export const transformLastUpdated = (ol, olLastUpdated, t, tLastUpdated) => {
  return [
    ...olLastUpdated.map((l, i) => [
      buildTradeIdentifier(ol[i].trader, ol[i].pairIndex, ol[i].index, true),
      { sl: l.sl, tp: l.tp, limit: l.limit },
    ]),
    ...tLastUpdated.map((l, i) => [
      buildTradeIdentifier(t[i].trader, t[i].pairIndex, t[i].index, false),
      { sl: l.sl, tp: l.tp, limit: l.limit },
    ]),
  ];
};

export const convertOpenInterest = (interest) => ({
  long: parseFloat(interest.long) / 1e18,
  short: parseFloat(interest.short) / 1e18,
  max: parseFloat(interest.max) / 1e18,
});

export const convertTrade = (trade) => {
  const { buy, trader } = trade;
  return {
    buy,
    trader,
    index: parseInt(trade.index),
    initialPosToken: parseFloat(trade.initialPosToken) / 1e18,
    leverage: parseInt(trade.leverage),
    openPrice: parseFloat(trade.openPrice) / 1e10,
    pairIndex: parseInt(trade.pairIndex),
    sl: parseFloat(trade.sl) / 1e10,
    tp: parseFloat(trade.tp) / 1e10,
  };
};

export const convertTradeInfo = (tradeInfo) => ({
  openInterestDai: parseFloat(tradeInfo.openInterestDai) / 1e18,
  slLastUpdated: parseInt(tradeInfo.slLastUpdated),
  tokenPriceDai: parseFloat(tradeInfo.tokenPriceDai) / 1e10,
  tpLastUpdated: parseInt(tradeInfo.tpLastUpdated),
});

export const convertTradeInitialAccFees = (initialAccFees) => ({
  rollover: parseFloat(initialAccFees.rollover) / 1e18,
  funding: parseInt(initialAccFees.funding) / 1e18,
  openedAfterUpdate: initialAccFees.openedAfterUpdate,
  borrowing: {
    accPairFee: parseFloat(initialAccFees.borrowing?.accPairFee || '0') / 1e10,
    accGroupFee: parseFloat(initialAccFees.borrowing?.accGroupFee || '0') / 1e10,
    block: parseInt(initialAccFees.borrowing?.block || '0'),
  },
});

export const packNft = (a, b, c, d, e, f) => {
  return pack([a, b, c, d, e, f].map(BigInt), [8, 160, 16, 16, 16, 16].map(BigInt));
};

export const convertOpenCollateral = (collateral) => ({
  long: parseFloat(collateral.long) / 1e18,
  short: parseFloat(collateral.short) / 1e18,
});

export const convertOiWindows = (oiWindows) => {
  return oiWindows.map((pairWindows) =>
    Object.fromEntries(Object.entries(pairWindows).map(([key, oiWindow]) => [key, convertOpenCollateral(oiWindow)]))
  );
};

export const increaseWindowOi = (oiWindows, pairIndex, windowId, long, openInterest) => {
  if (!oiWindows[pairIndex][windowId]) oiWindows[pairIndex][windowId] = { long: 0, short: 0 };

  const oi = parseFloat(openInterest) / 1e18;

  if (long) {
    oiWindows[pairIndex][windowId].long += oi;
  } else {
    oiWindows[pairIndex][windowId].short += oi;
  }
};

export const decreaseWindowOi = (oiWindows, pairIndex, windowId, long, openInterest, notOutdated) => {
  if (!notOutdated) return;

  if (!oiWindows[pairIndex][windowId]) {
    return;
  }

  const oi = parseFloat(openInterest) / 1e18;
  if (long) {
    oiWindows[pairIndex][windowId].long -= oi;
  } else {
    oiWindows[pairIndex][windowId].short -= oi;
  }
};

export const transferOiWindows = (oiWindows, pairsCount, prevCurrentWindowId, prevEarliestWindowId, newCurrentWindowId) => {
  const newOiWindows = [];

  for (let i = 0; i < pairsCount; i++) {
    const oi = { long: 0, short: 0 };

    for (let id = prevEarliestWindowId; id <= prevCurrentWindowId; id++) {
      const window = oiWindows?.[i]?.[id] || { long: 0, short: 0 };
      oi.long += window.long;
      oi.short += window.short;
    }

    newOiWindows.push({ [newCurrentWindowId]: { long: oi.long, short: oi.short } });
  }

  return newOiWindows;
};

export const updateWindowsDuration = (oiWindowsSettings, windowsDuration) => {
  oiWindowsSettings.windowsDuration = parseFloat(windowsDuration);
};

export const updateWindowsCount = (oiWindowsSettings, windowsCount) => {
  oiWindowsSettings.windowsCount = parseFloat(windowsCount);
};
