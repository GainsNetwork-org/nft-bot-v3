export class NonceManager {
	constructor(accountAddress, getWeb3Client, logger, options = undefined) {
		this.accountAddress = accountAddress;

		// Wrap with check to make sure it returns actual instance
		this.getWeb3Client = () => {
			const web3Client = getWeb3Client();

			if(web3Client) {
				return web3Client;
			}

			throw new Error("Null or undefined web3 client returned by provided factory method!");
		};

		this.logger = logger;
		this.options = {
			latestNonceCheckIntervalMs: 120000,
			...options
		};

		this.lastNonce = null;
		this.lastNonceCheckIntervalId = null;
	}

	get isInitialized() {
		return this.lastNonce !== null;
	}

	async initialize() {
		await this.refreshNonceFromOnChainTransactionCount();
	}

	async refreshNonceFromOnChainTransactionCount() {
		this.logger.debug(`Retrieving transaction count to establish nonce for account ${this.accountAddress}...`);

		const web3Client = this.getWeb3Client();

		this.lastNonce = (await web3Client.eth.getTransactionCount(this.accountAddress)) - 1;

		this.logger.debug(`Last nonce for account ${this.accountAddress} was ${this.lastNonce}!`);

		if(this.lastNonceCheckIntervalId === null
				&&
			this.options.latestNonceCheckIntervalMs > 0) {
			this.logger?.debug(`Starting interval to check for latest on-chain nonce for every ${this.options.latestNonceCheckIntervalMs}ms...`);

			this.lastNonceCheckIntervalId = setInterval(() => {
				this.logger?.verbose(`Refreshing nonce from on-chain transaction count...`);
				this.refreshNonceFromOnChainTransactionCount();
			},
			this.options.latestNonceCheckIntervalMs);
		}
	}

	getNextNonce() {
		if(this.isInitialized === false) {
			throw new Error("Nonce not yet initialized!");
		}

		this.lastNonce = this.lastNonce + 1;

		this.logger.verbose(`Next nonce for account ${this.accountAddress} is ${this.lastNonce}.`);

		return this.lastNonce;
	}
}
