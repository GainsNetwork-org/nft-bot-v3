export const GAS_MODE = {
    EIP1559: 'eip1559',
    LEGACY: 'legacy',
}

export const CHAIN_IDS = {
    POLYGON: 137,
    MUMBAI: 80001,
    ARBITRUM: 42161,
}

export const NETWORKS = {
    137: {
        chainName: 'polygon',
        chainId: 137,
        gasMode: GAS_MODE.EIP1559,
        gasStationUrl: 'https://gasstation-mainnet.matic.network/v2/',
    },
    80001: {
        chainName: 'mumbai',
        chainId: 80001,
        gasMode: GAS_MODE.EIP1559,
        gasStationUrl: 'https://gasstation-mumbai.matic.today/v2/',
    },
    42161: {
        chainName: 'arbitrum',
        chainId: 42161,
        gasMode: GAS_MODE.LEGACY,
        gasStationUrl: undefined,
    }
}

const GROUP_IDS = {
    CRYPTO: [0],
    FOREX: [1, 8, 9],
    STOCKS: [2, 3, 4],
    INDICES: [5],
    COMMODITIES: [6, 7],
}

export const isCryptoGroup = (groupId) => GROUP_IDS.CRYPTO.includes(groupId);
export const isForexGroup = (groupId) => GROUP_IDS.FOREX.includes(groupId);
export const isStocksGroup = (groupId) => GROUP_IDS.STOCKS.includes(groupId);
export const isIndicesGroup = (groupId) => GROUP_IDS.INDICES.includes(groupId);
export const isCommoditiesGroup = (groupId) => GROUP_IDS.COMMODITIES.includes(groupId);