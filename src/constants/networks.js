export const GAS_MODE = {
  EIP1559: 'eip1559',
  LEGACY: 'legacy',
};

export const CHAIN_IDS = {
  POLYGON: 137,
  MUMBAI: 80001,
  ARBITRUM: 42161,
  SEPOLIA: 421614,
};

export const COLLATERAL = {
  DAI: 'DAI',
  WETH: 'WETH',
  USDC: 'USDC',
};

export const COLLATERAL_CONFIG = {
  [COLLATERAL.DAI]: {
    decimals: 18,
    precision: 1e18,
    precisionDelta: 1,
  },
  [COLLATERAL.WETH]: {
    decimals: 18,
    precision: 1e18,
    precisionDelta: 1,
  },
  [COLLATERAL.USDC]: {
    decimals: 6,
    precision: 1e6,
    precisionDelta: 1e12,
  },
};

export const NETWORKS = {
  [CHAIN_IDS.POLYGON]: {
    chainName: 'polygon',
    chainId: CHAIN_IDS.POLYGON,
    gasMode: GAS_MODE.EIP1559,
    gasStationUrl: 'https://gasstation.polygon.technology/v2',
    diamondAddress: '0x209A9A01980377916851af2cA075C2b170452018',
    collaterals: [
      {
        symbol: COLLATERAL.DAI,
        collateralIndex: 1,
      },
      {
        symbol: COLLATERAL.WETH,
        collateralIndex: 2,
      },
      {
        symbol: COLLATERAL.USDC,
        collateralIndex: 3,
      },
    ],
  },
  [CHAIN_IDS.ARBITRUM]: {
    chainName: 'arbitrum',
    chainId: CHAIN_IDS.ARBITRUM,
    gasMode: GAS_MODE.LEGACY,
    gasStationUrl: undefined,
    diamondAddress: '0xFF162c694eAA571f685030649814282eA457f169',
    collaterals: [
      {
        symbol: COLLATERAL.DAI,
        collateralIndex: 1,
      },
      {
        symbol: COLLATERAL.WETH,
        collateralIndex: 2,
      },
      {
        symbol: COLLATERAL.USDC,
        collateralIndex: 3,
      },
    ],
  },
  [CHAIN_IDS.SEPOLIA]: {
    chainName: 'sepolia',
    chainId: CHAIN_IDS.SEPOLIA,
    gasMode: GAS_MODE.LEGACY,
    gasStationUrl: undefined,
    diamondAddress: '0xd659a15812064C79E189fd950A189b15c75d3186',
    collaterals: [
      {
        symbol: COLLATERAL.DAI,
        collateralIndex: 1,
      },
      {
        symbol: COLLATERAL.WETH,
        collateralIndex: 2,
      },
      {
        symbol: COLLATERAL.USDC,
        collateralIndex: 3,
      },
    ],
  },
};
