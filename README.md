# NFT Bot for gTrade v6.x

This is the bot that executes limit orders for [gTrade](https://gains.trade), the decentralized leveraged trading platform
on Polygon.

## Preparation

1. We recommend creating a specific address/wallet, otherwise it might create problems if you use the address the bot
   uses while it's running (nonce).

-> You can send your NFTs to this new wallet using the block explorer, using the "transferFrom" function.

Links to the NFTs:

<https://polygonscan.com/token/0xf9a4c522e327935bd1f5a338c121e14e4cc1f898#writeContract>
<https://polygonscan.com/token/0x77cd42b925e1a82f41d852d6be727cfc88fddbbc#writeContract>
<https://polygonscan.com/token/0x3378ad81d09de23725ee9b9270635c97ed601921#writeContract>
<https://polygonscan.com/token/0x02e2c5825c1a3b69c0417706dbe1327c2af3e6c2#writeContract>
<https://polygonscan.com/token/0x2d266a94469d05c9e06d52a4d0d9c23b157767c2#writeContract>

2. Your wallet needs to hold a small amount of the Wrapped ERC677 LINK token

Because the "normal" LINK token on Polygon is an ERC20, and oracles only support the ERC677 version, you will need to
convert your LINK tokens here: <https://pegswap.chain.link/>

## Expenses and Rewards

Each successful first trigger of an order will cost LINK (0.002% of collateral x leverage for cryptos, 0.0002% for
forex) to pay our node operators for the real-time on-chain feed. _Only_ the first to trigger an order will pay the LINK
cost, as if the trigger is successful, they are guaranteed to get **40%** of the trigger reward.

Then, another **10%** goes into a pool to be shared proportionally by the number of orders NFT bots executed during the
current round (= 50 orders), to incentivize better the  execution of smaller trades as they give you access to bigger
rewards in a pool.

Finally, **50%** goes to the 10 first NFT bots that triggered right after the first to trigger in the same block, to
incentivize more bots running and reduce gas wars.

## Tutorials

### Running Locally

It is perfectly possible to run the bot locally off your own laptop/workstation.

1. Clone the repo & install the dependencies
   1. `git clone https://github.com/GainsNetwork/nft-bot-v3.git`
   2. `npm install`

2. Edit the `.env` variables
   1. Set `WSS_URLS` to your dedicated WSS endpoints (recommended, but ignore if you don't have any)
   2. Set `PRIVATE_KEY` to your account's private key (needed to sign the transactions)
   3. Set `PUBLIC_KEY` to your account's public key
   4. Set `MAX_GAS_PRICE_GWEI` to the max gas price you want to pay for each trigger
   5. Set `VAULT_REFILL_ENABLED` to true if you want to contribute to the decentralization of the vault refilling mechanism
   6. Set `AUTO_HARVEST_SEC` to the frequency at which you want to harvest your trigger rewards (`0` = disabled)

### 3. Run the bot

`npm start`

### Tutorial (run in Heroku / Cloud platforms)

1. Make your own bot repo. You can fork this repo here on GitHub to make your own.

2. Create and setup a new project

   1. In heroku: `New > Create new app > ...`

   2. Then use the following buildpacks (in Settings):
      1. heroku/nodejs

3. Set all `.env` variables
   1. In Heroku: `Settings > Reveal Config Vars > Add`
   2. Configure the same variables found in the `.env` file

4. Deploy your repo
   1. Connect Github to your account
   2. Deploy your main branch

> NOTE: a Procfile is also provided in the repo for Heroku to run the bot as a worker. [More details on Procfiles are available here](https://devcenter.heroku.com/articles/procfile).

## All Environment Variables

| Name                                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| LOG_LEVEL                                    | Sets the level at which the bot should log. Valid values are: `error`, `warn`, `info`, `verbose`, `debug`. Using `debug` will produce a massive amount of output and is not suggested except for initial setup or problem solving.                                                                                                                                                                                                                                     |
| ENABLE_CONSOLE_LOGGING                       | Whether or not log messages should be output to the console.                                                                                                                                                                                                                                                                                                                                                                                                           |
| ENABLE_FS_LOGGING                            | Whether or not log messages should be output to a log file. This will log into a `.logs/<utc-date>` directory each time the bot is started.                                                                                                                                                                                                                                                                                                                            |
| WSS_URLS                                     | The RPC endpoint URLs that should be used for all blockchain communication.                                                                                                                                                                                                                                                                                                                                                                                            |
| PRICES_URL                                   | The WSS endpoint where the Gains backend pricing service is running.                                                                                                                                                                                                                                                                                                                                                                                                   |
| STORAGE_ADDRESS                              | The address of the Gains Storage contract on chain.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| PAIR_INFOS_ADDRESS                           | The address of the Gains Pair Infos contract on chain.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| PRIVATE_KEY                                  | The private key of your account that should be used to execute transactions. ⚠️ DO NOT PUBLISH THIS ANYWHERE. ⚠️                                                                                                                                                                                                                                                                                                                                                       |
| PUBLIC_KEY                                   | The public key of your account that should be used to execute transactions.                                                                                                                                                                                                                                                                                                                                                                                            |
| EVENT_CONFIRMATIONS_SEC                      | The number of seconds that must pass for an event coming from the blockchain to be considered as confirmed and safe for execution against.                                                                                                                                                                                                                                                                                                                             |
| MIN_PRIORITY_GWEI                            | The minimum priority gas fee in GWEI that should be used when triggering orders.                                                                                                                                                                                                                                                                                                                                                                                       |
| MAX_GAS_PRICE_GWEI                           | The maximum gas price in GWEI that should be used when triggering orders.                                                                                                                                                                                                                                                                                                                                                                                              |
| MAX_GAS_PER_TRANSACTION                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| PRIORITY_GWEI_MULTIPLIER                     | A multiplier that can be applied to the current priority gas fee which was fetched from the polygon gas station.                                                                                                                                                                                                                                                                                                                                                       |
| VAULT_REFILL_ENABLED                         | Whether or not you want the bot to participate in refilling the vault as a good citizen of the Gains Network.                                                                                                                                                                                                                                                                                                                                                          |
| CHECK_REFILL_SEC                             | How frequently the vault refilling process should occur.                                                                                                                                                                                                                                                                                                                                                                                                               |
| AUTO_HARVEST_SEC                             | How frequently the bot will harvest any rewards earned from triggering orders.                                                                                                                                                                                                                                                                                                                                                                                         |
| FAILED_ORDER_TRIGGER_TIMEOUT_SEC             | How long the bot should wait before it will retry an order after it has failed to successfully process on chain.                                                                                                                                                                                                                                                                                                                                                       |
| OPEN_TRADES_REFRESH_SEC                      | How frequently the bot should fully refresh trade data from the Gains smart contracts on chain. By default, the bot is keeping itself up to date based on delta events it's receiving from the chain so this isn't technically necessary, but it's a good fail safe in case the bot fails to hear about a certain even due to connectivity or other issues. Setting this to `0` will disable explicit refreshing and only ever keep state based on events it receives. |
| GAS_REFRESH_INTERVAL_SEC                     | How frequently to get the latest gas prices from the gas station.                                                                                                                                                                                                                                                                                                                                                                                                      |
| FETCH_TRADING_VARIABLES_REFRESH_INTERVAL_SEC | How frequently trading variables should be refreshed from the Gains smart contracts on chain. There are many variables that go into the calculations of triggering order and these variables need to be freshed to ensure the bot is always using the latest numbers. This is always done at start up, but does not need to be done too frequently at runtime.                                                                                                         |
| DRY_RUN                                      | Set to `true` to enable a "dry run" mode where the bot will do everything except submit the actual transactions to the chain for processing. This is good for initial setup to ensure everything is working as expected and other testing combined with a `LOG_LEVEL` of `debug`.                                                                                                                                                                                      |
| CHAIN_ID                                     | The ID of the block chain the bot is going to be interacting with. This defaults to `137` for Polygon's `mainnet` and you should only need to change it if you're targeting another chain.                                                                                                                                                                                                                                                                             |
| NETWORK_ID                                   | The ID of the network of the block chain the bot is going to be interacting with. This defaults to `137` for Polygon's `mainnet` and you should only need to change it if you're targeting another chain.                                                                                                                                                                                                                                                              |
| CHAIN                                        | The name of the block chain the bot is going to be interacting with. This defaults to `mainnet` and you should only change it if you're targeting a different chain.                                                                                                                                                                                                                                                                                                   |
| BASE_CHAIN                                   | The name of the base block chain the bot is going to be interacting with. This only needs to be set if you're testing on a network that is forked from a different chain. (e.g. testing on Polygon's Mumbai you would set this to `goerli`)                                                                                                                                                                                                                            |
| HARDFORK                                     | The ethereum hardfork of the block chain the bot is going to be interacting with. This defaults to `london` today and you should only need to change it if you're intending to target a different hardfork.                                                                                                                                                                                                                                                            |
| ENABLE_CONCURRENT_PRICE_UPDATE_PROCESSING    | Whether or not the bot should allow multiple price updates to be processed concurrently. This allows for faster reaction time when triggering orders rather than waiting on previous price update processing to complete. Defaults to `true`.                                                                                                                                                                                                                          |
| USE_MULTICALL                                | Whether or not the bot should multicall fetching open orders and other information. Some RPC providers may restrict multicalls. Set to `false` to use call batching instead. Defaults to `true`                                                                                                                                                                                                                                                                        |
