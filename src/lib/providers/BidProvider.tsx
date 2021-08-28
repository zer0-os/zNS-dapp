//- React Imports
import React from 'react';

//- Library Imports
import { Domain, Bid } from 'lib/types';
import { useZnsContracts } from 'lib/contracts';
import { BigNumber, ethers } from 'ethers';
import { tryFunction } from 'lib/utils';
import * as zAuction from '../zAuction';

//- Hook Imports
import useNotification from 'lib/hooks/useNotification';
import { useWeb3React } from '@web3-react/core';
import { useZAuctionBaseApiUri } from 'lib/hooks/useZAuctionBaseApiUri';
import { useChainSelector } from './ChainSelectorProvider';

export const BidContext = React.createContext({
	getBidsForDomain: async (
		domain: Domain,
		filterOwnBids?: boolean,
	): Promise<Bid[] | undefined> => {
		return;
	},
	getBidsForAccount: async (id: string): Promise<Bid[] | undefined> => {
		return;
	},
	getBidsForYourDomains: async (): Promise<Bid[] | undefined> => {
		return;
	},
	placeBid: async (
		domain: Domain,
		bid: number,
		onStep: (step: string) => void,
	): Promise<void> => {
		return;
	},
	acceptBid: async (
		bidId: Bid,
	): Promise<ethers.ContractTransaction | undefined> => {
		return;
	},
});

type BidProviderType = {
	children: React.ReactNode;
};

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
			auctionId: `${Math.random() * 10000}`,
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

const BidProvider: React.FC<BidProviderType> = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	const context = useWeb3React();
	const { addNotification } = useNotification();
	const contracts = useZnsContracts();
	const zAuctionContract = useZnsContracts()?.zAuction;
	const chainSelector = useChainSelector();
	const baseApiUri = useZAuctionBaseApiUri(chainSelector.selectedChain);

	const acceptBid = async (bidData: Bid) => {
		const tx = await tryFunction(async () => {
			if (!zAuctionContract) {
				throw Error(`no contract`);
			}

			const amountInWei = ethers.utils.parseEther(bidData.amount.toString());

			const tx = await zAuctionContract.acceptBid(
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
	};

	const getBidsForYourDomains = async () => {
		try {
			// @zachary
			// return bids from owned domains or undefined
			const mockBids = await asyncGetMock(5, 150);
			return mockBids;
		} catch (e) {
			console.error("Failed to retrieve bids for user's domains");
		}
	};

	const getBidsForAccount = async (id: string) => {
		if (baseApiUri === undefined) {
			throw Error(`no api endpoint`);
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
	};

	//this will receive either DTOs, and will populate the parameters with the correct data
	function getBidParameters(
		dto: zAuction.BidDto,
		tokenId: string | undefined,
	): Bid {
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
	}

	const getBidsForDomain = async (domain: Domain, filterOwnBids?: boolean) => {
		if (baseApiUri === undefined) {
			throw Error(`no api endpoint`);
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
	};

	const placeBid = async (
		domain: Domain,
		bid: number,
		onStep: (status: string) => void,
	) => {
		if (baseApiUri === undefined) {
			throw Error(`no api endpoint`);
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
	};

	const contextValue = {
		acceptBid,
		getBidsForAccount,
		getBidsForDomain,
		getBidsForYourDomains,
		placeBid,
	};

	return (
		<BidContext.Provider value={contextValue}>{children}</BidContext.Provider>
	);
};

export default BidProvider;

export function useBidProvider() {
	const {
		acceptBid,
		getBidsForAccount,
		getBidsForDomain,
		getBidsForYourDomains,
		placeBid,
	} = React.useContext(BidContext);
	return {
		acceptBid,
		getBidsForAccount,
		getBidsForDomain,
		getBidsForYourDomains,
		placeBid,
	};
}
