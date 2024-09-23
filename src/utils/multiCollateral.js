import { ABIS as abis, COLLATERAL_CONFIG } from '../constants/index.js';
import ethers from 'ethers';

export const getEthersContract = (web3Contract, provider) => {
  return new ethers.Contract(web3Contract.options.address, web3Contract.options.jsonInterface, provider);
};

export const initContracts = async (w3, ctx, networkConfig) => {
  ctx.contracts.diamond = new w3.eth.Contract(abis.MULTI_COLLAT_DIAMOND, networkConfig.diamondAddress);

  const linkAddress = await ctx.contracts.diamond.methods.getChainlinkToken().call();
  ctx.contracts.link = new w3.eth.Contract(abis.LINK, linkAddress);

  for (const collateral of networkConfig.collaterals) {
    ctx.collaterals[collateral.collateralIndex] = {
      ...collateral,
      ...COLLATERAL_CONFIG[collateral.symbol],
      price: (await ctx.contracts.diamond.methods.getCollateralPriceUsd(collateral.collateralIndex).call()) / 1e8,
    };
    ctx.borrowingFeesContext[collateral.collateralIndex] = { groups: [], pairs: [] };
  }
};
