import { pack } from '@gainsnetwork/sdk';
import Web3 from 'web3';
import { CHAIN_IDS, NETWORKS } from '../constants/index.js';
export const transformRawTrades = (rawTrades) => rawTrades?.map((t) => transformRawTrade(t));

export const transformRawTrade = ({ trade, tradeInfo, initialAccFees }) => ({
  user: trade.user,
  index: trade.index + '',
  pairIndex: trade.pairIndex + '',
  leverage: trade.leverage + '',
  long: trade.long + '' === 'true',
  isOpen: trade.isOpen + '' === 'true',
  collateralIndex: trade.collateralIndex + '',
  tradeType: trade.tradeType,
  collateralAmount: trade.collateralAmount + '',
  openPrice: trade.openPrice + '',
  tp: trade.tp + '',
  sl: trade.sl + '',
  tradeInfo: {
    createdBlock: tradeInfo.createdBlock + '',
    tpLastUpdatedBlock: tradeInfo.tpLastUpdatedBlock + '',
    slLastUpdatedBlock: tradeInfo.slLastUpdatedBlock + '',
    maxSlippageP: tradeInfo.maxSlippageP + '',
    lastOiUpdateTs: tradeInfo.lastOiUpdateTs,
    collateralPriceUsd: tradeInfo.collateralPriceUsd + '',
  },
  initialAccFees: {
    accPairFee: initialAccFees.accPairFee + '',
    accGroupFee: initialAccFees.accGroupFee + '',
    block: initialAccFees.block + '',
  },
});
export const transformOi = ({ long, short, max }) => ({
  long: parseFloat(long) / 1e10,
  short: parseFloat(short) / 1e10,
  max: parseFloat(max) / 1e10,
});

export const buildTradeIdentifier = (user, index, log = true) => {
  return `trade://${user}/${index}`;
};

// @todo not needed?
export const transformLastUpdated = (ol, olLastUpdated, t, tLastUpdated) => {
  if (!olLastUpdated?.length || !tLastUpdated?.length) return [[], []];

  return [
    ...olLastUpdated.map((l, i) => [buildTradeIdentifier(ol[i].user, ol[i].index, true), { sl: l.sl, tp: l.tp, limit: l.limit }]),
    ...tLastUpdated.map((l, i) => [buildTradeIdentifier(t[i].user, t[i].index, false), { sl: l.sl, tp: l.tp, limit: l.limit }]),
  ];
};

export const convertTrade = (trade, precision) => {
  const { long, user } = trade;
  return {
    user,
    index: parseInt(trade.index),
    pairIndex: parseInt(trade.pairIndex),
    leverage: parseFloat(trade.leverage) / 1e3,
    long,
    isOpen: trade.isOpen + '' === 'true',
    collateralIndex: parseInt(trade.collateralIndex),
    tradeType: trade.tradeType,
    collateralAmount: parseFloat(trade.collateralAmount) / precision, // COLLATERAL PRECISION
    openPrice: parseFloat(trade.openPrice) / 1e10,
    sl: parseFloat(trade.sl) / 1e10,
    tp: parseFloat(trade.tp) / 1e10,
  };
};

export const convertTradeInfo = (tradeInfo) => ({
  createdBlock: parseInt(tradeInfo.createdBlock),
  tpLastUpdatedBlock: parseInt(tradeInfo.tpLastUpdatedBlock),
  slLastUpdatedBlock: parseInt(tradeInfo.slLastUpdatedBlock),
  maxSlippageP: parseFloat(tradeInfo.maxSlippageP) / 1e3,
  lastOiUpdateTs: parseInt(tradeInfo.lastOiUpdateTs),
  collateralPriceUsd: parseFloat(tradeInfo.collateralPriceUsd) / 1e8,
});

export const convertTradeInitialAccFees = (initialAccFees) => ({
  accPairFee: parseFloat(initialAccFees?.accPairFee || '0') / 1e10,
  accGroupFee: parseFloat(initialAccFees?.accGroupFee || '0') / 1e10,
  block: parseInt(initialAccFees?.block || '0'),
});

export const packTrigger = (a, b, c) => {
  return pack([a, b, c].map(BigInt), [8, 160, 32].map(BigInt));
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
  if (!oiWindows[pairIndex]?.[windowId]) oiWindows[pairIndex][windowId] = { oiLongUsd: 0, oiShortUsd: 0 };

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

export const transformFrom1e10 = (value) => parseFloat(value) / 1e10;

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
    MAX_LIQ_SPREAD_P: 5 * 1e10 + '',
    PROTECTION_CLOSE_FACTOR_BLOCKS: 1615, // ~1615 blocks per 7 minutes on Arbitrum
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
