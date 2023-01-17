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

export const GROUP_IDS = {
    CRYPTO: 0,
    FOREX: 1,
    STOCKS_1: 2,
    STOCKS_2: 3,
    STOCKS_3: 4,
    INDICES: 5,
    COMMODITIES_1: 6,
    COMMODITIES_2: 7,
}

export const isCryptoGroup = (groupId) => groupId === GROUP_IDS.CRYPTO;
export const isForexGroup = (groupId) => groupId === GROUP_IDS.FOREX;
export const isStocksGroup = (groupId) => groupId >= GROUP_IDS.STOCKS_1 && groupId <= GROUP_IDS.STOCKS_3;
export const isIndicesGroup = (groupId) => groupId === GROUP_IDS.INDICES;
export const isCommoditiesGroup = (groupId) => groupId >= GROUP_IDS.COMMODITIES_1 && groupId <= GROUP_IDS.COMMODITIES_2;