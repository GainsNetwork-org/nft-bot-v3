export class NonceManager {
	constructor(accountAddress, logger) {
		this.accountAddress = accountAddress;
		this.lastNonce = null;
		this.logger = logger;
	}

	get isInitialized() {
		return this.lastNonce !== null;
	}

	async initializeFromClient(web3Client) {
		this.logger.debug(`Retrieving transaction count to establish initial nonce for account ${this.accountAddress}...`);

		this.lastNonce = (await web3Client.eth.getTransactionCount(this.accountAddress)) - 1;

		this.logger.debug(`Last nonce for account ${this.accountAddress} was ${this.lastNonce}!`);
	}

	getNextNonce() {
		this.lastNonce = this.lastNonce + 1;

		this.logger.debug(`Next nonce for account ${this.accountAddress} is ${this.lastNonce}.`);

		return this.lastNonce;
	}
}
