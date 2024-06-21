// prettier-ignore
export const ABIS = {
	LINK: [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}],
	VAULT: [{"inputs":[{"internalType":"contract IERC20MetadataUpgradeable","name":"_asset","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AboveInflationLimit","type":"error"},{"inputs":[],"name":"AboveMax","type":"error"},{"inputs":[],"name":"AboveMaxDiscount","type":"error"},{"inputs":[],"name":"AboveMaxLockDuration","type":"error"},{"inputs":[],"name":"AddressZero","type":"error"},{"inputs":[],"name":"AmountTooBig","type":"error"},{"inputs":[],"name":"BelowMin","type":"error"},{"inputs":[],"name":"BelowMinLockDuration","type":"error"},{"inputs":[],"name":"BytesZero","type":"error"},{"inputs":[],"name":"DepositMoreThanMax","type":"error"},{"inputs":[],"name":"ERC4626ExceededMaxDeposit","type":"error"},{"inputs":[],"name":"ERC4626ExceededMaxMint","type":"error"},{"inputs":[],"name":"ERC4626ExceededMaxRedeem","type":"error"},{"inputs":[],"name":"ERC4626ExceededMaxWithdraw","type":"error"},{"inputs":[],"name":"EndOfEpoch","type":"error"},{"inputs":[],"name":"GnsPriceCallFailed","type":"error"},{"inputs":[],"name":"GnsTokenPriceZero","type":"error"},{"inputs":[],"name":"IncorrectPrecision","type":"error"},{"inputs":[],"name":"MaxDailyPnl","type":"error"},{"inputs":[],"name":"MintMoreThanMax","type":"error"},{"inputs":[],"name":"MoreThanBalance","type":"error"},{"inputs":[],"name":"MoreThanWithdrawAmount","type":"error"},{"inputs":[],"name":"NoActiveDiscount","type":"error"},{"inputs":[],"name":"NoDiscount","type":"error"},{"inputs":[],"name":"NotAllowed","type":"error"},{"inputs":[],"name":"NotEnoughAssets","type":"error"},{"inputs":[],"name":"NotUnderCollateralized","type":"error"},{"inputs":[],"name":"NotUnlocked","type":"error"},{"inputs":[],"name":"OnlyManager","type":"error"},{"inputs":[],"name":"OnlyPnlFeed","type":"error"},{"inputs":[],"name":"OnlyTradingPnlHandler","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[],"name":"PendingWithdrawal","type":"error"},{"inputs":[],"name":"PriceZero","type":"error"},{"inputs":[],"name":"ValueZero","type":"error"},{"inputs":[],"name":"WrongParams","type":"error"},{"inputs":[],"name":"WrongValue","type":"error"},{"inputs":[],"name":"WrongValues","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newAccValue","type":"uint256"}],"name":"AccBlockWeightedMarketCapStored","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"uint256","name":"newEpoch","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"prevPositiveOpenPnl","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPositiveOpenPnl","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newEpochPositiveOpenPnl","type":"uint256"},{"indexed":false,"internalType":"int256","name":"newAccPnlPerTokenUsed","type":"int256"}],"name":"AccPnlPerTokenUsedUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"AdminUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"assets","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"assetsLessDeplete","type":"uint256"}],"name":"AssetsReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"assets","type":"uint256"}],"name":"AssetsSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"CurrentMaxSupplyUpdated","type":"event"},{"anonymous":false,"inputs":[],"name":"DailyAccPnlDeltaReset","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"asset","type":"address"},{"indexed":true,"internalType":"address","name":"delegatee","type":"address"},{"indexed":false,"internalType":"bool","name":"success","type":"bool"}],"name":"Delegated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"assets","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountGns","type":"uint256"}],"name":"Depleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"assets","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"depositId","type":"uint256"},{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"uint256","name":"assetsDeposited","type":"uint256"},{"internalType":"uint256","name":"assetsDiscount","type":"uint256"},{"internalType":"uint256","name":"atTimestamp","type":"uint256"},{"internalType":"uint256","name":"lockDuration","type":"uint256"}],"indexed":false,"internalType":"struct IGToken.LockedDeposit","name":"d","type":"tuple"}],"name":"DepositLocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"depositId","type":"uint256"},{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"uint256","name":"assetsDeposited","type":"uint256"},{"internalType":"uint256","name":"assetsDiscount","type":"uint256"},{"internalType":"uint256","name":"atTimestamp","type":"uint256"},{"internalType":"uint256","name":"lockDuration","type":"uint256"}],"indexed":false,"internalType":"struct IGToken.LockedDeposit","name":"d","type":"tuple"}],"name":"DepositUnlocked","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"indexed":false,"internalType":"struct IGToken.GnsPriceProvider","name":"newValue","type":"tuple"}],"name":"GnsPriceProviderUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"LossesBurnPUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"ManagerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"MaxAccOpenPnlDeltaUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"MaxDailyAccPnlDeltaUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"MaxDiscountPUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"MaxDiscountThresholdPUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"MaxGnsSupplyMintDailyPUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"MaxSupplyIncreaseDailyPUpdated","type":"event"},{"anonymous":false,"inputs":[],"name":"OpenTradesPnlFeedCallFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"OpenTradesPnlFeedUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"PnlHandlerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"assets","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountGns","type":"uint256"}],"name":"Refilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"assets","type":"uint256"}],"name":"RewardDistributed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"ShareToAssetsPriceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"assets","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"currEpoch","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"unlockEpoch","type":"uint256"}],"name":"WithdrawCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256[2]","name":"newValue","type":"uint256[2]"}],"name":"WithdrawLockThresholdsPUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"currEpoch","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"unlockEpoch","type":"uint256"}],"name":"WithdrawRequested","type":"event"},{"inputs":[],"name":"MIN_LOCK_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"accBlockWeightedMarketCap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"accBlockWeightedMarketCapLastStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"accPnlPerToken","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"accPnlPerTokenUsed","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"accRewardsPerToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"asset","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"assetsToDeplete","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"availableAssets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"unlockEpoch","type":"uint256"}],"name":"cancelWithdrawRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"collateralConfig","outputs":[{"internalType":"uint128","name":"precision","type":"uint128"},{"internalType":"uint128","name":"precisionDelta","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"collateralizationP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"name":"convertToAssets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"convertToShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentBalanceDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentEpoch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentEpochPositiveOpenPnl","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentEpochStart","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentMaxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dailyAccPnlDelta","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dailyMintedGns","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"deplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"deposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"},{"internalType":"uint256","name":"lockDuration","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"depositWithDiscountAndLock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"distributeReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"depositId","type":"uint256"}],"name":"getLockedDeposit","outputs":[{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"uint256","name":"assetsDeposited","type":"uint256"},{"internalType":"uint256","name":"assetsDiscount","type":"uint256"},{"internalType":"uint256","name":"atTimestamp","type":"uint256"},{"internalType":"uint256","name":"lockDuration","type":"uint256"}],"internalType":"struct IGToken.LockedDeposit","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"currentBlock","type":"uint256"}],"name":"getPendingAccBlockWeightedMarketCap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gnsPriceProvider","outputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gnsToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gnsTokenToAssetsPrice","outputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"internalType":"struct IGToken.Meta","name":"_meta","type":"tuple"},{"components":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"manager","type":"address"},{"internalType":"address","name":"admin","type":"address"},{"internalType":"address","name":"gnsToken","type":"address"},{"internalType":"address","name":"lockedDepositNft","type":"address"},{"internalType":"address","name":"pnlHandler","type":"address"},{"internalType":"address","name":"openTradesPnlFeed","type":"address"},{"components":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct IGToken.GnsPriceProvider","name":"gnsPriceProvider","type":"tuple"}],"internalType":"struct IGToken.ContractAddresses","name":"_contractAddresses","type":"tuple"},{"internalType":"uint256","name":"_MIN_LOCK_DURATION","type":"uint256"},{"internalType":"uint256","name":"_maxAccOpenPnlDelta","type":"uint256"},{"internalType":"uint256","name":"_maxDailyAccPnlDelta","type":"uint256"},{"internalType":"uint256[2]","name":"_withdrawLockThresholdsP","type":"uint256[2]"},{"internalType":"uint256","name":"_maxSupplyIncreaseDailyP","type":"uint256"},{"internalType":"uint256","name":"_lossesBurnP","type":"uint256"},{"internalType":"uint256","name":"_maxGnsSupplyMintDailyP","type":"uint256"},{"internalType":"uint256","name":"_maxDiscountP","type":"uint256"},{"internalType":"uint256","name":"_maxDiscountThresholdP","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"initializeV2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"initializeV3","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastDailyAccPnlDeltaReset","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDailyMintedGnsReset","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastMaxSupplyUpdate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"collatP","type":"uint256"},{"internalType":"uint256","name":"lockDuration","type":"uint256"}],"name":"lockDiscountP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lockedDepositNft","outputs":[{"internalType":"contract IGTokenLockedDepositNft","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"lockedDeposits","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"uint256","name":"assetsDeposited","type":"uint256"},{"internalType":"uint256","name":"assetsDiscount","type":"uint256"},{"internalType":"uint256","name":"atTimestamp","type":"uint256"},{"internalType":"uint256","name":"lockDuration","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lockedDepositsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lossesBurnP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"address","name":"owner","type":"address"}],"name":"makeWithdrawRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"manager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"marketCap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxAccOpenPnlDelta","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxAccPnlPerToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxDailyAccPnlDelta","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"maxDeposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxDiscountP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxDiscountThresholdP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxGnsSupplyMintDailyP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"maxMint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"maxRedeem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSupplyIncreaseDailyP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"maxWithdraw","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"uint256","name":"lockDuration","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"mintWithDiscountAndLock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"openTradesPnlFeed","outputs":[{"internalType":"contract IGTokenOpenPnlFeed","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pnlHandler","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"previewDeposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"name":"previewMint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"name":"previewRedeem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"previewWithdraw","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"receiveAssets","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"redeem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"refill","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"sendAssets","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"shareToAssetsPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"storeAccBlockWeightedMarketCap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAssets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalClosedPnl","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDepleted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDepletedGns","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDiscounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalLiability","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalLockedDiscounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRefilled","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRefilledGns","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"totalSharesBeingWithdrawn","outputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tryNewOpenPnlRequestOrEpoch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tryResetDailyAccPnlDelta","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tryUpdateCurrentMaxSupply","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tvl","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"depositId","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"unlockDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"prevPositiveOpenPnl","type":"uint256"},{"internalType":"uint256","name":"newPositiveOpenPnl","type":"uint256"}],"name":"updateAccPnlPerTokenUsed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newValue","type":"address"}],"name":"updateAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_delegatee","type":"address"}],"name":"updateDelegatee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct IGToken.GnsPriceProvider","name":"newValue","type":"tuple"}],"name":"updateGnsPriceProvider","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"updateLossesBurnP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newValue","type":"address"}],"name":"updateManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"updateMaxAccOpenPnlDelta","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"updateMaxDailyAccPnlDelta","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"updateMaxDiscountP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"updateMaxDiscountThresholdP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"updateMaxGnsSupplyMintDailyP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"updateMaxSupplyIncreaseDailyP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newValue","type":"address"}],"name":"updateOpenTradesPnlFeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newValue","type":"address"}],"name":"updatePnlHandler","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[2]","name":"newValue","type":"uint256[2]"}],"name":"updateWithdrawLockThresholdsP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"withdraw","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawEpochsTimelock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"withdrawLockThresholdsP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"withdrawRequests","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
	MULTI_COLLAT_DIAMOND: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AboveMax",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AlreadyExists",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "BelowMin",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "BlockOrder",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "DoesntExist",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InitError",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_initializationContractAddress",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "_calldata",
          "type": "bytes"
        }
      ],
      "name": "InitializationFunctionReverted",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidAddresses",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidCollateralIndex",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidFacetCutAction",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidInputLength",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotAllowed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotAuthorized",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotContract",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotFound",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "Overflow",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "Paused",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongAccess",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongIndex",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongLength",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongOrder",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongParams",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongTradeType",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ZeroAddress",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ZeroValue",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "target",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum IAddressStore.Role",
          "name": "role",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "access",
          "type": "bool"
        }
      ],
      "name": "AccessControlUpdated",
      "type": "event",
      "signature": "0x8d7fdec37f50c07219a6a0859420936836eb9254bf412035e3acede18b8b093d"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "gns",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "gnsStaking",
              "type": "address"
            }
          ],
          "indexed": false,
          "internalType": "struct IAddressStore.Addresses",
          "name": "addresses",
          "type": "tuple"
        }
      ],
      "name": "AddressesUpdated",
      "type": "event",
      "signature": "0xe4f1f9461410dada4f4b49a4b363bdf35e6069fb5a0cea4b1147c32affbd954a"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "facetAddress",
              "type": "address"
            },
            {
              "internalType": "enum IDiamondStorage.FacetCutAction",
              "name": "action",
              "type": "uint8"
            },
            {
              "internalType": "bytes4[]",
              "name": "functionSelectors",
              "type": "bytes4[]"
            }
          ],
          "indexed": false,
          "internalType": "struct IDiamondStorage.FacetCut[]",
          "name": "_diamondCut",
          "type": "tuple[]"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_init",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "_calldata",
          "type": "bytes"
        }
      ],
      "name": "DiamondCut",
      "type": "event",
      "signature": "0x8faa70878671ccd212d20771b795c50af8fd3ff6cf27f4bde57e5d4de0aeb673"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "version",
          "type": "uint8"
        }
      ],
      "name": "Initialized",
      "type": "event",
      "signature": "0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "facetAddress",
              "type": "address"
            },
            {
              "internalType": "enum IDiamondStorage.FacetCutAction",
              "name": "action",
              "type": "uint8"
            },
            {
              "internalType": "bytes4[]",
              "name": "functionSelectors",
              "type": "bytes4[]"
            }
          ],
          "internalType": "struct IDiamondStorage.FacetCut[]",
          "name": "_faceCut",
          "type": "tuple[]"
        },
        {
          "internalType": "address",
          "name": "_init",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "_calldata",
          "type": "bytes"
        }
      ],
      "name": "diamondCut",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x1f931c1c"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "_functionSelector",
          "type": "bytes4"
        }
      ],
      "name": "facetAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "facetAddress_",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xcdffacc6"
    },
    {
      "inputs": [],
      "name": "facetAddresses",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "facetAddresses_",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x52ef6b2c"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_facet",
          "type": "address"
        }
      ],
      "name": "facetFunctionSelectors",
      "outputs": [
        {
          "internalType": "bytes4[]",
          "name": "facetFunctionSelectors_",
          "type": "bytes4[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xadfca15e"
    },
    {
      "inputs": [],
      "name": "facets",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "facetAddress",
              "type": "address"
            },
            {
              "internalType": "bytes4[]",
              "name": "functionSelectors",
              "type": "bytes4[]"
            }
          ],
          "internalType": "struct IGNSDiamondLoupe.Facet[]",
          "name": "facets_",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x7a0ed627"
    },
    {
      "inputs": [],
      "name": "getAddresses",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "gns",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "gnsStaking",
              "type": "address"
            }
          ],
          "internalType": "struct IAddressStore.Addresses",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xa39fac12"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "internalType": "enum IAddressStore.Role",
          "name": "_role",
          "type": "uint8"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x95a8c58d"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_rolesManager",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xc4d66de8"
    },
    {
      "inputs": [],
      "name": "lib_getAddressStoreUtilsSlot",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0xeb13a66f"
    },
    {
      "inputs": [
        {
          "internalType": "enum IAddressStore.Role",
          "name": "_role",
          "type": "uint8"
        }
      ],
      "name": "p_enforceRole",
      "outputs": [],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xde0eb118"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "internalType": "enum IAddressStore.Role",
          "name": "_role",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "_value",
          "type": "bool"
        }
      ],
      "name": "p_setRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x950c11be"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_accounts",
          "type": "address[]"
        },
        {
          "internalType": "enum IAddressStore.Role[]",
          "name": "_roles",
          "type": "uint8[]"
        },
        {
          "internalType": "bool[]",
          "name": "_values",
          "type": "bool[]"
        }
      ],
      "name": "setRoles",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x101e6503"
    },
    {
      "stateMutability": "payable",
      "type": "receive",
      "payable": true
    },
    {
      "inputs": [],
      "name": "FeeNotListed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "GroupNotListed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "Oops",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "PairAlreadyListed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "PairNotListed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongFees",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongLeverages",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "FeeAdded",
      "type": "event",
      "signature": "0x482049823c85e038e099fe4f2b901487c4800def71c9a3f5bae2de8381ec54f6"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "FeeUpdated",
      "type": "event",
      "signature": "0x8c4d35e54a3f2ef1134138fd8ea3daee6a3c89e10d2665996babdf70261e2c76"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "GroupAdded",
      "type": "event",
      "signature": "0xaf17de8e82beccc440012117a600dc37e26925225d0f1ee192fc107eb3dcbca4"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "GroupUpdated",
      "type": "event",
      "signature": "0xcfde8f228364c70f12cbbac5a88fc91ceca76dd750ac93364991a333b34afb8e"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "from",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "to",
          "type": "string"
        }
      ],
      "name": "PairAdded",
      "type": "event",
      "signature": "0x3adfd40f2b74073df2a84238acdb7f460565a557b3cc13bddc8833289bf38e09"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "maxLeverage",
          "type": "uint256"
        }
      ],
      "name": "PairCustomMaxLeverageUpdated",
      "type": "event",
      "signature": "0x5d6c9d6dd6c84fa315e799a455ccb71230e5b88e171c48c4853425ce044e9bce"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "PairUpdated",
      "type": "event",
      "signature": "0x123a1b961ae93e7acda9790b318237b175b45ac09277cd3614305d8baa3f1953"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "openFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "closeFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "oracleFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "triggerOrderFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minPositionSizeUsd",
              "type": "uint256"
            }
          ],
          "internalType": "struct IPairsStorage.Fee[]",
          "name": "_fees",
          "type": "tuple[]"
        }
      ],
      "name": "addFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x0c00b94a"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "bytes32",
              "name": "job",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "minLeverage",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxLeverage",
              "type": "uint256"
            }
          ],
          "internalType": "struct IPairsStorage.Group[]",
          "name": "_groups",
          "type": "tuple[]"
        }
      ],
      "name": "addGroups",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x60283cba"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "from",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "to",
              "type": "string"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "feed1",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "feed2",
                  "type": "address"
                },
                {
                  "internalType": "enum IPairsStorage.FeedCalculation",
                  "name": "feedCalculation",
                  "type": "uint8"
                },
                {
                  "internalType": "uint256",
                  "name": "maxDeviationP",
                  "type": "uint256"
                }
              ],
              "internalType": "struct IPairsStorage.Feed",
              "name": "feed",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "spreadP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "groupIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feeIndex",
              "type": "uint256"
            }
          ],
          "internalType": "struct IPairsStorage.Pair[]",
          "name": "_pairs",
          "type": "tuple[]"
        }
      ],
      "name": "addPairs",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xdb7c3f9d"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "fees",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "openFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "closeFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "oracleFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "triggerOrderFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minPositionSizeUsd",
              "type": "uint256"
            }
          ],
          "internalType": "struct IPairsStorage.Fee",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x4acc79ed"
    },
    {
      "inputs": [],
      "name": "feesCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x658de48a"
    },
    {
      "inputs": [],
      "name": "getAllPairsRestrictedMaxLeverage",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x678b3fb0"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "groups",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "bytes32",
              "name": "job",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "minLeverage",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxLeverage",
              "type": "uint256"
            }
          ],
          "internalType": "struct IPairsStorage.Group",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x96324bd4"
    },
    {
      "inputs": [],
      "name": "groupsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x885e2750"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        }
      ],
      "name": "isPairIndexListed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x281b7ead"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_from",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_to",
          "type": "string"
        }
      ],
      "name": "isPairListed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x1628bfeb"
    },
    {
      "inputs": [],
      "name": "lib_getPairsStorageUtilsSlot",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0xa4f20d57"
    },
    {
      "inputs": [],
      "name": "mock_revertInit",
      "outputs": [],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x3b3ef160"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        }
      ],
      "name": "pairCloseFeeP",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x836a341a"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        }
      ],
      "name": "pairCustomMaxLeverage",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x24a96865"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        }
      ],
      "name": "pairJob",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x302f81fc"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        }
      ],
      "name": "pairMaxLeverage",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x281b693c"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        }
      ],
      "name": "pairMinFeeUsd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x8078bfbe"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        }
      ],
      "name": "pairMinLeverage",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x59a992d0"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        }
      ],
      "name": "pairMinPositionSizeUsd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x5e26ff4e"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        }
      ],
      "name": "pairOpenFeeP",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x8251135b"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        }
      ],
      "name": "pairOracleFeeP",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xf7acbabd"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        }
      ],
      "name": "pairSpreadP",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xa1d54e9b"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        }
      ],
      "name": "pairTriggerOrderFeeP",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xe74aff72"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "pairs",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "from",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "to",
              "type": "string"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "feed1",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "feed2",
                  "type": "address"
                },
                {
                  "internalType": "enum IPairsStorage.FeedCalculation",
                  "name": "feedCalculation",
                  "type": "uint8"
                },
                {
                  "internalType": "uint256",
                  "name": "maxDeviationP",
                  "type": "uint256"
                }
              ],
              "internalType": "struct IPairsStorage.Feed",
              "name": "feed",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "spreadP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "groupIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feeIndex",
              "type": "uint256"
            }
          ],
          "internalType": "struct IPairsStorage.Pair",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xb91ac788"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "pairsBackend",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "from",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "to",
              "type": "string"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "feed1",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "feed2",
                  "type": "address"
                },
                {
                  "internalType": "enum IPairsStorage.FeedCalculation",
                  "name": "feedCalculation",
                  "type": "uint8"
                },
                {
                  "internalType": "uint256",
                  "name": "maxDeviationP",
                  "type": "uint256"
                }
              ],
              "internalType": "struct IPairsStorage.Feed",
              "name": "feed",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "spreadP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "groupIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feeIndex",
              "type": "uint256"
            }
          ],
          "internalType": "struct IPairsStorage.Pair",
          "name": "",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "bytes32",
              "name": "job",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "minLeverage",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxLeverage",
              "type": "uint256"
            }
          ],
          "internalType": "struct IPairsStorage.Group",
          "name": "",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "openFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "closeFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "oracleFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "triggerOrderFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minPositionSizeUsd",
              "type": "uint256"
            }
          ],
          "internalType": "struct IPairsStorage.Fee",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x9567dccf"
    },
    {
      "inputs": [],
      "name": "pairsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xb81b2b71"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_indices",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_values",
          "type": "uint256[]"
        }
      ],
      "name": "setPairCustomMaxLeverages",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xd79261fd"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_ids",
          "type": "uint256[]"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "openFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "closeFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "oracleFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "triggerOrderFeeP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minPositionSizeUsd",
              "type": "uint256"
            }
          ],
          "internalType": "struct IPairsStorage.Fee[]",
          "name": "_fees",
          "type": "tuple[]"
        }
      ],
      "name": "updateFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xe57f6759"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_ids",
          "type": "uint256[]"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "bytes32",
              "name": "job",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "minLeverage",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxLeverage",
              "type": "uint256"
            }
          ],
          "internalType": "struct IPairsStorage.Group[]",
          "name": "_groups",
          "type": "tuple[]"
        }
      ],
      "name": "updateGroups",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x11d79ef5"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_pairIndices",
          "type": "uint256[]"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "from",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "to",
              "type": "string"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "feed1",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "feed2",
                  "type": "address"
                },
                {
                  "internalType": "enum IPairsStorage.FeedCalculation",
                  "name": "feedCalculation",
                  "type": "uint8"
                },
                {
                  "internalType": "uint256",
                  "name": "maxDeviationP",
                  "type": "uint256"
                }
              ],
              "internalType": "struct IPairsStorage.Feed",
              "name": "feed",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "spreadP",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "groupIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feeIndex",
              "type": "uint256"
            }
          ],
          "internalType": "struct IPairsStorage.Pair[]",
          "name": "_pairs",
          "type": "tuple[]"
        }
      ],
      "name": "updatePairs",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x10efa5d5"
    },
    {
      "inputs": [],
      "name": "AllyNotActive",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AlreadyActive",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AlreadyInactive",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NoPendingRewards",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "ally",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "volumeUsd",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountGns",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountValueUsd",
          "type": "uint256"
        }
      ],
      "name": "AllyRewardDistributed",
      "type": "event",
      "signature": "0x0d54fedb563328d37f00fe5ba0bf7689519f8cf02318562adfe7b4bfab8cf4b4"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "ally",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountGns",
          "type": "uint256"
        }
      ],
      "name": "AllyRewardsClaimed",
      "type": "event",
      "signature": "0x3dfe9be199655709d01d635bf441264a809a090c98ed7aae9abdc85f7dcbc09d"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "ally",
          "type": "address"
        }
      ],
      "name": "AllyUnwhitelisted",
      "type": "event",
      "signature": "0x6900afc1a924abca16a7f560e2dac3d71008c1cd1d88de8a85b6e4267116d186"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "ally",
          "type": "address"
        }
      ],
      "name": "AllyWhitelisted",
      "type": "event",
      "signature": "0x80495287b7fdd5e00b7c8c1eb065c5b63474d11ffb062cc82c13da77dda8424d"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "referrer",
          "type": "address"
        }
      ],
      "name": "ReferrerRegistered",
      "type": "event",
      "signature": "0x0e67f4bbcd5c51b7365ca2dd861dc8094e393ca60de2ceae9d831761a839e92a"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "referrer",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "volumeUsd",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountGns",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountValueUsd",
          "type": "uint256"
        }
      ],
      "name": "ReferrerRewardDistributed",
      "type": "event",
      "signature": "0x74e9754b45c636e199e3d7bb764fae1a9acce47a984d10dcfd74849ec4babc4f"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "referrer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountGns",
          "type": "uint256"
        }
      ],
      "name": "ReferrerRewardsClaimed",
      "type": "event",
      "signature": "0x25deb48f8299e9863bda34f0d343d51341ac7ac30bf63dbeb2e8212bc4a20bf1"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "referrer",
          "type": "address"
        }
      ],
      "name": "ReferrerUnwhitelisted",
      "type": "event",
      "signature": "0x6dd169357c2e2b04fd13a8807a11892b88875b7c70eeb73c3b6642c58516f0db"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "referrer",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "ally",
          "type": "address"
        }
      ],
      "name": "ReferrerWhitelisted",
      "type": "event",
      "signature": "0x15ad1d28b052a6cc2dd1d34d9e06a1847055d520e2163017e6e8aad6431b7f6a"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "UpdatedAllyFeeP",
      "type": "event",
      "signature": "0x2f33e68d48a82acaa58e3dcb12a4c7738cdfe7041d35f0e29ec8c39b780b370c"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "UpdatedOpenFeeP",
      "type": "event",
      "signature": "0x4dec17ad9a229f707b7c2fb9531cd3b9c548f9eca80c03457ca38a0bb1df35fe"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "UpdatedStartReferrerFeeP",
      "type": "event",
      "signature": "0xb85b70acaeb40f1a2351367c48842ee0ea24ec05d411d99d80bf7a020c0dbb0f"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "UpdatedTargetVolumeUsd",
      "type": "event",
      "signature": "0x7e6042545b314fbe2e138616211d5c38934823f783b83a140ea84f0eb2ae115d"
    },
    {
      "inputs": [],
      "name": "claimAllyRewards",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xee6cf884"
    },
    {
      "inputs": [],
      "name": "claimReferrerRewards",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x65cbd307"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_volumeUsd",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_pairOpenFeeP",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_gnsPriceUsd",
          "type": "uint256"
        }
      ],
      "name": "distributeReferralReward",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xfa3c8dbf"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_ally",
          "type": "address"
        }
      ],
      "name": "getAllyDetails",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address[]",
              "name": "referrersReferred",
              "type": "address[]"
            },
            {
              "internalType": "uint256",
              "name": "volumeReferredUsd",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "pendingRewardsGns",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalRewardsGns",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalRewardsValueUsd",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            }
          ],
          "internalType": "struct IReferrals.AllyDetails",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x92e67406"
    },
    {
      "inputs": [],
      "name": "getReferralsAllyFeeP",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x97436b5f"
    },
    {
      "inputs": [],
      "name": "getReferralsOpenFeeP",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x06350917"
    },
    {
      "inputs": [],
      "name": "getReferralsStartReferrerFeeP",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x843b9e5d"
    },
    {
      "inputs": [],
      "name": "getReferralsTargetVolumeUsd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x71159fd1"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_referrer",
          "type": "address"
        }
      ],
      "name": "getReferrerDetails",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "ally",
              "type": "address"
            },
            {
              "internalType": "address[]",
              "name": "tradersReferred",
              "type": "address[]"
            },
            {
              "internalType": "uint256",
              "name": "volumeReferredUsd",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "pendingRewardsGns",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalRewardsGns",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalRewardsValueUsd",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            }
          ],
          "internalType": "struct IReferrals.ReferrerDetails",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xcbe0f32e"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairOpenFeeP",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_volumeReferredUsd",
          "type": "uint256"
        }
      ],
      "name": "getReferrerFeeP",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x4e583b31"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_ally",
          "type": "address"
        }
      ],
      "name": "getReferrersReferred",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xa73a3e35"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        }
      ],
      "name": "getTraderActiveReferrer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x036787e5"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        }
      ],
      "name": "getTraderLastReferrer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x46dbf572"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_referrer",
          "type": "address"
        }
      ],
      "name": "getTradersReferred",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x32a7b732"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_allyFeeP",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_startReferrerFeeP",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_openFeeP",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_targetVolumeUsd",
          "type": "uint256"
        }
      ],
      "name": "initializeReferrals",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xc8b0d710"
    },
    {
      "inputs": [],
      "name": "lib_getReferralsUtilsSlot",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x76eacb01"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_referrer",
          "type": "address"
        }
      ],
      "name": "registerPotentialReferrer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x9b8ab684"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_allies",
          "type": "address[]"
        }
      ],
      "name": "unwhitelistAllies",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x3450191e"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_referrers",
          "type": "address[]"
        }
      ],
      "name": "unwhitelistReferrers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x92b2bbae"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "updateAllyFeeP",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x97365b74"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "updateReferralsOpenFeeP",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xdfed4fcb"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "updateReferralsTargetVolumeUsd",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x66ddd309"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "updateStartReferrerFeeP",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x03e37464"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_allies",
          "type": "address[]"
        }
      ],
      "name": "whitelistAllies",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xc72d02e3"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_referrers",
          "type": "address[]"
        },
        {
          "internalType": "address[]",
          "name": "_allies",
          "type": "address[]"
        }
      ],
      "name": "whitelistReferrers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x507cd8de"
    },
    {
      "inputs": [],
      "name": "WrongFeeTier",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "feeTiersIndices",
          "type": "uint256[]"
        },
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "feeMultiplier",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "pointsThreshold",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct IFeeTiers.FeeTier[]",
          "name": "feeTiers",
          "type": "tuple[]"
        }
      ],
      "name": "FeeTiersUpdated",
      "type": "event",
      "signature": "0xa6ec87cc1a516d9ebb5c03260f77d2bd8c22dc8d28d71e740b320fbd4d704131"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "groupIndices",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "groupVolumeMultipliers",
          "type": "uint256[]"
        }
      ],
      "name": "GroupVolumeMultipliersUpdated",
      "type": "event",
      "signature": "0xb173e04a52e3de8d79b981e4ffc87d49e6577ceab559ebf36a70bba02cc2569c"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint32",
          "name": "day",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint224",
          "name": "points",
          "type": "uint224"
        }
      ],
      "name": "TraderDailyPointsIncreased",
      "type": "event",
      "signature": "0x4f6f49815b9e6682a4f6bc21ba0b5261e803cc5d56c97477a5dc75925fd74e68"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint32",
          "name": "day",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "feeMultiplier",
          "type": "uint32"
        }
      ],
      "name": "TraderFeeMultiplierCached",
      "type": "event",
      "signature": "0x136cc4347dc65b38625089ea9df2874eda024554dc7d0a363036d6fa6d7e4c9e"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "day",
          "type": "uint32"
        }
      ],
      "name": "TraderInfoFirstUpdate",
      "type": "event",
      "signature": "0x8aa104927dea7fb70b6e5eb2e2891e3022714eea9e80c493fdabffce48b42393"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "lastDayUpdated",
              "type": "uint32"
            },
            {
              "internalType": "uint224",
              "name": "trailingPoints",
              "type": "uint224"
            }
          ],
          "indexed": false,
          "internalType": "struct IFeeTiers.TraderInfo",
          "name": "traderInfo",
          "type": "tuple"
        }
      ],
      "name": "TraderInfoUpdated",
      "type": "event",
      "signature": "0x211bcdec669891da564d4d5bd35fa76cf6cc72a218db19f402ec042770fb83fb"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "fromDay",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "toDay",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint224",
          "name": "expiredPoints",
          "type": "uint224"
        }
      ],
      "name": "TraderTrailingPointsExpired",
      "type": "event",
      "signature": "0x964f0f6a92f6d7eedbff7670a2e850f5511e59321724a9dbef638c8068b7527b"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_normalFeeAmountCollateral",
          "type": "uint256"
        }
      ],
      "name": "calculateFeeAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x4f09a236"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_feeTierIndex",
          "type": "uint256"
        }
      ],
      "name": "getFeeTier",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "feeMultiplier",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "pointsThreshold",
              "type": "uint32"
            }
          ],
          "internalType": "struct IFeeTiers.FeeTier",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xeccea3e2"
    },
    {
      "inputs": [],
      "name": "getFeeTiersCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xa89db8e5"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "_day",
          "type": "uint32"
        }
      ],
      "name": "getFeeTiersTraderDailyInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "feeMultiplierCache",
              "type": "uint32"
            },
            {
              "internalType": "uint224",
              "name": "points",
              "type": "uint224"
            }
          ],
          "internalType": "struct IFeeTiers.TraderDailyInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x794d8520"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        }
      ],
      "name": "getFeeTiersTraderInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "lastDayUpdated",
              "type": "uint32"
            },
            {
              "internalType": "uint224",
              "name": "trailingPoints",
              "type": "uint224"
            }
          ],
          "internalType": "struct IFeeTiers.TraderInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xacbaaf33"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_groupIndex",
          "type": "uint256"
        }
      ],
      "name": "getGroupVolumeMultiplier",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x31ca4887"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_groupIndices",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_groupVolumeMultipliers",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_feeTiersIndices",
          "type": "uint256[]"
        },
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "feeMultiplier",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "pointsThreshold",
              "type": "uint32"
            }
          ],
          "internalType": "struct IFeeTiers.FeeTier[]",
          "name": "_feeTiers",
          "type": "tuple[]"
        }
      ],
      "name": "initializeFeeTiers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x33534de2"
    },
    {
      "inputs": [],
      "name": "lib_getCurrentDay",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xe9cd565d"
    },
    {
      "inputs": [],
      "name": "lib_getFeeTiersUtilsSlot",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x36bad1b9"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_feeTiersIndices",
          "type": "uint256[]"
        },
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "feeMultiplier",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "pointsThreshold",
              "type": "uint32"
            }
          ],
          "internalType": "struct IFeeTiers.FeeTier[]",
          "name": "_feeTiers",
          "type": "tuple[]"
        }
      ],
      "name": "setFeeTiers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xeced5249"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_groupIndices",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_groupVolumeMultipliers",
          "type": "uint256[]"
        }
      ],
      "name": "setGroupVolumeMultipliers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x944f577a"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_volumeUsd",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        }
      ],
      "name": "updateTraderPoints",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xfed8a190"
    },
    {
      "inputs": [],
      "name": "WrongWindowsCount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongWindowsDuration",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "maxLiqSpreadP",
          "type": "uint256"
        }
      ],
      "name": "MaxLiqSpreadPSet",
      "type": "event",
      "signature": "0x7e014e1b797f47ce3996c590b8c340b9dc5a8eca17bbd795043e2b29dca21bc8"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint48",
          "name": "windowsDuration",
          "type": "uint48"
        },
        {
          "indexed": true,
          "internalType": "uint48",
          "name": "windowsCount",
          "type": "uint48"
        }
      ],
      "name": "OiWindowsSettingsInitialized",
      "type": "event",
      "signature": "0x13a1cf276d620019ba08cdbba6c90fc281a94ee3481ea8aff3b514c8ab4d0ac2"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "pairIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint128",
          "name": "valueAboveUsd",
          "type": "uint128"
        },
        {
          "indexed": false,
          "internalType": "uint128",
          "name": "valueBelowUsd",
          "type": "uint128"
        }
      ],
      "name": "OnePercentDepthUpdated",
      "type": "event",
      "signature": "0x636bd42d4023c080480c167f471d64277a2a04d8f812420062908ace34475092"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "pairIndex",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint128",
              "name": "oiLongUsd",
              "type": "uint128"
            },
            {
              "internalType": "uint128",
              "name": "oiShortUsd",
              "type": "uint128"
            }
          ],
          "indexed": false,
          "internalType": "struct IPriceImpact.PairOi",
          "name": "totalPairOi",
          "type": "tuple"
        }
      ],
      "name": "PriceImpactOiTransferredPair",
      "type": "event",
      "signature": "0xbc0bf036cfe0e40ec07eeea05e96c6a78f2bc92a80f5d10b9179a2649e3bb717"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "pairsCount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "prevCurrentWindowId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "prevEarliestWindowId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newCurrentWindowId",
          "type": "uint256"
        }
      ],
      "name": "PriceImpactOiTransferredPairs",
      "type": "event",
      "signature": "0x73a54fbb7b96ef55a35eecf33a61c9ae379cbb38a4d6de352ee3e7c456211a22"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint48",
              "name": "windowsDuration",
              "type": "uint48"
            },
            {
              "internalType": "uint256",
              "name": "pairIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "windowId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "uint128",
              "name": "openInterestUsd",
              "type": "uint128"
            }
          ],
          "indexed": false,
          "internalType": "struct IPriceImpact.OiWindowUpdate",
          "name": "oiWindowUpdate",
          "type": "tuple"
        }
      ],
      "name": "PriceImpactOpenInterestAdded",
      "type": "event",
      "signature": "0xb8b5cf1c4a93075d32b38049f7ad65e6608d90f232123dd65d55a5ed06988cb5"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint48",
              "name": "windowsDuration",
              "type": "uint48"
            },
            {
              "internalType": "uint256",
              "name": "pairIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "windowId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "uint128",
              "name": "openInterestUsd",
              "type": "uint128"
            }
          ],
          "indexed": false,
          "internalType": "struct IPriceImpact.OiWindowUpdate",
          "name": "oiWindowUpdate",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "notOutdated",
          "type": "bool"
        }
      ],
      "name": "PriceImpactOpenInterestRemoved",
      "type": "event",
      "signature": "0xde1fe3df38229b603f1a7a96f1ac6159116b2a48dada12998a226039786f7ca6"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint48",
          "name": "windowsCount",
          "type": "uint48"
        }
      ],
      "name": "PriceImpactWindowsCountUpdated",
      "type": "event",
      "signature": "0xcd8ae5cbabd45f9918819404692cdffaab6769e8cf5a597405518a1b33419d71"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint48",
          "name": "windowsDuration",
          "type": "uint48"
        }
      ],
      "name": "PriceImpactWindowsDurationUpdated",
      "type": "event",
      "signature": "0x5c4b755bc1cf4bae3a95cfc185b1e390e2289a97933671d8a098a4131b020664"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "pairIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "protectionCloseFactor",
          "type": "uint256"
        }
      ],
      "name": "ProtectionCloseFactorUpdated",
      "type": "event",
      "signature": "0x91702eff4d91af5aaa0a65e6c7cd5893e9e354b77f408789116e6f18054bb611"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_openInterestUsd",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        }
      ],
      "name": "addPriceImpactOpenInterest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x96839490"
    },
    {
      "inputs": [],
      "name": "getMaxLiqSpreadP",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x3b589ec2"
    },
    {
      "inputs": [
        {
          "internalType": "uint48",
          "name": "_windowsDuration",
          "type": "uint48"
        },
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_windowId",
          "type": "uint256"
        }
      ],
      "name": "getOiWindow",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint128",
              "name": "oiLongUsd",
              "type": "uint128"
            },
            {
              "internalType": "uint128",
              "name": "oiShortUsd",
              "type": "uint128"
            }
          ],
          "internalType": "struct IPriceImpact.PairOi",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x823ef2ac"
    },
    {
      "inputs": [
        {
          "internalType": "uint48",
          "name": "_windowsDuration",
          "type": "uint48"
        },
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "_windowIds",
          "type": "uint256[]"
        }
      ],
      "name": "getOiWindows",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint128",
              "name": "oiLongUsd",
              "type": "uint128"
            },
            {
              "internalType": "uint128",
              "name": "oiShortUsd",
              "type": "uint128"
            }
          ],
          "internalType": "struct IPriceImpact.PairOi[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x0d12f7cb"
    },
    {
      "inputs": [],
      "name": "getOiWindowsSettings",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint48",
              "name": "startTs",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "windowsDuration",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "windowsCount",
              "type": "uint48"
            }
          ],
          "internalType": "struct IPriceImpact.OiWindowsSettings",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xb56df676"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        }
      ],
      "name": "getPairDepth",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint128",
              "name": "onePercentDepthAboveUsd",
              "type": "uint128"
            },
            {
              "internalType": "uint128",
              "name": "onePercentDepthBelowUsd",
              "type": "uint128"
            }
          ],
          "internalType": "struct IPriceImpact.PairDepth",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x375bb2bb"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_indices",
          "type": "uint256[]"
        }
      ],
      "name": "getPairDepths",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint128",
              "name": "onePercentDepthAboveUsd",
              "type": "uint128"
            },
            {
              "internalType": "uint128",
              "name": "onePercentDepthBelowUsd",
              "type": "uint128"
            }
          ],
          "internalType": "struct IPriceImpact.PairDepth[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x0d569f27"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        }
      ],
      "name": "getPriceImpactOi",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "activeOi",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xb6d92b02"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_indices",
          "type": "uint256[]"
        }
      ],
      "name": "getProtectionCloseFactors",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xf33fc605"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_openPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_tradeOpenInterestUsd",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_open",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_createdBlock",
          "type": "uint256"
        }
      ],
      "name": "getTradePriceImpact",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "priceImpactP",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "priceAfterImpact",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x7c785e6b"
    },
    {
      "inputs": [
        {
          "internalType": "uint48",
          "name": "_windowsDuration",
          "type": "uint48"
        },
        {
          "internalType": "uint48",
          "name": "_windowsCount",
          "type": "uint48"
        }
      ],
      "name": "initializePriceImpact",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x01d5664a"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint48",
              "name": "startTs",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "windowsDuration",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "windowsCount",
              "type": "uint48"
            }
          ],
          "internalType": "struct IPriceImpact.OiWindowsSettings",
          "name": "_settings",
          "type": "tuple"
        }
      ],
      "name": "lib_getCurrentWindowId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xc65891f0"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_currentWindowId",
          "type": "uint256"
        },
        {
          "internalType": "uint48",
          "name": "_windowsCount",
          "type": "uint48"
        }
      ],
      "name": "lib_getEarliestActiveWindowId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x85912e71"
    },
    {
      "inputs": [],
      "name": "lib_getPriceImpactUtilsSlot",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x8c89c0a9"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_openPrice",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_startOpenInterest",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tradeOpenInterest",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_onePercentDepth",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_protectionCloseFactor",
          "type": "uint256"
        }
      ],
      "name": "lib_getTradePriceImpact",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "priceImpactP",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "priceAfterImpact",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x1f8db46f"
    },
    {
      "inputs": [
        {
          "internalType": "uint48",
          "name": "_timestamp",
          "type": "uint48"
        },
        {
          "components": [
            {
              "internalType": "uint48",
              "name": "startTs",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "windowsDuration",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "windowsCount",
              "type": "uint48"
            }
          ],
          "internalType": "struct IPriceImpact.OiWindowsSettings",
          "name": "_settings",
          "type": "tuple"
        }
      ],
      "name": "lib_getWindowId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x203a3ebb"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_windowId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_currentWindowId",
          "type": "uint256"
        }
      ],
      "name": "lib_isWindowPotentiallyActive",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x94903868"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_openInterestUsd",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_pairIndex",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        },
        {
          "internalType": "uint48",
          "name": "_addTs",
          "type": "uint48"
        }
      ],
      "name": "removePriceImpactOpenInterest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xd01c9202"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_maxLiqSpreadP",
          "type": "uint256"
        }
      ],
      "name": "setMaxLiqSpreadP",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x19eddc64"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_indices",
          "type": "uint256[]"
        },
        {
          "internalType": "uint128[]",
          "name": "_depthsAboveUsd",
          "type": "uint128[]"
        },
        {
          "internalType": "uint128[]",
          "name": "_depthsBelowUsd",
          "type": "uint128[]"
        }
      ],
      "name": "setPairDepths",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x6474b399"
    },
    {
      "inputs": [
        {
          "internalType": "uint48",
          "name": "_newWindowsCount",
          "type": "uint48"
        }
      ],
      "name": "setPriceImpactWindowsCount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x10751b4f"
    },
    {
      "inputs": [
        {
          "internalType": "uint48",
          "name": "_newWindowsDuration",
          "type": "uint48"
        }
      ],
      "name": "setPriceImpactWindowsDuration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x39b0fc82"
    },
    {
      "inputs": [
        {
          "internalType": "uint16[]",
          "name": "_pairIndices",
          "type": "uint16[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_protectionCloseFactors",
          "type": "uint256[]"
        }
      ],
      "name": "setProtectionCloseFactors",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x928ca2f0"
    },
    {
      "inputs": [],
      "name": "CollateralAlreadyActive",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "CollateralAlreadyDisabled",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "MaxSlippageZero",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "MissingCollaterals",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TradeInfoCollateralPriceUsdZero",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TradeOpenPriceZero",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TradePairNotListed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TradePositionSizeZero",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TradeSlInvalid",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TradeTpInvalid",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateral",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "index",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "gToken",
          "type": "address"
        }
      ],
      "name": "CollateralAdded",
      "type": "event",
      "signature": "0xa02b5df63a0ca2660cbe23b5eb92c7f2ae514aee4a543a6032b38ef338865dbf"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "index",
          "type": "uint8"
        }
      ],
      "name": "CollateralDisabled",
      "type": "event",
      "signature": "0x09a6e6672fd5a685707eca1eeb3a3ef190ccf5ceaf9a78e410859f2d7983cc92"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "index",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        }
      ],
      "name": "CollateralUpdated",
      "type": "event",
      "signature": "0x98bbde8d067842c4760a76b32aebf2cd4feb8f07ddcf20d81c619c16f0242ecb"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateral",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "index",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "gToken",
          "type": "address"
        }
      ],
      "name": "GTokenUpdated",
      "type": "event",
      "signature": "0x347ad17cfe896bbbbdf75fa51fd03a1f1366df72ba0baf20ebed1ea1394a8ecd"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "tradeId",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "openPrice",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "tp",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "sl",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint16",
          "name": "maxSlippageP",
          "type": "uint16"
        }
      ],
      "name": "OpenOrderDetailsUpdated",
      "type": "event",
      "signature": "0x57166866105b85933cf7d2f84637e524028a4ca84133309f14b2ce0dfc113498"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "orderId",
          "type": "tuple"
        }
      ],
      "name": "PendingOrderClosed",
      "type": "event",
      "signature": "0xf0e19a36a85c073783ad5d0a8026dffa190d250d673c8c80b687cbef125571f3"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "index",
                  "type": "uint32"
                },
                {
                  "internalType": "uint16",
                  "name": "pairIndex",
                  "type": "uint16"
                },
                {
                  "internalType": "uint24",
                  "name": "leverage",
                  "type": "uint24"
                },
                {
                  "internalType": "bool",
                  "name": "long",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "isOpen",
                  "type": "bool"
                },
                {
                  "internalType": "uint8",
                  "name": "collateralIndex",
                  "type": "uint8"
                },
                {
                  "internalType": "enum ITradingStorage.TradeType",
                  "name": "tradeType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint120",
                  "name": "collateralAmount",
                  "type": "uint120"
                },
                {
                  "internalType": "uint64",
                  "name": "openPrice",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "tp",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "sl",
                  "type": "uint64"
                },
                {
                  "internalType": "uint192",
                  "name": "__placeholder",
                  "type": "uint192"
                }
              ],
              "internalType": "struct ITradingStorage.Trade",
              "name": "trade",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "enum ITradingStorage.PendingOrderType",
              "name": "orderType",
              "type": "uint8"
            },
            {
              "internalType": "uint32",
              "name": "createdBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "maxSlippageP",
              "type": "uint16"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.PendingOrder",
          "name": "pendingOrder",
          "type": "tuple"
        }
      ],
      "name": "PendingOrderStored",
      "type": "event",
      "signature": "0xc1f6d032e333e12d4ba1d8cdf8c4abc1bcaab7381a4eaa19a918a28f223f519d"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "tradeId",
          "type": "tuple"
        }
      ],
      "name": "TradeClosed",
      "type": "event",
      "signature": "0xedf2f9a86d6e2127c61aaaeb10a282ee4e0aa89ea19c7db37df80fece027a493"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "tradeId",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "uint120",
          "name": "collateralAmount",
          "type": "uint120"
        }
      ],
      "name": "TradeCollateralUpdated",
      "type": "event",
      "signature": "0xce228a7b1b8e239798e94cb2ba581d57501692fc1d29719a891125f1f393826d"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "tradeId",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "uint120",
          "name": "collateralAmount",
          "type": "uint120"
        },
        {
          "indexed": false,
          "internalType": "uint24",
          "name": "leverage",
          "type": "uint24"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "openPrice",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "newTp",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "newSl",
          "type": "uint64"
        }
      ],
      "name": "TradePositionUpdated",
      "type": "event",
      "signature": "0x39ede689b34cc36c8cf85698a4e83530eb6a29a07a57f0bfc3d02bfaca44edb5"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "tradeId",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "newSl",
          "type": "uint64"
        }
      ],
      "name": "TradeSlUpdated",
      "type": "event",
      "signature": "0x38f5d5d40d9c4a41aa03d21461f1b07aa6b4ef035fb9d21f02d53a82c712a002"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint24",
              "name": "leverage",
              "type": "uint24"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "enum ITradingStorage.TradeType",
              "name": "tradeType",
              "type": "uint8"
            },
            {
              "internalType": "uint120",
              "name": "collateralAmount",
              "type": "uint120"
            },
            {
              "internalType": "uint64",
              "name": "openPrice",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "tp",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "sl",
              "type": "uint64"
            },
            {
              "internalType": "uint192",
              "name": "__placeholder",
              "type": "uint192"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Trade",
          "name": "trade",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "createdBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "tpLastUpdatedBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "slLastUpdatedBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "maxSlippageP",
              "type": "uint16"
            },
            {
              "internalType": "uint48",
              "name": "lastOiUpdateTs",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "collateralPriceUsd",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "__placeholder",
              "type": "uint48"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.TradeInfo",
          "name": "tradeInfo",
          "type": "tuple"
        }
      ],
      "name": "TradeStored",
      "type": "event",
      "signature": "0xc7bc74b68a1f77466e2402a7ce12e5b172bdeef942334e0df67d522309257b90"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "tradeId",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "newTp",
          "type": "uint64"
        }
      ],
      "name": "TradeTpUpdated",
      "type": "event",
      "signature": "0x3d045f25e6a6757ae5ca79ce5d28d84d69713804353a02c521d6a5352c0f9e20"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "enum ITradingStorage.TradingActivated",
          "name": "activated",
          "type": "uint8"
        }
      ],
      "name": "TradingActivatedUpdated",
      "type": "event",
      "signature": "0x4b502c3b75c299352edc7887297ae0f7c401ed654650a4c0e663458b6ed75fe4"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_collateral",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_gToken",
          "type": "address"
        }
      ],
      "name": "addCollateral",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xc6783af1"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_orderId",
          "type": "tuple"
        }
      ],
      "name": "closePendingOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x4fb70bba"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_tradeId",
          "type": "tuple"
        }
      ],
      "name": "closeTrade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x8583909b"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_offset",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_limit",
          "type": "uint256"
        }
      ],
      "name": "getAllPendingOrders",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "index",
                  "type": "uint32"
                },
                {
                  "internalType": "uint16",
                  "name": "pairIndex",
                  "type": "uint16"
                },
                {
                  "internalType": "uint24",
                  "name": "leverage",
                  "type": "uint24"
                },
                {
                  "internalType": "bool",
                  "name": "long",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "isOpen",
                  "type": "bool"
                },
                {
                  "internalType": "uint8",
                  "name": "collateralIndex",
                  "type": "uint8"
                },
                {
                  "internalType": "enum ITradingStorage.TradeType",
                  "name": "tradeType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint120",
                  "name": "collateralAmount",
                  "type": "uint120"
                },
                {
                  "internalType": "uint64",
                  "name": "openPrice",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "tp",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "sl",
                  "type": "uint64"
                },
                {
                  "internalType": "uint192",
                  "name": "__placeholder",
                  "type": "uint192"
                }
              ],
              "internalType": "struct ITradingStorage.Trade",
              "name": "trade",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "enum ITradingStorage.PendingOrderType",
              "name": "orderType",
              "type": "uint8"
            },
            {
              "internalType": "uint32",
              "name": "createdBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "maxSlippageP",
              "type": "uint16"
            }
          ],
          "internalType": "struct ITradingStorage.PendingOrder[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x2d11445f"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_offset",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_limit",
          "type": "uint256"
        }
      ],
      "name": "getAllTradeInfos",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "createdBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "tpLastUpdatedBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "slLastUpdatedBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "maxSlippageP",
              "type": "uint16"
            },
            {
              "internalType": "uint48",
              "name": "lastOiUpdateTs",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "collateralPriceUsd",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "__placeholder",
              "type": "uint48"
            }
          ],
          "internalType": "struct ITradingStorage.TradeInfo[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xeb50287f"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_offset",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_limit",
          "type": "uint256"
        }
      ],
      "name": "getAllTrades",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint24",
              "name": "leverage",
              "type": "uint24"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "enum ITradingStorage.TradeType",
              "name": "tradeType",
              "type": "uint8"
            },
            {
              "internalType": "uint120",
              "name": "collateralAmount",
              "type": "uint120"
            },
            {
              "internalType": "uint64",
              "name": "openPrice",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "tp",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "sl",
              "type": "uint64"
            },
            {
              "internalType": "uint192",
              "name": "__placeholder",
              "type": "uint192"
            }
          ],
          "internalType": "struct ITradingStorage.Trade[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xdffd8a1f"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_index",
          "type": "uint8"
        }
      ],
      "name": "getCollateral",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "collateral",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint88",
              "name": "__placeholder",
              "type": "uint88"
            },
            {
              "internalType": "uint128",
              "name": "precision",
              "type": "uint128"
            },
            {
              "internalType": "uint128",
              "name": "precisionDelta",
              "type": "uint128"
            }
          ],
          "internalType": "struct ITradingStorage.Collateral",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xbb33a55b"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_collateral",
          "type": "address"
        }
      ],
      "name": "getCollateralIndex",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x5c3ed7c3"
    },
    {
      "inputs": [],
      "name": "getCollaterals",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "collateral",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint88",
              "name": "__placeholder",
              "type": "uint88"
            },
            {
              "internalType": "uint128",
              "name": "precision",
              "type": "uint128"
            },
            {
              "internalType": "uint128",
              "name": "precisionDelta",
              "type": "uint128"
            }
          ],
          "internalType": "struct ITradingStorage.Collateral[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x78b92636"
    },
    {
      "inputs": [],
      "name": "getCollateralsCount",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xa3e15d09"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        },
        {
          "internalType": "enum ITradingStorage.CounterType",
          "name": "_type",
          "type": "uint8"
        }
      ],
      "name": "getCounters",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "currentIndex",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "openCount",
              "type": "uint32"
            },
            {
              "internalType": "uint192",
              "name": "__placeholder",
              "type": "uint192"
            }
          ],
          "internalType": "struct ITradingStorage.Counter",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x0212f0d6"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        }
      ],
      "name": "getGToken",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x6a0aff41"
    },
    {
      "inputs": [
        {
          "internalType": "enum ITradingStorage.TradeType",
          "name": "_tradeType",
          "type": "uint8"
        }
      ],
      "name": "getPendingOpenOrderType",
      "outputs": [
        {
          "internalType": "enum ITradingStorage.PendingOrderType",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0xc8157967"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_orderId",
          "type": "tuple"
        }
      ],
      "name": "getPendingOrder",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "index",
                  "type": "uint32"
                },
                {
                  "internalType": "uint16",
                  "name": "pairIndex",
                  "type": "uint16"
                },
                {
                  "internalType": "uint24",
                  "name": "leverage",
                  "type": "uint24"
                },
                {
                  "internalType": "bool",
                  "name": "long",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "isOpen",
                  "type": "bool"
                },
                {
                  "internalType": "uint8",
                  "name": "collateralIndex",
                  "type": "uint8"
                },
                {
                  "internalType": "enum ITradingStorage.TradeType",
                  "name": "tradeType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint120",
                  "name": "collateralAmount",
                  "type": "uint120"
                },
                {
                  "internalType": "uint64",
                  "name": "openPrice",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "tp",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "sl",
                  "type": "uint64"
                },
                {
                  "internalType": "uint192",
                  "name": "__placeholder",
                  "type": "uint192"
                }
              ],
              "internalType": "struct ITradingStorage.Trade",
              "name": "trade",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "enum ITradingStorage.PendingOrderType",
              "name": "orderType",
              "type": "uint8"
            },
            {
              "internalType": "uint32",
              "name": "createdBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "maxSlippageP",
              "type": "uint16"
            }
          ],
          "internalType": "struct ITradingStorage.PendingOrder",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xc6e729bb"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getPendingOrders",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "index",
                  "type": "uint32"
                },
                {
                  "internalType": "uint16",
                  "name": "pairIndex",
                  "type": "uint16"
                },
                {
                  "internalType": "uint24",
                  "name": "leverage",
                  "type": "uint24"
                },
                {
                  "internalType": "bool",
                  "name": "long",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "isOpen",
                  "type": "bool"
                },
                {
                  "internalType": "uint8",
                  "name": "collateralIndex",
                  "type": "uint8"
                },
                {
                  "internalType": "enum ITradingStorage.TradeType",
                  "name": "tradeType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint120",
                  "name": "collateralAmount",
                  "type": "uint120"
                },
                {
                  "internalType": "uint64",
                  "name": "openPrice",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "tp",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "sl",
                  "type": "uint64"
                },
                {
                  "internalType": "uint192",
                  "name": "__placeholder",
                  "type": "uint192"
                }
              ],
              "internalType": "struct ITradingStorage.Trade",
              "name": "trade",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "enum ITradingStorage.PendingOrderType",
              "name": "orderType",
              "type": "uint8"
            },
            {
              "internalType": "uint32",
              "name": "createdBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "maxSlippageP",
              "type": "uint16"
            }
          ],
          "internalType": "struct ITradingStorage.PendingOrder[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x4c73cb25"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "_index",
          "type": "uint32"
        }
      ],
      "name": "getTrade",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint24",
              "name": "leverage",
              "type": "uint24"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "enum ITradingStorage.TradeType",
              "name": "tradeType",
              "type": "uint8"
            },
            {
              "internalType": "uint120",
              "name": "collateralAmount",
              "type": "uint120"
            },
            {
              "internalType": "uint64",
              "name": "openPrice",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "tp",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "sl",
              "type": "uint64"
            },
            {
              "internalType": "uint192",
              "name": "__placeholder",
              "type": "uint192"
            }
          ],
          "internalType": "struct ITradingStorage.Trade",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x15878e07"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "_index",
          "type": "uint32"
        }
      ],
      "name": "getTradeInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "createdBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "tpLastUpdatedBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "slLastUpdatedBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "maxSlippageP",
              "type": "uint16"
            },
            {
              "internalType": "uint48",
              "name": "lastOiUpdateTs",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "collateralPriceUsd",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "__placeholder",
              "type": "uint48"
            }
          ],
          "internalType": "struct ITradingStorage.TradeInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x75cd812d"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        }
      ],
      "name": "getTradeInfos",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "createdBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "tpLastUpdatedBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "slLastUpdatedBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "maxSlippageP",
              "type": "uint16"
            },
            {
              "internalType": "uint48",
              "name": "lastOiUpdateTs",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "collateralPriceUsd",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "__placeholder",
              "type": "uint48"
            }
          ],
          "internalType": "struct ITradingStorage.TradeInfo[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x0d1e3c94"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_tradeId",
          "type": "tuple"
        },
        {
          "internalType": "enum ITradingStorage.PendingOrderType",
          "name": "_orderType",
          "type": "uint8"
        }
      ],
      "name": "getTradePendingOrderBlock",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x067e84dd"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        }
      ],
      "name": "getTraderStored",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xbed8d2da"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_offset",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "_limit",
          "type": "uint32"
        }
      ],
      "name": "getTraders",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x0e503724"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        }
      ],
      "name": "getTrades",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint24",
              "name": "leverage",
              "type": "uint24"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "enum ITradingStorage.TradeType",
              "name": "tradeType",
              "type": "uint8"
            },
            {
              "internalType": "uint120",
              "name": "collateralAmount",
              "type": "uint120"
            },
            {
              "internalType": "uint64",
              "name": "openPrice",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "tp",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "sl",
              "type": "uint64"
            },
            {
              "internalType": "uint192",
              "name": "__placeholder",
              "type": "uint192"
            }
          ],
          "internalType": "struct ITradingStorage.Trade[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x4bfad7c0"
    },
    {
      "inputs": [],
      "name": "getTradingActivated",
      "outputs": [
        {
          "internalType": "enum ITradingStorage.TradingActivated",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x4115c122"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_gns",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_gnsStaking",
          "type": "address"
        },
        {
          "internalType": "address[]",
          "name": "_collaterals",
          "type": "address[]"
        },
        {
          "internalType": "address[]",
          "name": "_gTokens",
          "type": "address[]"
        }
      ],
      "name": "initializeTradingStorage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x1b7d88e5"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_index",
          "type": "uint8"
        }
      ],
      "name": "isCollateralActive",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x4d140218"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_index",
          "type": "uint8"
        }
      ],
      "name": "isCollateralListed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x1d2ffb42"
    },
    {
      "inputs": [],
      "name": "lib_getBlockNumber",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xbe6d4ea9"
    },
    {
      "inputs": [],
      "name": "lib_getTradingStorageSlot",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x49fb4038"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_openPrice",
          "type": "uint64"
        },
        {
          "internalType": "uint24",
          "name": "_leverage",
          "type": "uint24"
        },
        {
          "internalType": "uint64",
          "name": "_sl",
          "type": "uint64"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        }
      ],
      "name": "lib_limitSlDistance",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x8a4e1905"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_openPrice",
          "type": "uint64"
        },
        {
          "internalType": "uint24",
          "name": "_leverage",
          "type": "uint24"
        },
        {
          "internalType": "uint64",
          "name": "_tp",
          "type": "uint64"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        }
      ],
      "name": "lib_limitTpDistance",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x73b5bd91"
    },
    {
      "inputs": [],
      "name": "mock_getTradersArray",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x50824e39"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_tradeId",
          "type": "tuple"
        }
      ],
      "name": "mock_removeTradeTp",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xb2171770"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_orderId",
          "type": "tuple"
        },
        {
          "internalType": "bool",
          "name": "newValue",
          "type": "bool"
        }
      ],
      "name": "mock_setPendingOrderIsOpen",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x5f0ef75b"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_tradeId",
          "type": "tuple"
        },
        {
          "internalType": "bool",
          "name": "newValue",
          "type": "bool"
        }
      ],
      "name": "mock_setTradeIsOpen",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x29938039"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "index",
                  "type": "uint32"
                },
                {
                  "internalType": "uint16",
                  "name": "pairIndex",
                  "type": "uint16"
                },
                {
                  "internalType": "uint24",
                  "name": "leverage",
                  "type": "uint24"
                },
                {
                  "internalType": "bool",
                  "name": "long",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "isOpen",
                  "type": "bool"
                },
                {
                  "internalType": "uint8",
                  "name": "collateralIndex",
                  "type": "uint8"
                },
                {
                  "internalType": "enum ITradingStorage.TradeType",
                  "name": "tradeType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint120",
                  "name": "collateralAmount",
                  "type": "uint120"
                },
                {
                  "internalType": "uint64",
                  "name": "openPrice",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "tp",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "sl",
                  "type": "uint64"
                },
                {
                  "internalType": "uint192",
                  "name": "__placeholder",
                  "type": "uint192"
                }
              ],
              "internalType": "struct ITradingStorage.Trade",
              "name": "trade",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "enum ITradingStorage.PendingOrderType",
              "name": "orderType",
              "type": "uint8"
            },
            {
              "internalType": "uint32",
              "name": "createdBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "maxSlippageP",
              "type": "uint16"
            }
          ],
          "internalType": "struct ITradingStorage.PendingOrder",
          "name": "_pendingOrder",
          "type": "tuple"
        }
      ],
      "name": "storePendingOrder",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "index",
                  "type": "uint32"
                },
                {
                  "internalType": "uint16",
                  "name": "pairIndex",
                  "type": "uint16"
                },
                {
                  "internalType": "uint24",
                  "name": "leverage",
                  "type": "uint24"
                },
                {
                  "internalType": "bool",
                  "name": "long",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "isOpen",
                  "type": "bool"
                },
                {
                  "internalType": "uint8",
                  "name": "collateralIndex",
                  "type": "uint8"
                },
                {
                  "internalType": "enum ITradingStorage.TradeType",
                  "name": "tradeType",
                  "type": "uint8"
                },
                {
                  "internalType": "uint120",
                  "name": "collateralAmount",
                  "type": "uint120"
                },
                {
                  "internalType": "uint64",
                  "name": "openPrice",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "tp",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "sl",
                  "type": "uint64"
                },
                {
                  "internalType": "uint192",
                  "name": "__placeholder",
                  "type": "uint192"
                }
              ],
              "internalType": "struct ITradingStorage.Trade",
              "name": "trade",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "enum ITradingStorage.PendingOrderType",
              "name": "orderType",
              "type": "uint8"
            },
            {
              "internalType": "uint32",
              "name": "createdBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "maxSlippageP",
              "type": "uint16"
            }
          ],
          "internalType": "struct ITradingStorage.PendingOrder",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x93f9384e"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint24",
              "name": "leverage",
              "type": "uint24"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "enum ITradingStorage.TradeType",
              "name": "tradeType",
              "type": "uint8"
            },
            {
              "internalType": "uint120",
              "name": "collateralAmount",
              "type": "uint120"
            },
            {
              "internalType": "uint64",
              "name": "openPrice",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "tp",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "sl",
              "type": "uint64"
            },
            {
              "internalType": "uint192",
              "name": "__placeholder",
              "type": "uint192"
            }
          ],
          "internalType": "struct ITradingStorage.Trade",
          "name": "_trade",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "createdBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "tpLastUpdatedBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "slLastUpdatedBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "maxSlippageP",
              "type": "uint16"
            },
            {
              "internalType": "uint48",
              "name": "lastOiUpdateTs",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "collateralPriceUsd",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "__placeholder",
              "type": "uint48"
            }
          ],
          "internalType": "struct ITradingStorage.TradeInfo",
          "name": "_tradeInfo",
          "type": "tuple"
        }
      ],
      "name": "storeTrade",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint24",
              "name": "leverage",
              "type": "uint24"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "enum ITradingStorage.TradeType",
              "name": "tradeType",
              "type": "uint8"
            },
            {
              "internalType": "uint120",
              "name": "collateralAmount",
              "type": "uint120"
            },
            {
              "internalType": "uint64",
              "name": "openPrice",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "tp",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "sl",
              "type": "uint64"
            },
            {
              "internalType": "uint192",
              "name": "__placeholder",
              "type": "uint192"
            }
          ],
          "internalType": "struct ITradingStorage.Trade",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x9f30b640"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        }
      ],
      "name": "toggleCollateralActiveState",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x49f7895b"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_collateral",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_gToken",
          "type": "address"
        }
      ],
      "name": "updateGToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x63450d74"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_tradeId",
          "type": "tuple"
        },
        {
          "internalType": "uint64",
          "name": "_openPrice",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "_tp",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "_sl",
          "type": "uint64"
        },
        {
          "internalType": "uint16",
          "name": "_maxSlippageP",
          "type": "uint16"
        }
      ],
      "name": "updateOpenOrderDetails",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xeb2dfde8"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_tradeId",
          "type": "tuple"
        },
        {
          "internalType": "uint120",
          "name": "_collateralAmount",
          "type": "uint120"
        }
      ],
      "name": "updateTradeCollateralAmount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x5a68200d"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_tradeId",
          "type": "tuple"
        },
        {
          "internalType": "uint120",
          "name": "_collateralAmount",
          "type": "uint120"
        },
        {
          "internalType": "uint24",
          "name": "_leverage",
          "type": "uint24"
        },
        {
          "internalType": "uint64",
          "name": "_openPrice",
          "type": "uint64"
        }
      ],
      "name": "updateTradePosition",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x7281d8f8"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_tradeId",
          "type": "tuple"
        },
        {
          "internalType": "uint64",
          "name": "_newSl",
          "type": "uint64"
        }
      ],
      "name": "updateTradeSl",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x1053c279"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_tradeId",
          "type": "tuple"
        },
        {
          "internalType": "uint64",
          "name": "_newTp",
          "type": "uint64"
        }
      ],
      "name": "updateTradeTp",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xb8f741d4"
    },
    {
      "inputs": [
        {
          "internalType": "enum ITradingStorage.TradingActivated",
          "name": "_activated",
          "type": "uint8"
        }
      ],
      "name": "updateTradingActivated",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xb78f4b36"
    },
    {
      "inputs": [],
      "name": "NoPendingTriggerRewards",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TimeoutBlocksZero",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rewardsPerOracleGns",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "oraclesCount",
          "type": "uint256"
        }
      ],
      "name": "TriggerRewarded",
      "type": "event",
      "signature": "0x82bfbe6a1c6cb1077af1001e76028d28d03bf40ac393b689ea90d22e10d3f2da"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "oracle",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rewardsGns",
          "type": "uint256"
        }
      ],
      "name": "TriggerRewardsClaimed",
      "type": "event",
      "signature": "0x0e430d4d92cf840e4840d7defc88d12f7b5d7e45222f5d571914c734e1cc8335"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint16",
          "name": "timeoutBlocks",
          "type": "uint16"
        }
      ],
      "name": "TriggerTimeoutBlocksUpdated",
      "type": "event",
      "signature": "0x652d3f2e78702ea06eebce1653dfcd9731f4d9888a0032700b1b7b0b051ad6b8"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_oracle",
          "type": "address"
        }
      ],
      "name": "claimPendingTriggerRewards",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x63790a1b"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_rewardGns",
          "type": "uint256"
        }
      ],
      "name": "distributeTriggerReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x69f5395e"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_oracle",
          "type": "address"
        }
      ],
      "name": "getTriggerPendingRewardsGns",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x9fd0bdad"
    },
    {
      "inputs": [],
      "name": "getTriggerTimeoutBlocks",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x1187f9bd"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_orderBlock",
          "type": "uint256"
        }
      ],
      "name": "hasActiveOrder",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x8765f772"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "_timeoutBlocks",
          "type": "uint16"
        }
      ],
      "name": "initializeTriggerRewards",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xe2c3542b"
    },
    {
      "inputs": [],
      "name": "lib_getTriggerRewardsSlot",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x38e58a87"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "_timeoutBlocks",
          "type": "uint16"
        }
      ],
      "name": "updateTriggerTimeoutBlocks",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x9e353611"
    },
    {
      "inputs": [],
      "name": "AboveExposureLimits",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AlreadyBeingMarketClosed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "CollateralNotActive",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "enum ITradingStorage.PendingOrderType",
          "name": "",
          "type": "uint8"
        }
      ],
      "name": "ConflictingPendingOrder",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "DelegateNotApproved",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "DelegatedActionNotAllowed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InsufficientCollateral",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidDecreasePositionSizeInput",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidIncreasePositionSizeInput",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NewPositionSizeSmaller",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NoOrder",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NoSl",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NoTp",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NoTrade",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotWrappedNativeToken",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotYourOrder",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "PendingTrigger",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "PriceImpactTooHigh",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "PriceZero",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WaitTimeout",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongLeverage",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongOrderType",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongSl",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongTp",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "bypass",
          "type": "bool"
        }
      ],
      "name": "ByPassTriggerLinkUpdated",
      "type": "event",
      "signature": "0x06e17fbb36333cd9cb0220b0e3cb4ce4d9d6b543f762e8ca6038422e24fa59e4"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "pendingOrderId",
          "type": "tuple"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "pairIndex",
          "type": "uint256"
        }
      ],
      "name": "ChainlinkCallbackTimeout",
      "type": "event",
      "signature": "0x3f709185dd46048fccc37c6e34d58fff306fc7991fdbae962679345db3ed2e32"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "pairIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "index",
          "type": "uint32"
        }
      ],
      "name": "CouldNotCloseTrade",
      "type": "event",
      "signature": "0x051ed9aeed13c97b879c0dd2b13c76171e2760abe3d62bca140dc70b39bd86f1"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "orderId",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isIncrease",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "enum ITradingCallbacks.CancelReason",
          "name": "cancelReason",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "pairIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "marketPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newCollateralAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newLeverage",
          "type": "uint256"
        }
      ],
      "name": "LeverageUpdateExecuted",
      "type": "event",
      "signature": "0x86c87db52066d430920bbeddb2de10ec29ed93483c3826636febefc305d84f28"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "orderId",
          "type": "tuple"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "pairIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isIncrease",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newLeverage",
          "type": "uint256"
        }
      ],
      "name": "LeverageUpdateInitiated",
      "type": "event",
      "signature": "0xf4181f0fa2e1d3cda20bb810e0427d87916eb5dac8c73a7f779ae13e55ec578f"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "orderId",
          "type": "tuple"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "pairIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "open",
          "type": "bool"
        }
      ],
      "name": "MarketOrderInitiated",
      "type": "event",
      "signature": "0x3a60290d7335bce64a807e90f39655517bb5fa702423fa8fac283a5ea16d3a97"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newValueBlocks",
          "type": "uint256"
        }
      ],
      "name": "MarketOrdersTimeoutBlocksUpdated",
      "type": "event",
      "signature": "0x91e136d1ad9bf0a586afd0c7699533d033f9092cc48c9e2e16a8c1bc87a33456"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nativeTokenAmount",
          "type": "uint256"
        }
      ],
      "name": "NativeTokenWrapped",
      "type": "event",
      "signature": "0x4140bfb1a8c58243a51a8ab319eda78a7382befc5ff76598e746df60996b9d0d"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "pairIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "index",
          "type": "uint32"
        }
      ],
      "name": "OpenLimitCanceled",
      "type": "event",
      "signature": "0x30a872d1bbd3e31dbb65ce3a53ede9f12b497e1b134c66e64a10f850c4391bf0"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "pairIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "index",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "newPrice",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "newTp",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "newSl",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "maxSlippageP",
          "type": "uint64"
        }
      ],
      "name": "OpenLimitUpdated",
      "type": "event",
      "signature": "0x11c151b754cb223cb771e3d8ece99deae21de397c95d3b1ca4ccb995620766bf"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "pairIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "index",
          "type": "uint32"
        }
      ],
      "name": "OpenOrderPlaced",
      "type": "event",
      "signature": "0xb57382e21e3ceb31b5beda26d7cc7e459dc52a0b1f5ae0c9b4e603401b7dc642"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "orderId",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isIncrease",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "enum ITradingCallbacks.CancelReason",
          "name": "cancelReason",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "pairIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "marketPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newCollateralAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newLeverage",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newOpenPrice",
          "type": "uint256"
        }
      ],
      "name": "PositionSizeUpdateExecuted",
      "type": "event",
      "signature": "0xb91078837a89d1fbf08b82096aa5bcb9c7f336e359bb95d47b812fe214079f58"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "orderId",
          "type": "tuple"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "pairIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isIncrease",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "collateralDelta",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "leverageDelta",
          "type": "uint256"
        }
      ],
      "name": "PositionSizeUpdateInitiated",
      "type": "event",
      "signature": "0xef86ff293bce1d37f4b09f9c27b48f752d86a9fde1109f1bd8b806e05e7bada5"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "orderId",
          "type": "tuple"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "pairIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "byPassesLinkCost",
          "type": "bool"
        }
      ],
      "name": "TriggerOrderInitiated",
      "type": "event",
      "signature": "0x1472b674eddef9a7145c9353c62f5c03cfcf54556c14c3a0ebbf394da6e0c9ea"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_index",
          "type": "uint32"
        }
      ],
      "name": "cancelOpenOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x85886333"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_orderIndex",
          "type": "uint32"
        }
      ],
      "name": "cancelOrderAfterTimeout",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xb6919540"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_index",
          "type": "uint32"
        }
      ],
      "name": "closeTradeMarket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xbdb340cd"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_index",
          "type": "uint32"
        },
        {
          "internalType": "uint120",
          "name": "_collateralDelta",
          "type": "uint120"
        },
        {
          "internalType": "uint24",
          "name": "_leverageDelta",
          "type": "uint24"
        }
      ],
      "name": "decreasePositionSize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x69f6bde1"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "_callData",
          "type": "bytes"
        }
      ],
      "name": "delegatedTradingAction",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x737b84cd"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getByPassTriggerLink",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x85898e08"
    },
    {
      "inputs": [],
      "name": "getMarketOrdersTimeoutBlocks",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xa4bdee80"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        }
      ],
      "name": "getTradingDelegate",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x4aac6480"
    },
    {
      "inputs": [],
      "name": "getWrappedNativeToken",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x1d9478b6"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_index",
          "type": "uint32"
        },
        {
          "internalType": "uint120",
          "name": "_collateralDelta",
          "type": "uint120"
        },
        {
          "internalType": "uint24",
          "name": "_leverageDelta",
          "type": "uint24"
        },
        {
          "internalType": "uint64",
          "name": "_expectedPrice",
          "type": "uint64"
        },
        {
          "internalType": "uint16",
          "name": "_maxSlippageP",
          "type": "uint16"
        }
      ],
      "name": "increasePositionSize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x24058ad3"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "_marketOrdersTimeoutBlocks",
          "type": "uint16"
        },
        {
          "internalType": "address[]",
          "name": "_usersByPassTriggerLink",
          "type": "address[]"
        }
      ],
      "name": "initializeTrading",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x5179cecf"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "isWrappedNativeToken",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x84e93347"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_tradeId",
          "type": "tuple"
        },
        {
          "internalType": "enum ITradingStorage.PendingOrderType",
          "name": "_orderType",
          "type": "uint8"
        }
      ],
      "name": "lib_checkNoPendingTrigger",
      "outputs": [],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x3899bf4e"
    },
    {
      "inputs": [],
      "name": "lib_getTradingUtilsSlot",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x692466ac"
    },
    {
      "inputs": [],
      "name": "lib_msgSender",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x9a14188b"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint24",
              "name": "leverage",
              "type": "uint24"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "enum ITradingStorage.TradeType",
              "name": "tradeType",
              "type": "uint8"
            },
            {
              "internalType": "uint120",
              "name": "collateralAmount",
              "type": "uint120"
            },
            {
              "internalType": "uint64",
              "name": "openPrice",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "tp",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "sl",
              "type": "uint64"
            },
            {
              "internalType": "uint192",
              "name": "__placeholder",
              "type": "uint192"
            }
          ],
          "internalType": "struct ITradingStorage.Trade",
          "name": "_trade",
          "type": "tuple"
        },
        {
          "internalType": "uint16",
          "name": "_maxSlippageP",
          "type": "uint16"
        },
        {
          "internalType": "address",
          "name": "_referrer",
          "type": "address"
        }
      ],
      "name": "openTrade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x4465c3e4"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint24",
              "name": "leverage",
              "type": "uint24"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "enum ITradingStorage.TradeType",
              "name": "tradeType",
              "type": "uint8"
            },
            {
              "internalType": "uint120",
              "name": "collateralAmount",
              "type": "uint120"
            },
            {
              "internalType": "uint64",
              "name": "openPrice",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "tp",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "sl",
              "type": "uint64"
            },
            {
              "internalType": "uint192",
              "name": "__placeholder",
              "type": "uint192"
            }
          ],
          "internalType": "struct ITradingStorage.Trade",
          "name": "_trade",
          "type": "tuple"
        },
        {
          "internalType": "uint16",
          "name": "_maxSlippageP",
          "type": "uint16"
        },
        {
          "internalType": "address",
          "name": "_referrer",
          "type": "address"
        }
      ],
      "name": "openTradeNative",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true,
      "signature": "0x080e83e1"
    },
    {
      "inputs": [],
      "name": "removeTradingDelegate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x031c722b"
    },
    {
      "inputs": [],
      "name": "revertSilently",
      "outputs": [],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x215d0afd"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_delegate",
          "type": "address"
        }
      ],
      "name": "setTradingDelegate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x604755cf"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_packed",
          "type": "uint256"
        }
      ],
      "name": "triggerOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xeb9359aa"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_users",
          "type": "address[]"
        },
        {
          "internalType": "bool[]",
          "name": "_shouldByPass",
          "type": "bool[]"
        }
      ],
      "name": "updateByPassTriggerLink",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x9bf1584e"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_index",
          "type": "uint32"
        },
        {
          "internalType": "uint24",
          "name": "_newLeverage",
          "type": "uint24"
        }
      ],
      "name": "updateLeverage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x0bce9aaa"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "_valueBlocks",
          "type": "uint16"
        }
      ],
      "name": "updateMarketOrdersTimeoutBlocks",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x52d029d2"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_index",
          "type": "uint32"
        },
        {
          "internalType": "uint64",
          "name": "_triggerPrice",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "_tp",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "_sl",
          "type": "uint64"
        },
        {
          "internalType": "uint16",
          "name": "_maxSlippageP",
          "type": "uint16"
        }
      ],
      "name": "updateOpenOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xa4bb127e"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_index",
          "type": "uint32"
        },
        {
          "internalType": "uint64",
          "name": "_newSl",
          "type": "uint64"
        }
      ],
      "name": "updateSl",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xb5d9e9d0"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_index",
          "type": "uint32"
        },
        {
          "internalType": "uint64",
          "name": "_newTp",
          "type": "uint64"
        }
      ],
      "name": "updateTp",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xf401f2bb"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountCollateral",
          "type": "uint256"
        }
      ],
      "name": "BorrowingFeeCharged",
      "type": "event",
      "signature": "0x2aac04047becf1d92defe3c1ee644bdd7b50ae634a7e5ebfca84c2be3fc63344"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountCollateral",
          "type": "uint256"
        }
      ],
      "name": "GTokenFeeCharged",
      "type": "event",
      "signature": "0xfe4ab97508a97bb85ad1e2680662e58549e51982d965eed4ef6d7fcd4cc4295f"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountCollateral",
          "type": "uint256"
        }
      ],
      "name": "GnsStakingFeeCharged",
      "type": "event",
      "signature": "0x8e4c272f039ef17bb8cb5a5bc5d6f0cebf9c5037dceae9528bb05b0c4f5a7b80"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountCollateral",
          "type": "uint256"
        }
      ],
      "name": "GovFeeCharged",
      "type": "event",
      "signature": "0xeb561f0609b402569e8a7e8fe9d4f408b92c96fb83001b2cd78fd55c29bbbac3"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "orderId",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint24",
              "name": "leverage",
              "type": "uint24"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "enum ITradingStorage.TradeType",
              "name": "tradeType",
              "type": "uint8"
            },
            {
              "internalType": "uint120",
              "name": "collateralAmount",
              "type": "uint120"
            },
            {
              "internalType": "uint64",
              "name": "openPrice",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "tp",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "sl",
              "type": "uint64"
            },
            {
              "internalType": "uint192",
              "name": "__placeholder",
              "type": "uint192"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Trade",
          "name": "t",
          "type": "tuple"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "triggerCaller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum ITradingStorage.PendingOrderType",
          "name": "orderType",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "priceImpactP",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "percentProfit",
          "type": "int256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountSentToTrader",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "collateralPriceUsd",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "exactExecution",
          "type": "bool"
        }
      ],
      "name": "LimitExecuted",
      "type": "event",
      "signature": "0xc10f67c0e22c53149183a414c16a62334103432a2c48b839a057cd9bd5fdeb99"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "orderId",
          "type": "tuple"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "pairIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum ITradingCallbacks.CancelReason",
          "name": "cancelReason",
          "type": "uint8"
        }
      ],
      "name": "MarketCloseCanceled",
      "type": "event",
      "signature": "0x1d7048e18d77f0864147aec27ae4b78d421fe35ddde1ea0ec535562c4a90cc58"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "orderId",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint24",
              "name": "leverage",
              "type": "uint24"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "enum ITradingStorage.TradeType",
              "name": "tradeType",
              "type": "uint8"
            },
            {
              "internalType": "uint120",
              "name": "collateralAmount",
              "type": "uint120"
            },
            {
              "internalType": "uint64",
              "name": "openPrice",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "tp",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "sl",
              "type": "uint64"
            },
            {
              "internalType": "uint192",
              "name": "__placeholder",
              "type": "uint192"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Trade",
          "name": "t",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "open",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "price",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "priceImpactP",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "percentProfit",
          "type": "int256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountSentToTrader",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "collateralPriceUsd",
          "type": "uint256"
        }
      ],
      "name": "MarketExecuted",
      "type": "event",
      "signature": "0xbbd5cfa7b4ec0d44d4155fcaad32af9cf7e65799d6b8b08f233b930de7bcd9a8"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "orderId",
          "type": "tuple"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "pairIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum ITradingCallbacks.CancelReason",
          "name": "cancelReason",
          "type": "uint8"
        }
      ],
      "name": "MarketOpenCanceled",
      "type": "event",
      "signature": "0x377325122a5a86014bf0a307dc0c8eab0bf1e2858ff6e1522a7551e6df253782"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountCollateral",
          "type": "uint256"
        }
      ],
      "name": "PendingGovFeesClaimed",
      "type": "event",
      "signature": "0x0b92b2d73b4c8443d11985dbf6a8cfdfc03b93d6679aab94b7d4fb5842dd0cb0"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountCollateral",
          "type": "uint256"
        }
      ],
      "name": "ReferralFeeCharged",
      "type": "event",
      "signature": "0x264425c9f39f6b517f96e5447a9347098bfbe112753fada5068de9fdf6d5168c"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountCollateral",
          "type": "uint256"
        }
      ],
      "name": "TriggerFeeCharged",
      "type": "event",
      "signature": "0x9460073dee9bbc6b4566aae39b3ec7308696e65ec5d376434076d72afabe3eba"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "orderId",
          "type": "tuple"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "triggerCaller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum ITradingStorage.PendingOrderType",
          "name": "orderType",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "enum ITradingCallbacks.CancelReason",
          "name": "cancelReason",
          "type": "uint8"
        }
      ],
      "name": "TriggerOrderCanceled",
      "type": "event",
      "signature": "0x0766d5a97748cddd280198f717da563fe9aad4d38e5bd546fe56d04fbc68a3cd"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "valueP",
          "type": "uint8"
        }
      ],
      "name": "VaultClosingFeePUpdated",
      "type": "event",
      "signature": "0x1be5a8e0282c1b895f845900a8efe7585790659f1b4f062f17000e2712dd8601"
    },
    {
      "inputs": [],
      "name": "claimPendingGovFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x36c3dba2"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "index",
                  "type": "uint32"
                }
              ],
              "internalType": "struct ITradingStorage.Id",
              "name": "orderId",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "spreadP",
              "type": "uint256"
            },
            {
              "internalType": "uint64",
              "name": "price",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "open",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "high",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "low",
              "type": "uint64"
            }
          ],
          "internalType": "struct ITradingCallbacks.AggregatorAnswer",
          "name": "_a",
          "type": "tuple"
        }
      ],
      "name": "closeTradeMarketCallback",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x4b0b5629"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "index",
                  "type": "uint32"
                }
              ],
              "internalType": "struct ITradingStorage.Id",
              "name": "orderId",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "spreadP",
              "type": "uint256"
            },
            {
              "internalType": "uint64",
              "name": "price",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "open",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "high",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "low",
              "type": "uint64"
            }
          ],
          "internalType": "struct ITradingCallbacks.AggregatorAnswer",
          "name": "_a",
          "type": "tuple"
        }
      ],
      "name": "decreasePositionSizeMarketCallback",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xe1d88718"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "index",
                  "type": "uint32"
                }
              ],
              "internalType": "struct ITradingStorage.Id",
              "name": "orderId",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "spreadP",
              "type": "uint256"
            },
            {
              "internalType": "uint64",
              "name": "price",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "open",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "high",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "low",
              "type": "uint64"
            }
          ],
          "internalType": "struct ITradingCallbacks.AggregatorAnswer",
          "name": "_a",
          "type": "tuple"
        }
      ],
      "name": "executeTriggerCloseOrderCallback",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xc61a7ad4"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "index",
                  "type": "uint32"
                }
              ],
              "internalType": "struct ITradingStorage.Id",
              "name": "orderId",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "spreadP",
              "type": "uint256"
            },
            {
              "internalType": "uint64",
              "name": "price",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "open",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "high",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "low",
              "type": "uint64"
            }
          ],
          "internalType": "struct ITradingCallbacks.AggregatorAnswer",
          "name": "_a",
          "type": "tuple"
        }
      ],
      "name": "executeTriggerOpenOrderCallback",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x3b0c5938"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        }
      ],
      "name": "getPendingGovFeesCollateral",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x2c6fe6d1"
    },
    {
      "inputs": [],
      "name": "getVaultClosingFeeP",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xa5b26e46"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "index",
                  "type": "uint32"
                }
              ],
              "internalType": "struct ITradingStorage.Id",
              "name": "orderId",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "spreadP",
              "type": "uint256"
            },
            {
              "internalType": "uint64",
              "name": "price",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "open",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "high",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "low",
              "type": "uint64"
            }
          ],
          "internalType": "struct ITradingCallbacks.AggregatorAnswer",
          "name": "_a",
          "type": "tuple"
        }
      ],
      "name": "increasePositionSizeMarketCallback",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x10d8e754"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_vaultClosingFeeP",
          "type": "uint8"
        }
      ],
      "name": "initializeCallbacks",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xec98ec83"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_collateralAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint128",
          "name": "_collateralPrecisionDelta",
          "type": "uint128"
        },
        {
          "internalType": "uint256",
          "name": "_gnsPriceCollateral",
          "type": "uint256"
        }
      ],
      "name": "lib_convertCollateralToGns",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0xc80f0abc"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_collateralAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint128",
          "name": "_collateralPrecisionDelta",
          "type": "uint128"
        },
        {
          "internalType": "uint256",
          "name": "_collateralPriceUsd",
          "type": "uint256"
        }
      ],
      "name": "lib_convertCollateralToUsd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x5b1727fa"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_openPrice",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "_currentPrice",
          "type": "uint64"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        },
        {
          "internalType": "uint24",
          "name": "_leverage",
          "type": "uint24"
        }
      ],
      "name": "lib_getPnlPercent",
      "outputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0xf4794ac5"
    },
    {
      "inputs": [
        {
          "internalType": "uint120",
          "name": "_collateralAmount",
          "type": "uint120"
        },
        {
          "internalType": "uint24",
          "name": "_leverage",
          "type": "uint24"
        }
      ],
      "name": "lib_getPositionSizeCollateral",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x70ff1638"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint24",
              "name": "leverage",
              "type": "uint24"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "enum ITradingStorage.TradeType",
              "name": "tradeType",
              "type": "uint8"
            },
            {
              "internalType": "uint120",
              "name": "collateralAmount",
              "type": "uint120"
            },
            {
              "internalType": "uint64",
              "name": "openPrice",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "tp",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "sl",
              "type": "uint64"
            },
            {
              "internalType": "uint192",
              "name": "__placeholder",
              "type": "uint192"
            }
          ],
          "internalType": "struct ITradingStorage.Trade",
          "name": "_trade",
          "type": "tuple"
        }
      ],
      "name": "lib_getTradeBorrowingFeeCollateral",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xd058ffe4"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint24",
              "name": "leverage",
              "type": "uint24"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "enum ITradingStorage.TradeType",
              "name": "tradeType",
              "type": "uint8"
            },
            {
              "internalType": "uint120",
              "name": "collateralAmount",
              "type": "uint120"
            },
            {
              "internalType": "uint64",
              "name": "openPrice",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "tp",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "sl",
              "type": "uint64"
            },
            {
              "internalType": "uint192",
              "name": "__placeholder",
              "type": "uint192"
            }
          ],
          "internalType": "struct ITradingStorage.Trade",
          "name": "_trade",
          "type": "tuple"
        },
        {
          "internalType": "int256",
          "name": "_percentProfit",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "_closingFeesCollateral",
          "type": "uint256"
        },
        {
          "internalType": "uint128",
          "name": "_collateralPrecisionDelta",
          "type": "uint128"
        }
      ],
      "name": "lib_getTradeValue",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "borrowingFeesCollateral",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xb47aad52"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_collateral",
          "type": "uint256"
        },
        {
          "internalType": "int256",
          "name": "_percentProfit",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "_borrowingFeeCollateral",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_closingFeeCollateral",
          "type": "uint256"
        },
        {
          "internalType": "uint128",
          "name": "_collateralPrecisionDelta",
          "type": "uint128"
        }
      ],
      "name": "lib_getTradeValuePure",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x139a7c52"
    },
    {
      "inputs": [],
      "name": "lib_getTradingCallbacksUtilsSlot",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x6a7906e5"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint24",
              "name": "leverage",
              "type": "uint24"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isOpen",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "enum ITradingStorage.TradeType",
              "name": "tradeType",
              "type": "uint8"
            },
            {
              "internalType": "uint120",
              "name": "collateralAmount",
              "type": "uint120"
            },
            {
              "internalType": "uint64",
              "name": "openPrice",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "tp",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "sl",
              "type": "uint64"
            },
            {
              "internalType": "uint192",
              "name": "__placeholder",
              "type": "uint192"
            }
          ],
          "internalType": "struct ITradingStorage.Trade",
          "name": "_trade",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "createdBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "tpLastUpdatedBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "slLastUpdatedBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint16",
              "name": "maxSlippageP",
              "type": "uint16"
            },
            {
              "internalType": "uint48",
              "name": "lastOiUpdateTs",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "collateralPriceUsd",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "__placeholder",
              "type": "uint48"
            }
          ],
          "internalType": "struct ITradingStorage.TradeInfo",
          "name": "_tradeInfo",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "_newPositionSizeCollateral",
          "type": "uint256"
        }
      ],
      "name": "lib_handleOiDelta",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x071dafb3"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_positionSizeCollateralDelta",
          "type": "uint256"
        }
      ],
      "name": "lib_isWithinExposureLimits",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x9dce5b75"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_spreadP",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        }
      ],
      "name": "lib_marketExecutionPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0xda382c8c"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "index",
                  "type": "uint32"
                }
              ],
              "internalType": "struct ITradingStorage.Id",
              "name": "orderId",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "spreadP",
              "type": "uint256"
            },
            {
              "internalType": "uint64",
              "name": "price",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "open",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "high",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "low",
              "type": "uint64"
            }
          ],
          "internalType": "struct ITradingCallbacks.AggregatorAnswer",
          "name": "_a",
          "type": "tuple"
        }
      ],
      "name": "openTradeMarketCallback",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x13ebc2c6"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "index",
                  "type": "uint32"
                }
              ],
              "internalType": "struct ITradingStorage.Id",
              "name": "orderId",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "spreadP",
              "type": "uint256"
            },
            {
              "internalType": "uint64",
              "name": "price",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "open",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "high",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "low",
              "type": "uint64"
            }
          ],
          "internalType": "struct ITradingCallbacks.AggregatorAnswer",
          "name": "_a",
          "type": "tuple"
        }
      ],
      "name": "updateLeverageCallback",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x92dd2940"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_valueP",
          "type": "uint8"
        }
      ],
      "name": "updateVaultClosingFeeP",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xcbc8e6f2"
    },
    {
      "inputs": [],
      "name": "BorrowingWrongExponent",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "BorrowingZeroGroup",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "groupIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "currentBlock",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "accFeeLong",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "accFeeShort",
          "type": "uint64"
        }
      ],
      "name": "BorrowingGroupAccFeesUpdated",
      "type": "event",
      "signature": "0xb4297e7afacc3feba1f03e1a444e70031a62f3ae4d6372c2b0cb3e0e62e8568e"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "groupIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "long",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "increase",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint72",
          "name": "delta",
          "type": "uint72"
        },
        {
          "indexed": false,
          "internalType": "uint72",
          "name": "newOiLong",
          "type": "uint72"
        },
        {
          "indexed": false,
          "internalType": "uint72",
          "name": "newOiShort",
          "type": "uint72"
        }
      ],
      "name": "BorrowingGroupOiUpdated",
      "type": "event",
      "signature": "0xb36af604fa0e5c3505abb63091d204895a517928138498bb965622d2258bdeb5"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "groupIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "feePerBlock",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint72",
          "name": "maxOi",
          "type": "uint72"
        },
        {
          "indexed": false,
          "internalType": "uint48",
          "name": "feeExponent",
          "type": "uint48"
        }
      ],
      "name": "BorrowingGroupUpdated",
      "type": "event",
      "signature": "0x8f029f3a48396ff1466df7488d31984ab9265a55be3de042cd03662ad2c894ca"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "pairIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "index",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "long",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "initialPairAccFee",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "initialGroupAccFee",
          "type": "uint64"
        }
      ],
      "name": "BorrowingInitialAccFeesStored",
      "type": "event",
      "signature": "0x49a2b4d58db9411e83e598fad88462d2474d8f9aae8a9ba41acdfde33f4f3751"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "pairIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "currentBlock",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "accFeeLong",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "accFeeShort",
          "type": "uint64"
        }
      ],
      "name": "BorrowingPairAccFeesUpdated",
      "type": "event",
      "signature": "0x12515cf8712ede0f0e48dd7513c14f22f116a6b3f95bd493da7511cf7dcbadd7"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "pairIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint16",
          "name": "prevGroupIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint16",
          "name": "newGroupIndex",
          "type": "uint16"
        }
      ],
      "name": "BorrowingPairGroupUpdated",
      "type": "event",
      "signature": "0x2281c18b617b78612026764ea9d5175174342c49b30da77900f7518a83242fa7"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "pairIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "long",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "increase",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint72",
          "name": "delta",
          "type": "uint72"
        },
        {
          "indexed": false,
          "internalType": "uint72",
          "name": "newOiLong",
          "type": "uint72"
        },
        {
          "indexed": false,
          "internalType": "uint72",
          "name": "newOiShort",
          "type": "uint72"
        }
      ],
      "name": "BorrowingPairOiUpdated",
      "type": "event",
      "signature": "0x012adc2457c8405bb9a0f2f3be4cc4bff84f095e6a16535b080facddec7804d3"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "pairIndex",
          "type": "uint16"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "groupIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "feePerBlock",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint48",
          "name": "feeExponent",
          "type": "uint48"
        },
        {
          "indexed": false,
          "internalType": "uint72",
          "name": "maxOi",
          "type": "uint72"
        }
      ],
      "name": "BorrowingPairParamsUpdated",
      "type": "event",
      "signature": "0x3984f24e4863ca281d86902d6706218ef6b050f256dcc978dbe508eaf8c3a431"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "trader",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "pairIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "index",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "open",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "long",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "positionSizeCollateral",
          "type": "uint256"
        }
      ],
      "name": "TradeBorrowingCallbackHandled",
      "type": "event",
      "signature": "0x1d4556af371eac83495a853ba4f1af8a2d4e0c76ab08719dbd24b372cfc0acc3"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        }
      ],
      "name": "getAllBorrowingPairs",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "feePerBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint64",
              "name": "accFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "accFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint48",
              "name": "accLastUpdatedBlock",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "feeExponent",
              "type": "uint48"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingData[]",
          "name": "",
          "type": "tuple[]"
        },
        {
          "components": [
            {
              "internalType": "uint72",
              "name": "long",
              "type": "uint72"
            },
            {
              "internalType": "uint72",
              "name": "short",
              "type": "uint72"
            },
            {
              "internalType": "uint72",
              "name": "max",
              "type": "uint72"
            },
            {
              "internalType": "uint40",
              "name": "__placeholder",
              "type": "uint40"
            }
          ],
          "internalType": "struct IBorrowingFees.OpenInterest[]",
          "name": "",
          "type": "tuple[]"
        },
        {
          "components": [
            {
              "internalType": "uint16",
              "name": "groupIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint48",
              "name": "block",
              "type": "uint48"
            },
            {
              "internalType": "uint64",
              "name": "initialAccFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "initialAccFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "prevGroupAccFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "prevGroupAccFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "pairAccFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "pairAccFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "__placeholder",
              "type": "uint64"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingPairGroup[][]",
          "name": "",
          "type": "tuple[][]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x48da5b38"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_groupIndex",
          "type": "uint16"
        }
      ],
      "name": "getBorrowingGroup",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "feePerBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint64",
              "name": "accFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "accFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint48",
              "name": "accLastUpdatedBlock",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "feeExponent",
              "type": "uint48"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingData",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xfff24740"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_groupIndex",
          "type": "uint16"
        }
      ],
      "name": "getBorrowingGroupOi",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint72",
              "name": "long",
              "type": "uint72"
            },
            {
              "internalType": "uint72",
              "name": "short",
              "type": "uint72"
            },
            {
              "internalType": "uint72",
              "name": "max",
              "type": "uint72"
            },
            {
              "internalType": "uint40",
              "name": "__placeholder",
              "type": "uint40"
            }
          ],
          "internalType": "struct IBorrowingFees.OpenInterest",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x13a9baae"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_groupIndex",
          "type": "uint16"
        },
        {
          "internalType": "uint256",
          "name": "_currentBlock",
          "type": "uint256"
        }
      ],
      "name": "getBorrowingGroupPendingAccFees",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "accFeeLong",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "accFeeShort",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "groupAccFeeDelta",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xd2b9099a"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16[]",
          "name": "_indices",
          "type": "uint16[]"
        }
      ],
      "name": "getBorrowingGroups",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "feePerBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint64",
              "name": "accFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "accFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint48",
              "name": "accLastUpdatedBlock",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "feeExponent",
              "type": "uint48"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingData[]",
          "name": "",
          "type": "tuple[]"
        },
        {
          "components": [
            {
              "internalType": "uint72",
              "name": "long",
              "type": "uint72"
            },
            {
              "internalType": "uint72",
              "name": "short",
              "type": "uint72"
            },
            {
              "internalType": "uint72",
              "name": "max",
              "type": "uint72"
            },
            {
              "internalType": "uint40",
              "name": "__placeholder",
              "type": "uint40"
            }
          ],
          "internalType": "struct IBorrowingFees.OpenInterest[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xfbbf9740"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "_index",
          "type": "uint32"
        }
      ],
      "name": "getBorrowingInitialAccFees",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint64",
              "name": "accPairFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "accGroupFee",
              "type": "uint64"
            },
            {
              "internalType": "uint48",
              "name": "block",
              "type": "uint48"
            },
            {
              "internalType": "uint80",
              "name": "__placeholder",
              "type": "uint80"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingInitialAccFees",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xab6192ed"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        }
      ],
      "name": "getBorrowingPair",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "feePerBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint64",
              "name": "accFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "accFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint48",
              "name": "accLastUpdatedBlock",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "feeExponent",
              "type": "uint48"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingData",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x5d5bf24d"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        }
      ],
      "name": "getBorrowingPairGroupIndex",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "groupIndex",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xe6a6633f"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        }
      ],
      "name": "getBorrowingPairGroups",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint16",
              "name": "groupIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint48",
              "name": "block",
              "type": "uint48"
            },
            {
              "internalType": "uint64",
              "name": "initialAccFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "initialAccFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "prevGroupAccFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "prevGroupAccFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "pairAccFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "pairAccFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "__placeholder",
              "type": "uint64"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingPairGroup[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xfd03e048"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        }
      ],
      "name": "getBorrowingPairOi",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint72",
              "name": "long",
              "type": "uint72"
            },
            {
              "internalType": "uint72",
              "name": "short",
              "type": "uint72"
            },
            {
              "internalType": "uint72",
              "name": "max",
              "type": "uint72"
            },
            {
              "internalType": "uint40",
              "name": "__placeholder",
              "type": "uint40"
            }
          ],
          "internalType": "struct IBorrowingFees.OpenInterest",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x0077b57e"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "internalType": "uint256",
          "name": "_currentBlock",
          "type": "uint256"
        }
      ],
      "name": "getBorrowingPairPendingAccFees",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "accFeeLong",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "accFeeShort",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "pairAccFeeDelta",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x0c7be6ca"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        }
      ],
      "name": "getPairMaxOi",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x5667b5c0"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        }
      ],
      "name": "getPairMaxOiCollateral",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x274d1278"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        }
      ],
      "name": "getPairOiCollateral",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xeb2ea3a2"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        }
      ],
      "name": "getPairOisCollateral",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "longOi",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "shortOi",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xf6f7c948"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "address",
              "name": "trader",
              "type": "address"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "collateral",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "leverage",
              "type": "uint256"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingFeeInput",
          "name": "_input",
          "type": "tuple"
        }
      ],
      "name": "getTradeBorrowingFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "feeAmountCollateral",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x0804db93"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "collateralIndex",
              "type": "uint8"
            },
            {
              "internalType": "address",
              "name": "trader",
              "type": "address"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "uint64",
              "name": "openPrice",
              "type": "uint64"
            },
            {
              "internalType": "bool",
              "name": "long",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "collateral",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "leverage",
              "type": "uint256"
            }
          ],
          "internalType": "struct IBorrowingFees.LiqPriceInput",
          "name": "_input",
          "type": "tuple"
        }
      ],
      "name": "getTradeLiquidationPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x700f3393"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "internalType": "uint32",
          "name": "_index",
          "type": "uint32"
        },
        {
          "internalType": "uint256",
          "name": "_positionSizeCollateral",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_open",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        }
      ],
      "name": "handleTradeBorrowingCallback",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xfc79e929"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_groupIndex",
          "type": "uint16"
        },
        {
          "internalType": "uint256",
          "name": "_currentBlock",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        }
      ],
      "name": "lib_getBorrowingGroupPendingAccFee",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "accFee",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x42192e06"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_i",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint16",
              "name": "groupIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint48",
              "name": "block",
              "type": "uint48"
            },
            {
              "internalType": "uint64",
              "name": "initialAccFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "initialAccFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "prevGroupAccFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "prevGroupAccFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "pairAccFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "pairAccFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "__placeholder",
              "type": "uint64"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingPairGroup[]",
          "name": "_pairGroups",
          "type": "tuple[]"
        },
        {
          "components": [
            {
              "internalType": "uint64",
              "name": "accPairFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "accGroupFee",
              "type": "uint64"
            },
            {
              "internalType": "uint48",
              "name": "block",
              "type": "uint48"
            },
            {
              "internalType": "uint80",
              "name": "__placeholder",
              "type": "uint80"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingInitialAccFees",
          "name": "_initialFees",
          "type": "tuple"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_currentBlock",
          "type": "uint256"
        }
      ],
      "name": "lib_getBorrowingPairGroupAccFeesDeltas",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "deltaGroup",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "deltaPair",
          "type": "uint64"
        },
        {
          "internalType": "bool",
          "name": "beforeTradeOpen",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0xff5b91ac"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "internalType": "uint256",
          "name": "_currentBlock",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        }
      ],
      "name": "lib_getBorrowingPairPendingAccFee",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "accFee",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x744223dc"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint64",
              "name": "accFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "accFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint256",
              "name": "oiLong",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "oiShort",
              "type": "uint256"
            },
            {
              "internalType": "uint32",
              "name": "feePerBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint256",
              "name": "currentBlock",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "accLastUpdatedBlock",
              "type": "uint256"
            },
            {
              "internalType": "uint72",
              "name": "maxOi",
              "type": "uint72"
            },
            {
              "internalType": "uint48",
              "name": "feeExponent",
              "type": "uint48"
            },
            {
              "internalType": "uint128",
              "name": "collateralPrecision",
              "type": "uint128"
            }
          ],
          "internalType": "struct IBorrowingFees.PendingBorrowingAccFeesInput",
          "name": "_input",
          "type": "tuple"
        }
      ],
      "name": "lib_getBorrowingPendingAccFees",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "newAccFeeLong",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "newAccFeeShort",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "delta",
          "type": "uint64"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0xb7d6fc84"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_openPrice",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_collateral",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_leverage",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_feesCollateral",
          "type": "uint256"
        },
        {
          "internalType": "uint128",
          "name": "_collateralPrecisionDelta",
          "type": "uint128"
        }
      ],
      "name": "lib_getTradeLiquidationPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true,
      "signature": "0x71a974aa"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_groupIndex",
          "type": "uint16"
        },
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "feePerBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint72",
              "name": "maxOi",
              "type": "uint72"
            },
            {
              "internalType": "uint48",
              "name": "feeExponent",
              "type": "uint48"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingGroupParams",
          "name": "_value",
          "type": "tuple"
        }
      ],
      "name": "lib_setBorrowingGroupParams",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x18e8778e"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "components": [
            {
              "internalType": "uint16",
              "name": "groupIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint32",
              "name": "feePerBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint48",
              "name": "feeExponent",
              "type": "uint48"
            },
            {
              "internalType": "uint72",
              "name": "maxOi",
              "type": "uint72"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingPairParams",
          "name": "_value",
          "type": "tuple"
        }
      ],
      "name": "lib_setBorrowingPairParams",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x5a7fffb7"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_groupIndex",
          "type": "uint16"
        },
        {
          "internalType": "uint256",
          "name": "_currentBlock",
          "type": "uint256"
        }
      ],
      "name": "lib_setGroupPendingAccFees",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "accFeeLong",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "accFeeShort",
          "type": "uint64"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xa91ba50a"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "internalType": "uint256",
          "name": "_currentBlock",
          "type": "uint256"
        }
      ],
      "name": "lib_setPairPendingAccFees",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "accFeeLong",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "accFeeShort",
          "type": "uint64"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x72fcb113"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_groupIndex",
          "type": "uint16"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "_increase",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_amountCollateral",
          "type": "uint256"
        }
      ],
      "name": "lib_updateGroupOi",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x3300300f"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "internalType": "uint256",
          "name": "_amountCollateral",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_increase",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        }
      ],
      "name": "lib_updatePairOi",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x4e4b6fc0"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "components": [
            {
              "internalType": "uint16",
              "name": "groupIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint48",
              "name": "block",
              "type": "uint48"
            },
            {
              "internalType": "uint64",
              "name": "initialAccFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "initialAccFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "prevGroupAccFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "prevGroupAccFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "pairAccFeeLong",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "pairAccFeeShort",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "__placeholder",
              "type": "uint64"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingPairGroup",
          "name": "_group",
          "type": "tuple"
        }
      ],
      "name": "mock_pushPairGroup",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x08633074"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_groupIndex",
          "type": "uint16"
        },
        {
          "internalType": "uint64",
          "name": "_accFeeLong",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "_accFeeShort",
          "type": "uint64"
        }
      ],
      "name": "mock_setGroupAccFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x5bf43144"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "internalType": "uint64",
          "name": "_accFeeLong",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "_accFeeShort",
          "type": "uint64"
        }
      ],
      "name": "mock_setPairAccFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x071e2c0d"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "_trader",
          "type": "address"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "internalType": "uint32",
          "name": "_index",
          "type": "uint32"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        }
      ],
      "name": "resetTradeBorrowingFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x4fa72788"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_groupIndex",
          "type": "uint16"
        },
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "feePerBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint72",
              "name": "maxOi",
              "type": "uint72"
            },
            {
              "internalType": "uint48",
              "name": "feeExponent",
              "type": "uint48"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingGroupParams",
          "name": "_value",
          "type": "tuple"
        }
      ],
      "name": "setBorrowingGroupParams",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x9fed9481"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16[]",
          "name": "_indices",
          "type": "uint16[]"
        },
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "feePerBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint72",
              "name": "maxOi",
              "type": "uint72"
            },
            {
              "internalType": "uint48",
              "name": "feeExponent",
              "type": "uint48"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingGroupParams[]",
          "name": "_values",
          "type": "tuple[]"
        }
      ],
      "name": "setBorrowingGroupParamsArray",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x02c4e7c1"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "components": [
            {
              "internalType": "uint16",
              "name": "groupIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint32",
              "name": "feePerBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint48",
              "name": "feeExponent",
              "type": "uint48"
            },
            {
              "internalType": "uint72",
              "name": "maxOi",
              "type": "uint72"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingPairParams",
          "name": "_value",
          "type": "tuple"
        }
      ],
      "name": "setBorrowingPairParams",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x33b516cf"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16[]",
          "name": "_indices",
          "type": "uint16[]"
        },
        {
          "components": [
            {
              "internalType": "uint16",
              "name": "groupIndex",
              "type": "uint16"
            },
            {
              "internalType": "uint32",
              "name": "feePerBlock",
              "type": "uint32"
            },
            {
              "internalType": "uint48",
              "name": "feeExponent",
              "type": "uint48"
            },
            {
              "internalType": "uint72",
              "name": "maxOi",
              "type": "uint72"
            }
          ],
          "internalType": "struct IBorrowingFees.BorrowingPairParams[]",
          "name": "_values",
          "type": "tuple[]"
        }
      ],
      "name": "setBorrowingPairParamsArray",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xeb1802f8"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "internalType": "bool",
          "name": "_long",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_positionSizeCollateral",
          "type": "uint256"
        }
      ],
      "name": "withinMaxBorrowingGroupOi",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "signature": "0x801c7961"
    },
    {
      "inputs": [],
      "name": "InvalidCandle",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "OracleAlreadyListed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "RequestAlreadyPending",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "SourceNotOracleOfRequest",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "T",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TransferAndCallToOracleFailed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "WrongCollateralUsdDecimals",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        }
      ],
      "name": "ChainlinkFulfilled",
      "type": "event",
      "signature": "0x7cc135e0cebb02c3480ae5d74d377283180a2601f8f644edf7987b009316c63a"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        }
      ],
      "name": "ChainlinkRequested",
      "type": "event",
      "signature": "0xb5e6e01e79f91267dc17b4e6314d5d4d03593d2ceee0fbb452b750bd70ea5af9"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "components": [
            {
              "internalType": "contract IUniswapV3Pool",
              "name": "pool",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isGnsToken0InLp",
              "type": "bool"
            },
            {
              "internalType": "uint88",
              "name": "__placeholder",
              "type": "uint88"
            }
          ],
          "indexed": false,
          "internalType": "struct IPriceAggregator.UniV3PoolInfo",
          "name": "newValue",
          "type": "tuple"
        }
      ],
      "name": "CollateralGnsUniV3PoolUpdated",
      "type": "event",
      "signature": "0x1edbae8d78eb52b7442e21be32c837a2c2521fd9d806d1f469f2c9e8f469ab75"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "value",
          "type": "address"
        }
      ],
      "name": "CollateralUsdPriceFeedUpdated",
      "type": "event",
      "signature": "0x272401831c29114837867a7463e326c1b024e3dd2f0f108dec76352011db4fea"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "jobId",
          "type": "bytes32"
        }
      ],
      "name": "JobIdUpdated",
      "type": "event",
      "signature": "0x764c19c693af0da42ec6c6bed68a2dd1a2fa93d24785fcfce58ffa29ae313606"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountLink",
          "type": "uint256"
        }
      ],
      "name": "LinkClaimedBack",
      "type": "event",
      "signature": "0xc4fc8431efbe3edf6cca5a73401623d342a9fad5807bcb502d2efca245cb6ffd"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "id",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "callbackAddress",
              "type": "address"
            },
            {
              "internalType": "bytes4",
              "name": "callbackFunctionId",
              "type": "bytes4"
            },
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "components": [
                {
                  "internalType": "bytes",
                  "name": "buf",
                  "type": "bytes"
                },
                {
                  "internalType": "uint256",
                  "name": "capacity",
                  "type": "uint256"
                }
              ],
              "internalType": "struct BufferChainlink.buffer",
              "name": "buf",
              "type": "tuple"
            }
          ],
          "indexed": false,
          "internalType": "struct Chainlink.Request",
          "name": "request",
          "type": "tuple"
        }
      ],
      "name": "LinkRequestCreated",
      "type": "event",
      "signature": "0x170ae993ffa82f60cce26e128cf75e11b7deba03fe29685e5881a76c8452765c"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "value",
          "type": "address"
        }
      ],
      "name": "LinkUsdPriceFeedUpdated",
      "type": "event",
      "signature": "0xca648bfe353681131df098ecd895a5ec41f502a93a1223aa1b77f67fc271f2a3"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "value",
          "type": "uint8"
        }
      ],
      "name": "MinAnswersUpdated",
      "type": "event",
      "signature": "0x6bc925491f55f56cb08a3ff41035fb0fdeae0cecc94f8e32e9b8ba2ad17fa7f9"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "value",
          "type": "address"
        }
      ],
      "name": "OracleAdded",
      "type": "event",
      "signature": "0xbf21de46ba0ce5e377db4224a7253064e85c704765b54881c2ad551a30a28d0b"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "oldOracle",
          "type": "address"
        }
      ],
      "name": "OracleRemoved",
      "type": "event",
      "signature": "0x0adc4a8d7cd2f125c921a2f757c5c86749579208090d4fbb65c26bae90179ac0"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "oldOracle",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "newOracle",
          "type": "address"
        }
      ],
      "name": "OracleReplaced",
      "type": "event",
      "signature": "0x36f00e7308d970ca7446a252b7a1dd9c9cb50ea4559b602e595fc53967ac9dd9"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "orderId",
          "type": "tuple"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "pairIndex",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "request",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "priceData",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isLookback",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "usedInMedian",
          "type": "bool"
        }
      ],
      "name": "PriceReceived",
      "type": "event",
      "signature": "0x1d01fcc0e82c93f463da710266800aff752bf7da2435090b30616276602eb75a"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "collateralIndex",
          "type": "uint8"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingStorage.Id",
          "name": "pendingOrderId",
          "type": "tuple"
        },
        {
          "indexed": true,
          "internalType": "enum ITradingStorage.PendingOrderType",
          "name": "orderType",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "pairIndex",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "job",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nodesCount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "linkFeePerNode",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "fromBlock",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isLookback",
          "type": "bool"
        }
      ],
      "name": "PriceRequested",
      "type": "event",
      "signature": "0xff0844642ee620558da9bd3e51a00e4e70e563b544dd6ef6529fd4068eea8dc9"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "index",
                  "type": "uint32"
                }
              ],
              "internalType": "struct ITradingStorage.Id",
              "name": "orderId",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "spreadP",
              "type": "uint256"
            },
            {
              "internalType": "uint64",
              "name": "price",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "open",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "high",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "low",
              "type": "uint64"
            }
          ],
          "indexed": false,
          "internalType": "struct ITradingCallbacks.AggregatorAnswer",
          "name": "a",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "enum ITradingStorage.PendingOrderType",
          "name": "orderType",
          "type": "uint8"
        }
      ],
      "name": "TradingCallbackExecuted",
      "type": "event",
      "signature": "0x3c7b39f62241be54daf88ab94fbb4f3b7e92a2abb908f2d2b4ce3d14dadd5a4f"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "newValue",
          "type": "uint32"
        }
      ],
      "name": "TwapIntervalUpdated",
      "type": "event",
      "signature": "0xc99f383ecd620c333255bd2aef929eedd6808999bac9bfc5f53e10d876abf1ce"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_a",
          "type": "address"
        }
      ],
      "name": "addOracle",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xdf5dd1a5"
    },
    {
      "inputs": [],
      "name": "claimBackLink",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x6f37d263"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_requestId",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_priceData",
          "type": "uint256"
        }
      ],
      "name": "fulfill",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x4357855e"
    },
    {
      "inputs": [],
      "name": "getChainlinkToken",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x165d35e1"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_normalizedValue",
          "type": "uint256"
        }
      ],
      "name": "getCollateralFromUsdNormalizedValue",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x36f6def7"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        }
      ],
      "name": "getCollateralGnsUniV3Pool",
      "outputs": [
        {
          "components": [
            {
              "internalType": "contract IUniswapV3Pool",
              "name": "pool",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isGnsToken0InLp",
              "type": "bool"
            },
            {
              "internalType": "uint88",
              "name": "__placeholder",
              "type": "uint88"
            }
          ],
          "internalType": "struct IPriceAggregator.UniV3PoolInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0xd1d80eb8"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        }
      ],
      "name": "getCollateralPriceUsd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0xbbb4e3f9"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        }
      ],
      "name": "getCollateralUsdPriceFeed",
      "outputs": [
        {
          "internalType": "contract IChainlinkFeed",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x9641c1f5"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "getGnsPriceCollateralAddress",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x1de109d2"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "name": "getGnsPriceCollateralIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0xa91fa361"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_gnsPriceCollateral",
          "type": "uint256"
        }
      ],
      "name": "getGnsPriceUsd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x6e27030b"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        }
      ],
      "name": "getGnsPriceUsd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x891e656c"
    },
    {
      "inputs": [],
      "name": "getLimitJobId",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0xf4b0664d"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "internalType": "uint256",
          "name": "_positionSizeCollateral",
          "type": "uint256"
        }
      ],
      "name": "getLinkFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x9cf0cc0e"
    },
    {
      "inputs": [],
      "name": "getLinkUsdPriceFeed",
      "outputs": [
        {
          "internalType": "contract IChainlinkFeed",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0xb144bbf0"
    },
    {
      "inputs": [],
      "name": "getMarketJobId",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x8e667ac8"
    },
    {
      "inputs": [],
      "name": "getMinAnswers",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x69b53230"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "getOracle",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x10a9de60"
    },
    {
      "inputs": [],
      "name": "getOracles",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x40884c52"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_id",
          "type": "bytes32"
        }
      ],
      "name": "getPendingRequest",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x88b12d55"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint16",
          "name": "_pairIndex",
          "type": "uint16"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_orderId",
          "type": "tuple"
        },
        {
          "internalType": "enum ITradingStorage.PendingOrderType",
          "name": "_orderType",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_positionSizeCollateral",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_fromBlock",
          "type": "uint256"
        }
      ],
      "name": "getPrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xf51d0dc0"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_requestId",
          "type": "bytes32"
        }
      ],
      "name": "getPriceAggregatorOrder",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            },
            {
              "internalType": "enum ITradingStorage.PendingOrderType",
              "name": "orderType",
              "type": "uint8"
            },
            {
              "internalType": "uint16",
              "name": "pairIndex",
              "type": "uint16"
            },
            {
              "internalType": "bool",
              "name": "isLookback",
              "type": "bool"
            },
            {
              "internalType": "uint32",
              "name": "__placeholder",
              "type": "uint32"
            }
          ],
          "internalType": "struct IPriceAggregator.Order",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x7d0fcd1e"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "index",
              "type": "uint32"
            }
          ],
          "internalType": "struct ITradingStorage.Id",
          "name": "_orderId",
          "type": "tuple"
        }
      ],
      "name": "getPriceAggregatorOrderAnswers",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint64",
              "name": "open",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "high",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "low",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "ts",
              "type": "uint64"
            }
          ],
          "internalType": "struct IPriceAggregator.OrderAnswer[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x9f62038f"
    },
    {
      "inputs": [],
      "name": "getRequestCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x3fad1834"
    },
    {
      "inputs": [],
      "name": "getTwapInterval",
      "outputs": [
        {
          "internalType": "uint24",
          "name": "",
          "type": "uint24"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x3e742e3b"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_collateralValue",
          "type": "uint256"
        }
      ],
      "name": "getUsdNormalizedValue",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0xbbad411a"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_linkToken",
          "type": "address"
        },
        {
          "internalType": "contract IChainlinkFeed",
          "name": "_linkUsdPriceFeed",
          "type": "address"
        },
        {
          "internalType": "uint24",
          "name": "_twapInterval",
          "type": "uint24"
        },
        {
          "internalType": "uint8",
          "name": "_minAnswers",
          "type": "uint8"
        },
        {
          "internalType": "address[]",
          "name": "_nodes",
          "type": "address[]"
        },
        {
          "internalType": "bytes32[2]",
          "name": "_jobIds",
          "type": "bytes32[2]"
        },
        {
          "internalType": "uint8[]",
          "name": "_collateralIndices",
          "type": "uint8[]"
        },
        {
          "internalType": "contract IUniswapV3Pool[]",
          "name": "_gnsCollateralUniV3Pools",
          "type": "address[]"
        },
        {
          "internalType": "contract IChainlinkFeed[]",
          "name": "_collateralUsdPriceFeeds",
          "type": "address[]"
        }
      ],
      "name": "initializePriceAggregator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x488b411a"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "lib_getCollateralConfig",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint128",
              "name": "precision",
              "type": "uint128"
            },
            {
              "internalType": "uint128",
              "name": "precisionDelta",
              "type": "uint128"
            }
          ],
          "internalType": "struct CollateralUtils.CollateralConfig",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x6738adef"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_collateral",
          "type": "address"
        }
      ],
      "name": "lib_getGnsPriceCollateral",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x282d3fc2"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        }
      ],
      "name": "lib_getGnsPriceCollateral",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0xde799df8"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        }
      ],
      "name": "lib_getGnsPriceUsd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0x42654708"
    },
    {
      "inputs": [],
      "name": "lib_getPriceAggregatorUtilsSlot",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "signature": "0x2b225cc0"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint64",
              "name": "open",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "high",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "low",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "ts",
              "type": "uint64"
            }
          ],
          "internalType": "struct IPriceAggregator.OrderAnswer[]",
          "name": "_array",
          "type": "tuple[]"
        }
      ],
      "name": "lib_median",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "signature": "0x1863db4c"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint64",
              "name": "open",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "high",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "low",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "ts",
              "type": "uint64"
            }
          ],
          "internalType": "struct IPriceAggregator.OrderAnswer[]",
          "name": "_array",
          "type": "tuple[]"
        }
      ],
      "name": "lib_medianLookbacks",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "open",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "high",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "low",
          "type": "uint64"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "signature": "0x1d29e109"
    },
    {
      "inputs": [
        {
          "internalType": "int56[]",
          "name": "_tickCumulatives",
          "type": "int56[]"
        },
        {
          "internalType": "uint32",
          "name": "_twapInterval",
          "type": "uint32"
        },
        {
          "internalType": "uint256",
          "name": "_precisionDelta",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_isGnsToken0InLp",
          "type": "bool"
        }
      ],
      "name": "lib_tickCumulativesToTokenPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "signature": "0xe7c46302"
    },
    {
      "inputs": [],
      "name": "mock_getGnsPriceCollateral",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_mockPrice",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "signature": "0xeda7ab44"
    },
    {
      "inputs": [],
      "name": "mock_getMockPriceSlot",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "signature": "0xf13bfc4b"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_mockPrice",
          "type": "uint256"
        }
      ],
      "name": "mock_setGnsPriceCollateral",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x084e5fee"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "removeOracle",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x80935dbf"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_a",
          "type": "address"
        }
      ],
      "name": "replaceOracle",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x25e589cd"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_jobId",
          "type": "bytes32"
        }
      ],
      "name": "setLimitJobId",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xe0bb91c2"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_jobId",
          "type": "bytes32"
        }
      ],
      "name": "setMarketJobId",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x85f276b8"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "contract IUniswapV3Pool",
          "name": "_uniV3Pool",
          "type": "address"
        }
      ],
      "name": "updateCollateralGnsUniV3Pool",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xea06d1bd"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_collateralIndex",
          "type": "uint8"
        },
        {
          "internalType": "contract IChainlinkFeed",
          "name": "_value",
          "type": "address"
        }
      ],
      "name": "updateCollateralUsdPriceFeed",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xc07d2844"
    },
    {
      "inputs": [
        {
          "internalType": "contract IChainlinkFeed",
          "name": "_value",
          "type": "address"
        }
      ],
      "name": "updateLinkUsdPriceFeed",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x5beda778"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_value",
          "type": "uint8"
        }
      ],
      "name": "updateMinAnswers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x44eb8ba6"
    },
    {
      "inputs": [
        {
          "internalType": "uint24",
          "name": "_twapInterval",
          "type": "uint24"
        }
      ],
      "name": "updateTwapInterval",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xb166a495"
    }
  ]
}
