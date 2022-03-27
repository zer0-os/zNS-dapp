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
		bidNonce: dto.bidNonce,
		nftAddress: dto.contractAddress,
		minBid: dto.minimumBid,
		startBlock: dto.startBlock,
		expireBlock: dto.expireBlock,
	};
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

	const context = useWeb3React();
	const { addNotification } = useNotification();
	const { instance: sdk } = useZnsSdk();
	const contracts = useZnsContracts();
	const zAuctionContract = useZnsContracts()?.zAuction;
	const chainSelector = useChainSelector();
	const baseApiUri = useZAuctionBaseApiUri(chainSelector.selectedChain);

	const acceptBid = useCallback(
		async (bidData: Bid) => {
			const tx = await tryFunction(async () => {
				if (!zAuctionContract) {
					throw Error(`no contract`);
				}

				const zAuction = await sdk.getZAuctionInstanceForDomain(
					bidData.tokenId,
				);
				const bids = await zAuction.listBids([bidData.tokenId]);
				const bid = bids[bidData.tokenId].filter(
					(b: any) => b.bidNonce === bidData.bidNonce,
				)[0];
				const tx = await zAuction.acceptBid(bid, context.library!.getSigner());
				return tx;
			}, 'accept bid');

			return tx;
		},
		[zAuctionContract, sdk, context.library],
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
