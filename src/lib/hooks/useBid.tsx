//- React Imports
import { useCallback, useMemo } from 'react';

//- Library Imports
import { Domain, Bid } from 'lib/types';
import { useZnsContracts } from 'lib/contracts';
import { ethers } from 'ethers';
import { tryFunction } from 'lib/utils';
import * as zAuction from '../zAuction';

//- Hook Imports
import { useWeb3React } from '@web3-react/core';
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';
import { useZAuctionBaseApiUri } from './useZAuctionBaseApiUri';
import useNotification from './useNotification';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';

// This will receive either DTOs, and will populate the parameters with the correct data
const getBidParameters = (
	dto: zAuction.BidDto,
	tokenId: string | undefined,
): Bid => {
	const amount = Number(ethers.utils.formatEther(dto.bidAmount));

	return {
		bidderAccount: dto.account,
		amount,
		date: new Date(dto.date),
		tokenId: dto.tokenId,
		signature: dto.signedMessage,
		auctionId: dto.auctionId,
		nftAddress: dto.contractAddress,
		minBid: dto.minimumBid,
		startBlock: dto.startBlock,
		expireBlock: dto.expireBlock,
	};
};

export type UseBidReturn = {
	acceptBid: (bidData: Bid) => Promise<ethers.ContractTransaction>;
	getBidsForYourDomains: () => Promise<Bid[] | undefined>;
	getBidsForAccount: (id: string) => Promise<Bid[] | undefined>;
	getBidsForDomain: (
		domain: Domain,
		filterOwnBids?: boolean | undefined,
	) => Promise<Bid[] | undefined>;
	placeBid: (
		domain: Domain,
		bid: number,
		onStep: (status: string) => void,
	) => Promise<void>;
};

export const useBid = (): UseBidReturn => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	const context = useWeb3React();
	const { addNotification } = useNotification();
	const contracts = useZnsContracts();
	const zAuctionContract = useZnsContracts()?.zAuction;
	const chainSelector = useChainSelector();
	const baseApiUri = useZAuctionBaseApiUri(chainSelector.selectedChain);

	const { instance: sdk } = useZnsSdk();

	const acceptBid = useCallback(
		async (bidData: Bid) => {
			const tx = await tryFunction(async () => {
				if (!zAuctionContract) {
					throw Error(`no contract`);
				}

				const amountInWei = ethers.utils.parseEther(bidData.amount.toString());

				const tx = await zAuctionContract!.acceptBid(
					bidData.signature,
					bidData.auctionId,
					bidData.bidderAccount,
					amountInWei,
					bidData.nftAddress,
					bidData.tokenId,
					bidData.minBid,
					bidData.startBlock,
					bidData.expireBlock,
				);

				return tx;
			}, 'accept bid');

			return tx;
		},
		[zAuctionContract],
	);

	const getBidsForYourDomains = useCallback(async () => {
		// Currently unimplemented
		return [];
	}, []);

	const getBidsForAccount = useCallback(
		async (id: string) => {
			if (baseApiUri === undefined) {
				console.warn('no api endpoint');
				return;
			}

			try {
				const bids = await zAuction.getBidsForAccount(baseApiUri, id);

				try {
					const displayBids = bids.map((e) => {
						return getBidParameters(e, undefined);
					});

					return displayBids;
				} catch (e) {
					console.error('Failed to retrieve bids for user ' + id);
				}
			} catch (e) {
				console.error('Failed to retrieve bids for user ' + id);
				return [];
			}
		},
		[baseApiUri],
	);

	const getBidsForDomain = useCallback(
		async (domain: Domain, filterOwnBids?: boolean) => {
			if (baseApiUri === undefined) {
				console.warn('no api endpoint');
				return;
			}

			try {
				let bids = (await zAuction.getBidsForNft(
					baseApiUri,
					contracts!.registry.address,
					domain.id,
				)) as zAuction.BidDto[];

				try {
					if (filterOwnBids) {
						bids = bids.filter((e) => {
							return e.account.toLowerCase() !== domain.owner.id.toLowerCase();
						});
					}

					let displayBids = bids.map((e) => {
						return getBidParameters(e, domain.id);
					});

					displayBids.sort((a, b) => {
						return b.amount - a.amount;
					});

					// @TODO: Add filtering expired/invalid bids out
					return displayBids;
				} catch (e) {
					return;
				}
			} catch (e) {
				console.error(`Failed to retrieve bids for ${domain.id}: ${e}`);
				return;
			}
		},
		[baseApiUri, contracts],
	);

	const placeBid = useCallback(
		async (domain: Domain, bid: number, onStep: (status: string) => void) => {
			if (baseApiUri === undefined) {
				console.warn('no api endpoint');
				return;
			}

			await zAuction.placeBid(
				baseApiUri,
				context.library!,
				contracts!.registry.address,
				domain.id,
				ethers.utils.parseEther(bid.toString()).toString(),
				onStep,
			);
			addNotification(`Placed ${bid} WILD bid for ${domain.name}`);
		},
		[baseApiUri, contracts, context.library, addNotification],
	);

	return useMemo(
		() => ({
			acceptBid,
			getBidsForAccount,
			getBidsForDomain,
			getBidsForYourDomains,
			placeBid,
		}),
		[
			acceptBid,
			getBidsForAccount,
			getBidsForDomain,
			getBidsForYourDomains,
			placeBid,
		],
	);
};
