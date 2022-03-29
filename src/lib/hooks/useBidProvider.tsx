//- React Imports
import { useCallback, useMemo } from 'react';

//- Library Imports
import { Domain, Bid } from 'lib/types';
import { ethers } from 'ethers';
import { tryFunction } from 'lib/utils';

//- Hook Imports
import { useWeb3React } from '@web3-react/core';
import useNotification from './useNotification';
import { useZnsSdk } from 'lib/hooks/sdk';
import { Bid as zAuctionBid } from '@zero-tech/zauction-sdk/lib/api/types';
import { PlaceBidStatus } from '@zero-tech/zauction-sdk';
import { Web3Provider } from '@ethersproject/providers';

/////////////////////
// Mock data stuff //
/////////////////////

const randomDate = () => {
	const start = new Date(2012, 0, 1);
	const end = new Date();
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime()),
	);
};

// Create some mock bids
export const getMock = (amount: number) => {
	const mockBids: Bid[] = [];
	[...Array(amount)].forEach((a: any) => {
		mockBids.push({
			amount: Math.random() * 10000,
			bidderAccount: `0x${Math.floor(Math.random() * 100000000000000000)}`,
			date: randomDate(),
			tokenId: `${Math.random() * 10000}`,
			bidNonce: `${Math.random() * 10000}`,
			nftAddress: `0x${Math.floor(Math.random() * 100000000000000000)}`,
			minBid: `0`,
			startBlock: `0`,
			expireBlock: `999999999999`,
			signature: `0x${Math.floor(Math.random() * 100000000000000000)}`,
		});
	});
	// Sort by recent
	return mockBids.sort((a, b) => {
		return b.date.valueOf() - a.date.valueOf();
	});
};

const asyncGetMock = async (amount: number, timeout: number) => {
	await new Promise((resolve) => setTimeout(resolve, timeout));
	return getMock(amount);
};

const transformBid = (bid: zAuctionBid) => {
	return {
		bidderAccount: bid.bidder,
		amount: Number(ethers.utils.formatEther(bid.amount)),
		date: new Date(Number(bid.timestamp)),
		tokenId: bid.tokenId,
		signature: bid.signedMessage,
		auctionId: bid.bidNonce,
		bidNonce: bid.bidNonce,
		nftAddress: bid.contract,
		// TODO: No minBid property on zAuctionBid
		minBid: '0',
		startBlock: bid.startBlock,
		expireBlock: bid.expireBlock,
	} as Bid;
};

export type UseBidProviderReturn = {
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

export const useBidProvider = (): UseBidProviderReturn => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	const { library } = useWeb3React<Web3Provider>();
	const { addNotification } = useNotification();
	const { instance: sdk } = useZnsSdk();

	const acceptBid = useCallback(
		async (bidData: Bid) => {
			const tx = await tryFunction(async () => {
				if (sdk === undefined || sdk.zauction === undefined) {
					throw Error(`No zAuctionInstance`);
				}

				const bids = await sdk.zauction.listBids(bidData.tokenId);
				const bid = bids.filter((b: any) => b.bidNonce === bidData.bidNonce)[0];
				const tx = await sdk.zauction.acceptBid(bid, library!.getSigner());
				return tx;
			}, 'accept bid');

			return tx;
		},
		[sdk, library],
	);

	const getBidsForYourDomains = useCallback(async () => {
		try {
			// @zachary
			// return bids from owned domains or undefined
			const mockBids = await asyncGetMock(5, 150);
			return mockBids;
		} catch (e) {
			console.error("Failed to retrieve bids for user's domains");
		}
	}, []);

	const getBidsForAccount = useCallback(
		async (id: string) => {
			if (sdk === undefined || sdk.zauction === undefined) {
				console.warn('No zAuctionInstance');
				return;
			}

			try {
				const bids = await sdk.zauction.listBidsByAccount(id);
				const displayBids = bids.map((e) => transformBid(e));

				return displayBids;
			} catch (e) {
				console.error('Failed to retrieve bids for user ' + id);
				return [];
			}
		},
		[sdk],
	);

	const getBidsForDomain = useCallback(
		async (domain: Domain, filterOwnBids?: boolean) => {
			if (sdk === undefined || sdk.zauction === undefined) {
				console.warn('No zAuctionInstance');
				return;
			}

			try {
				let bids = await sdk.zauction.listBids(domain.id);

				try {
					if (filterOwnBids) {
						bids = bids.filter((e) => {
							return e.bidder.toLowerCase() !== domain.owner.id.toLowerCase();
						});
					}

					let displayBids = bids.map((e) => transformBid(e));

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
		[sdk],
	);

	const onPlaceBidStatusChange = (
		status: PlaceBidStatus,
		onStep: (status: string) => void,
	) => {
		switch (status) {
			case 0:
				onStep('Generating bid...');
				break;
			case 1:
				onStep('Waiting for bid to be signed by wallet...');
				break;
			case 2:
				onStep('Submitting bid...');
				break;
			case 3:
				onStep('Validating bid...');
				break;
			default:
				throw Error(`Failed to submit bid.`);
		}
	};

	const placeBid = useCallback(
		async (domain: Domain, bid: number, onStep: (status: string) => void) => {
			if (sdk?.zauction === undefined) {
				console.warn('No zAuctionInstance');
				return;
			}
			if (!library) {
				console.error('Could not find web3 library');
				return;
			}

			try {
				await sdk.zauction.placeBid(
					{
						domainId: domain.id,
						bidAmount: ethers.utils.parseEther(bid.toString()),
					},
					library!.getSigner(),
					(status) => onPlaceBidStatusChange(status, onStep),
				);
				addNotification(`Placed ${bid} WILD bid for ${domain.name}`);
			} catch (e) {
				console.warn(e);
			}
		},
		[sdk, library, addNotification],
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
