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
}