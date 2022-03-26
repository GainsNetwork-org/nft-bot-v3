export class NonceManager {
	constructor(accountAddress) {
		this.accountAddress = accountAddress;
		this.lastNonce = null;
	}

	get isInitialized() {
		return this.lastNonce !== null;
	}

	async initializeFromClient(web3Client) {
		this.lastNonce = (await web3Client.eth.getTransactionCount(this.accountAddress)) - 1;
	}

	getNextNonce() {
		this.lastNonce = this.lastNonce + 1;

		return this.lastNonce;
	}
}
