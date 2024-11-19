const GROUP_IDS = {
  CRYPTO: [0, 10, 11],
  FOREX: [1, 8, 9],
  STOCKS: [2, 3, 4],
  INDICES: [5],
  COMMODITIES: [6, 7],
};
export const isCryptoGroup = (groupId) => GROUP_IDS.CRYPTO.includes(groupId);
export const isForexGroup = (groupId) => GROUP_IDS.FOREX.includes(groupId);
export const isStocksGroup = (groupId) => GROUP_IDS.STOCKS.includes(groupId);
export const isIndicesGroup = (groupId) => GROUP_IDS.INDICES.includes(groupId);
export const isCommoditiesGroup = (groupId) => GROUP_IDS.COMMODITIES.includes(groupId);

export const MAX_OPEN_NEGATIVE_PNL_P = 40; // 40%;
export const TRADE_TYPE = { MARKET: 0, LIMIT: 1 };

export const PENDING_ORDER_TYPE = {
  MARKET_OPEN: 0,
  MARKET_CLOSE: 1,
  LIMIT_OPEN: 2,
  STOP_OPEN: 3,
  TP_CLOSE: 4,
  SL_CLOSE: 5,
  LIQ_CLOSE: 6,
};

export * from './abis.js';
export * from './networks.js';
