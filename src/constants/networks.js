export const GAS_MODE = {
  EIP1559: 'eip1559',
  LEGACY: 'legacy',
};

export const CHAIN_IDS = {
  POLYGON: 137,
  MUMBAI: 80001,
  ARBITRUM: 42161,
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
    multiCollatDiamondAddress: '0x209A9A01980377916851af2cA075C2b170452018',
    supportedCollaterals: [
      {
        collateral: COLLATERAL.DAI,
        storage: '0xaee4d11a16B2bc65EDD6416Fb626EB404a6D65BD',
      },
    ],
  },
  [CHAIN_IDS.MUMBAI]: {
    chainName: 'mumbai',
    chainId: CHAIN_IDS.MUMBAI,
    gasMode: GAS_MODE.EIP1559,
    gasStationUrl: 'https://gasstation-testnet.polygon.technology/v2',
    multiCollatDiamondAddress: '0xDee93dD1Cb54ce80D690eC07a20CB0ce9d7F741C',
    supportedCollaterals: [
      {
        collateral: COLLATERAL.DAI,
        storage: '0x4d2dF485c608aa55A23d8d98dD2B4FA24Ba0f2Cf',
        trading: '0x194aa2bbb5f98eddffda9f7b37cb78319f56cd0b',
      },
      {
        collateral: COLLATERAL.WETH,
        storage: '0x989DF13f4feE478cAc463CCCDB784Aa36108aB37',
        trading: '0x31369228781Bf2FDe2117506c25e69A5c360F52A',
      },
      {
        collateral: COLLATERAL.USDC,
        storage: '0x13ed64798DfC826f6384F226913509e18662ab0B',
        trading: '0xF52EDAB4fd86332529AE3E05206e9375ddc7a0FD',
      },
    ],
  },
  [CHAIN_IDS.ARBITRUM]: {
    chainName: 'arbitrum',
    chainId: CHAIN_IDS.ARBITRUM,
    gasMode: GAS_MODE.LEGACY,
    gasStationUrl: undefined,
    multiCollatDiamondAddress: '0xFF162c694eAA571f685030649814282eA457f169',
    supportedCollaterals: [
      {
        collateral: COLLATERAL.DAI,
        storage: '0xcFa6ebD475d89dB04cAd5A756fff1cb2BC5bE33c',
      },
    ],
  },
};
