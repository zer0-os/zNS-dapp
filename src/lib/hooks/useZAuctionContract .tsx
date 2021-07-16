import { useZnsContracts } from 'lib/contracts';
import { tryFunction } from 'lib/utils';
import { ethers } from 'ethers';

export interface AcceptBidParams {
	signature: ethers.BytesLike;
	auctionId: number;
	bidder: string;
	bid: number;
	nftAddress: string;
	tokenId: number;
	minBid: number;
	startBlock: number;
	expireBlock: number;
}

interface ZauctionContractHook {
	acceptBid: (params: AcceptBidParams) => Promise<ethers.ContractTransaction>;
}

export function useZAuctionContract (): ZauctionContractHook {
	const zAuctionContract = useZnsContracts()?.zAuction;

	const acceptBid = async (params: AcceptBidParams) => {
		const tx = await tryFunction(async () => {
			if (!zAuctionContract) {
				throw Error(`no contract`);
			}

			const tx = await zAuctionContract.acceptBid(
				params.signature,
				params.auctionId,
				params.bidder,
				params.bid,
				params.nftAddress,
				params.tokenId,
				params.minBid,
				params.startBlock,
				params.expireBlock,
			);

			return tx;
		}, 'approve request');

		return tx;
	};

	return { acceptBid };
}
