//- React Imports
import React, { useState, useEffect } from 'react';

//- Library Imports
import { Domain, Bid, Encoded } from 'lib/types';
import { useZnsContracts } from 'lib/contracts';
import { encodeBid } from 'lib/zAuction';
import { BigNumber } from 'ethers';

//- Hook Imports
import useNotification from 'lib/hooks/useNotification';

export const BidContext = React.createContext({
	getBidsForDomain: async (domain: Domain): Promise<Bid[] | undefined> => {
		return;
	},
	getBidsForYourDomains: async (): Promise<Bid[] | undefined> => {
		return;
	},
	getYourBids: async (): Promise<Bid[] | undefined> => {
		return;
	},
	placeBid: async (domain: Domain, bid: number): Promise<Bid | undefined> => {
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
const getMock = (amount: number) => {
	const mockBids: Bid[] = [];
	[...Array(amount)].forEach((a: any) => {
		mockBids.push({
			amount: Math.random() * 10000,
			bidderId: `0x${Math.floor(Math.random() * 100000000000000000)}`,
			date: randomDate(),
		});
	});
	// Sort by recent
	return mockBids.sort((a, b) => {
		return b.date.valueOf() - a.date.valueOf();
	});
};

const BidProvider: React.FC<BidProviderType> = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	const { addNotification } = useNotification();
	const contracts = useZnsContracts();
	const registrarAddress = contracts ? contracts.registry.address : '';

	const getBidsForYourDomains = async () => {
		try {
			// @zachary
			// return bids from owned domains or undefined
			const mockBids = getMock(5);
			return mockBids;
		} catch (e) {
			console.error("Failed to retrieve bids for user's domains");
		}
	};

	const getYourBids = async () => {
		try {
			// @zachary
			// return bids placed by user or undefined
			const mockBids = getMock(5);
			return mockBids;
		} catch (e) {
			console.error("Failed to retrieve bids for user's domains");
		}
	};

	const getBidsForDomain = async (domain: Domain) => {
		try {
			// @zachary
			// return bid array or undefined
			const mockBids = getMock(5);
			return mockBids;
		} catch (e) {
			console.error('Failed to retrive bids for domain ' + domain);
			return;
		}
	};

	const placeBid = async (domain: Domain, bid: number) => {
		// Replace with bid functionality
		try {
			const data = await _getEncodedData(domain.id);

			// @zachary
			// return bid data or undefined
			addNotification(`Placed ${bid} WILD bid for ${domain.name}`);
			const mockBids = getMock(1);
			return mockBids[0];
		} catch (e) {
			console.error(e);
			return;
		}
	};

	const _getEncodedData = async (domainId: string) => {
		const tokenId = BigNumber.from(domainId).toString();
		const encoded = await encodeBid(registrarAddress, tokenId);
		return encoded;
	};

	const contextValue = {
		getBidsForDomain,
		getBidsForYourDomains,
		getYourBids,
		placeBid,
	};

	return (
		<BidContext.Provider value={contextValue}>{children}</BidContext.Provider>
	);
};

export default BidProvider;

export function useBidProvider() {
	const { getBidsForDomain, getBidsForYourDomains, getYourBids, placeBid } =
		React.useContext(BidContext);
	return { getBidsForDomain, getBidsForYourDomains, getYourBids, placeBid };
}
