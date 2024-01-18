import { pack } from '@gainsnetwork/sdk';
import Web3 from 'web3';
import { CHAIN_IDS, NETWORKS } from '../constants/index.js';
export const transformRawTrades = (rawTrades, collateral) =>
  rawTrades?.map(({ trade, tradeInfo, initialAccFees }) => ({
    collateral,
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
    tradeData: {}, // not needed for anything
    tradeInitialAccFees: {
      borrowing: {
        accPairFee: initialAccFees.borrowing.accPairFee / 1e10,
        accGroupFee: initialAccFees.borrowing.accGroupFee / 1e10,
        block: initialAccFees.borrowing.block,
      },
    },
  }));

export const buildTradeIdentifier = (collateral, trader, pairIndex, index, isPendingOpenLimitOrder, log = true) => {
  if (isPendingOpenLimitOrder === undefined) {
    throw new Error('isPendingOpenLimitOrder was passed as undefined!');
  }

  return `trade://${collateral}/${trader}/${pairIndex}/${index}?isOpenLimit=${isPendingOpenLimitOrder}`;
};

export const transformLastUpdated = (ol, olLastUpdated, t, tLastUpdated) => {
  return [
    ...olLastUpdated.map((l, i) => [
      buildTradeIdentifier(ol[i].collateral, ol[i].trader, ol[i].pairIndex, ol[i].index, true),
      { sl: l.sl, tp: l.tp, limit: l.limit },
    ]),
    ...tLastUpdated.map((l, i) => [
      buildTradeIdentifier(t[i].collateral, t[i].trader, t[i].pairIndex, t[i].index, false),
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
export const convertOiWindow = (oiWindow) => ({
  oiLongUsd: parseFloat(oiWindow.oiLongUsd) / 1e18,
  oiShortUsd: parseFloat(oiWindow.oiShortUsd) / 1e18,
});

export const convertOiWindows = (oiWindows) => {
  return oiWindows.map((pairWindows) =>
    Object.fromEntries(Object.entries(pairWindows).map(([key, oiWindow]) => [key, convertOiWindow(oiWindow)]))
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

export const appConfig = () => {
  const conf = {
    MAX_FEE_PER_GAS_WEI_HEX:
      (process.env.MAX_GAS_PRICE_GWEI ?? '').length > 0 ? Web3.utils.toHex(parseInt(process.env.MAX_GAS_PRICE_GWEI, 10) * 1e9) : 0,
    MAX_GAS_PER_TRANSACTION_HEX: Web3.utils.toHex(parseInt(process.env.MAX_GAS_PER_TRANSACTION, 10)),
    EVENT_CONFIRMATIONS_MS: parseFloat(process.env.EVENT_CONFIRMATIONS_SEC) * 1000,
    AUTO_HARVEST_MS: parseFloat(process.env.AUTO_HARVEST_SEC) * 1000,
    FAILED_ORDER_TRIGGER_TIMEOUT_MS: parseFloat(process.env.FAILED_ORDER_TRIGGER_TIMEOUT_SEC || '60') * 1000,
    PRIORITY_GWEI_MULTIPLIER: parseFloat(process.env.PRIORITY_GWEI_MULTIPLIER),
    MIN_PRIORITY_GWEI: parseFloat(process.env.MIN_PRIORITY_GWEI),
    COLLATERAL_PRICE_REFRESH_INTERVAL_MS: parseFloat(process.env.COLLATERAL_PRICE_REFRESH_INTERVAL_SEC || '5') * 1000,
    OPEN_TRADES_REFRESH_MS: parseFloat(process.env.OPEN_TRADES_REFRESH_SEC || '120') * 1000,
    GAS_REFRESH_INTERVAL_MS: parseFloat(process.env.GAS_REFRESH_INTERVAL_SEC || '3') * 1000,
    WEB3_STATUS_REPORT_INTERVAL_MS: parseFloat(process.env.WEB3_STATUS_REPORT_INTERVAL_SEC || '30') * 1000,
    USE_MULTICALL: (process.env.USE_MULTICALL && process.env.USE_MULTICALL === 'true') || false,
    MAX_RETRIES: process.env.MAX_RETRIES && !isNaN(+process.env.MAX_RETRIES) ? parseInt(process.env.MAX_RETRIES) : -1,
    WEB3_PROVIDER_URLS: process.env.WSS_URLS.split(','),
    CHAIN_ID: process.env.CHAIN_ID !== undefined ? parseInt(process.env.CHAIN_ID, 10) : CHAIN_IDS.POLYGON,
    CHAIN: process.env.CHAIN ?? 'mainnet',
    DRY_RUN_MODE: process.env.DRY_RUN_MODE === 'true',
    FETCH_TRADING_VARIABLES_REFRESH_INTERVAL_MS: parseFloat(process.env.FETCH_TRADING_VARIABLES_REFRESH_INTERVAL_SEC || '61') * 1000,
  };

  const NETWORK = NETWORKS[conf.CHAIN_ID];

  return {
    ...conf,
    NETWORK,
  };
};

export * from './logger.js';
export * from './NonceManager.js';
export * from './multiCollateral.js';
