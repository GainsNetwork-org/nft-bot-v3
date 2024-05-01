import { ABIS as abis, ABIS, COLLATERAL_CONFIG } from '../constants/index.js';
import ethers from 'ethers';

export const initStack = async (w3, multiCollat, stackConfig) => {
  const storage = new w3.eth.Contract(ABIS.STORAGE, stackConfig.storage);
  const trading = new w3.eth.Contract(abis.TRADING, stackConfig.trading);

  const [aggregatorAddress, callbacksAddress, vaultAddress, linkAddress] = await Promise.all([
    storage.methods.priceAggregator().call(),
    storage.methods.callbacks().call(),
    storage.methods.vault().call(),
    storage.methods.linkErc677().call(),
  ]);

  const callbacks = new w3.eth.Contract(abis.CALLBACKS, callbacksAddress);

  const [nftRewardsAddress, borrowingFeesAddress] = await Promise.all([
    callbacks.methods.nftRewards().call(),
    callbacks.methods.borrowingFees().call(),
  ]);
  const vault = new w3.eth.Contract(abis.VAULT, vaultAddress);
  const aggregator = new w3.eth.Contract(abis.AGGREGATOR, aggregatorAddress);
  const borrowingFees = new w3.eth.Contract(abis.BORROWING_FEES, borrowingFeesAddress);
  const nftRewards = new w3.eth.Contract(abis.NFT_REWARDS, nftRewardsAddress);
  const link = new w3.eth.Contract(abis.LINK, linkAddress);

  const price = ((await aggregator.methods.getCollateralPriceUsd().call()) + '') / 1e8; // 1e8 USD from feed

  return {
    collateral: stackConfig.collateral,
    collateralConfig: COLLATERAL_CONFIG[stackConfig.collateral],
    price,
    contracts: {
      storage,
      callbacks,
      trading,
      vault,
      aggregator,
      borrowingFees,
      nftRewards,
      link,
    },
    eventSubs: {},
    borrowingFeesContext: { groups: [], pairs: [] },
    allowedLink: { storage: false, rewards: false },
  };
};

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
