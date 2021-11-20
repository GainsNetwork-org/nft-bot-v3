# Gains.farm NFT Bot (v5 update)
Bot that executes limit orders for the v5 of Gains.farm, the decentralized leveraged trading platform on Polygon.

## Preparation

1. We recommend creating a specific address/wallet, otherwise it might create problems if you use the address the bot uses while it's running (nonce errors).

-> You can send all your NFTs to this new wallet using the block explorer, using the "transferFrom" function.

Links to the NFTs:

https://polygonscan.com/token/0xf9a4c522e327935bd1f5a338c121e14e4cc1f898#writeContract
https://polygonscan.com/token/0x77cd42b925e1a82f41d852d6be727cfc88fddbbc#writeContract
https://polygonscan.com/token/0x3378ad81d09de23725ee9b9270635c97ed601921#writeContract
https://polygonscan.com/token/0x02e2c5825c1a3b69c0417706dbe1327c2af3e6c2#writeContract
https://polygonscan.com/token/0x2d266a94469d05c9e06d52a4d0d9c23b157767c2#writeContract

2. Your wallet needs to hold a small amount of the Wrapped ERC677 LINK token

Because the "normal" LINK token on Polygon is an ERC20, and oracles only support the ERC677 version, you will need to convert your LINK tokens here: https://pegswap.chain.link/

Each request to trigger an order will cost some LINK (0.003% of pos x leverage for cryptos, 0.0006% for forex) to pay our node operators for our real-time feed.

## Tutorial (run locally)

### 1. Clone the repo & install the dependencies

1. `git clone https://github.com/GainsFarm/nft-bot-v2.git`
2. `npm install`

### 2. Edit the .env variables

1. Set WSS_URLS to your dedicated WSS endpoints (recommended, but ignore if you don't have any)
2. Set PRIVATE_KEY to your account's private key (needed to sign the transactions)
3. Set PUBLIC_KEY to your account's public key

### 3. Run the bot

`npm start`

## Tutorial (run in Heroku / Cloud platforms)

### 1. Make your own bot repo

Fork this repo to make your own one.

### 2. Create and setup a new project

In heroku: `New > Create new app > ...`

Then use the following buildpacks (in Settings):
1. heroku/nodejs

### 3. Set all .env variables

In Heroku: `Settings > Reveal Config Vars > Add`

### 4. Deploy your repo

1. Connect Github to your account
2. Deploy your main branch

## Vault refills
If you want to help the ecosystem, you can keep the .env variable named "VAULT_REFILL_ENABLED" set to "true", it contributes to the decentralization of the vault refilling mechanism. If you want to disable it (because it does cost some gas), you can set it to false.
