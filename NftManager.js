import Web3 from "web3";
import abis from "./abis.js";

export class NFTManager {
    constructor(storageContractAddress, getWeb3Client, logger, options = undefined) {
		this.storageContractAddress = storageContractAddress;
		this.getWeb3Client = getWeb3Client;
		this.logger = logger;
        this.availableNfts = [];
        this.nftTimelock = 0;
        this.nftsBeingUsed = new Set();
		this.options = {
			disableTimelockChecks: false,
			...options
		}
    }

    async leaseAvailableNft(web3Client) {
        if(this.availableNfts.length === 0) {
            this.logger.warn("No NFTs loaded yet.");

            return null;
        }

        let availableNft;

        // Self patch to the optimal implementation on first call
        if(this.availableNfts.length === 1) {
            availableNft = await this.selectOnlyNft(web3Client);
        } else {
            availableNft = await this.selectNftFromMultiple(web3Client);
        }

		// If we actually found an NFT, track that this NFT is being actively used
		if(availableNft !== null) {
			this.nftsBeingUsed.add(availableNft.id);

			this.logger.debug(`NFT ${availableNft.id} being leased out...`);
		}

        return availableNft;
    }

    releaseNft(nft) {
        this.nftsBeingUsed.delete(nft.id);

		this.logger.debug(`NFT ${nft.id} lease released.`);
    }

    async loadNfts() {
		this.logger.info("Loading available NFTs...");

		const web3Client = this.getWeb3Client();

        const storageContract = new web3Client.eth.Contract(abis.STORAGE, this.storageContractAddress);

        const [
            nftAddress1,
            nftAddress2,
            nftAddress3,
            nftAddress4,
            nftAddress5,
        ] = await Promise.all([
            storageContract.methods.nfts(0).call(),
            storageContract.methods.nfts(1).call(),
            storageContract.methods.nfts(2).call(),
            storageContract.methods.nfts(3).call(),
            storageContract.methods.nfts(4).call(),
        ]);

        const nftContract1 = new web3Client.eth.Contract(abis.NFT, nftAddress1);
        const nftContract2 = new web3Client.eth.Contract(abis.NFT, nftAddress2);
        const nftContract3 = new web3Client.eth.Contract(abis.NFT, nftAddress3);
        const nftContract4 = new web3Client.eth.Contract(abis.NFT, nftAddress4);
        const nftContract5 = new web3Client.eth.Contract(abis.NFT, nftAddress5);

		const [
			nftSuccessTimelock,
			nftsCount1,
			nftsCount2,
			nftsCount3,
			nftsCount4,
			nftsCount5
		] = await Promise.all(
			[
				storageContract.methods.nftSuccessTimelock().call(),
				nftContract1.methods.balanceOf(process.env.PUBLIC_KEY).call(),
				nftContract2.methods.balanceOf(process.env.PUBLIC_KEY).call(),
				nftContract3.methods.balanceOf(process.env.PUBLIC_KEY).call(),
				nftContract4.methods.balanceOf(process.env.PUBLIC_KEY).call(),
				nftContract5.methods.balanceOf(process.env.PUBLIC_KEY).call(),
			]);

		this.availableNfts = (await Promise.all(
			[
				{ nftContract: nftContract1, nftType: 1, count: nftsCount1 },
				{ nftContract: nftContract2, nftType: 2, count: nftsCount2 },
				{ nftContract: nftContract3, nftType: 3, count: nftsCount3 },
				{ nftContract: nftContract4, nftType: 4, count: nftsCount4 },
				{ nftContract: nftContract5, nftType: 5, count: nftsCount5 }
			].map(async nft => {
				const allNftIdsOfTypeCalls = new Array(nft.count);

				for(let i = 0; i < nft.count; i++) {
					allNftIdsOfTypeCalls[i] = nft.nftContract.methods.tokenOfOwnerByIndex(process.env.PUBLIC_KEY, i).call()
				}

				const allNftIdsOfType = await Promise.all(allNftIdsOfTypeCalls);

				return allNftIdsOfType
					.filter(nftId => nftId !== "0")
					.map(nftId => ({ id: nftId, type: nft.nftType }));
			}))).flat();

		this.nftTimelock = parseInt(nftSuccessTimelock, 10);

		this.logger.info(`NFTs loaded: available=${this.availableNfts.length};timelock=${this.nftTimelock}`);
	}

    async selectOnlyNft(web3Client) {
        const onlyNft = this.availableNfts[0];

        // If timelock checks are disabled or there's no timelock even set then just return immediately
        if(this.options.disableTimelockChecks === true || this.nftTimelock === 0) {
            return onlyNft;
        }

        const storageContract = new web3Client.eth.Contract(abis.STORAGE, this.storageContractAddress);

        const [
            currentBlock,
            nftLastSuccess
        ] = await Promise.all(
            [
                web3Client.eth.getBlockNumber(),
                storageContract.methods.nftLastSuccess(onlyNft.id).call()
            ]);

		const latestBlockNumber = this._getTimelockRelativeBlockNumber(currentBlock);

        // If the NFT is still time locked we return null because we still can't use it
        if(latestBlockNumber - nftLastSuccess <= this.nftTimelock) {
            return null;
        }

        return onlyNft;
    }

    async selectNftFromMultiple(web3Client) {
        this.logger.debug(`Selecting from multiple available NFTs: total loaded=${this.availableNfts.length}`);

        // If timelock checks are disabled or there's no timelock even set then just use round robin strategy
		if(this.options.disableTimelockChecks === true || this.nftTimelock === 0) {
            return this.selectNftRoundRobin();
        }

        return await this.selectNftUsingTimelock(web3Client);
    }

    selectNftRoundRobin() {
        let nextNftIndex = this.availableNfts.nextIndex ?? 0;

        const nextNft = this.availableNfts[nextNftIndex];

        // If we're about to go past the end of the array, just go back to beginning
        this.availableNfts.nextIndex = nextNftIndex === this.availableNfts.length - 1 ? 0 : nextNftIndex + 1;

        return nextNft;
    }

    async selectNftUsingTimelock(web3Client) {
        try
        {
            const storageContract = new web3Client.eth.Contract(abis.STORAGE, this.storageContractAddress);

            // Load the last successful block for each NFT that we know is not actively being used
            const [currentBlock, nftsWithLastSuccesses] = await Promise.all(
                [
                    web3Client.eth.getBlock('latest'),
                    Promise.all(
                        this.availableNfts
                            .filter(nft => !this.nftsBeingUsed.has(nft.id))
                            .map(async nft => ({
                                nft,
                                lastSuccess: parseInt(await storageContract.methods.nftLastSuccess(nft.id).call(), 10)
                            })))
                ]);

			this.logger.debug(`${nftsWithLastSuccesses.length} candidate NFTs to consider.`, { currentBlock, nftsWithLastSuccesses });

			const latestBlockNumber = this._getTimelockRelativeBlockNumber(currentBlock);

            // Try to find the first NFT whose last successful block is older than the current block by the required timelock amount
            const firstEligibleNft = nftsWithLastSuccesses.find(nftwls => latestBlockNumber - nftwls.lastSuccess > this.nftTimelock);

            if(firstEligibleNft !== undefined) {
                return firstEligibleNft.nft;
            }

            this.logger.warn("No suitable NFT to select.");

            return null;
        } catch(error) {
            this.logger.error("Error occurred while trying to select NFT!", { error });

            return null;
        }
    }

	_getTimelockRelativeBlockNumber(block) {
		if(block.l1BlockNumber !== undefined) {
			return Web3.utils.hexToNumber(block.l1BlockNumber);
		}

		return block.number;
	}
}
