// React Imports
import React, { useState } from 'react';

// Web3 Imports
import { Domain, Maybe } from 'lib/types';

export const BidContext = React.createContext({
	domain: undefined as Maybe<Domain>,
	makeABid: (domain: Domain) => {
		return;
	},
	close: () => {
		return;
	},
	bidPlaced: () => {
		return;
	},
	updated: undefined as Maybe<Domain>,
});

type BidProviderType = {
	children: React.ReactNode;
};

const BidProvider: React.FC<BidProviderType> = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	const [biddingOn, setBiddingOn] = useState<Maybe<Domain>>();
	const [updated, setUpdated] = useState<Maybe<Domain>>();

	const makeABid = (domain: Domain) => {
		setBiddingOn(domain);
	};

	const close = () => {
		setBiddingOn(undefined);
	};

	const bidPlaced = () => {
		setUpdated(biddingOn);
		setBiddingOn(undefined);

		// This is a bad solution long term
		setTimeout(() => {
			setUpdated(undefined);
		}, 1000);
	};

	const contextValue = {
		domain: biddingOn,
		makeABid,
		close,
		bidPlaced,
		updated,
	};

	return (
		<BidContext.Provider value={contextValue}>{children}</BidContext.Provider>
	);
};

export default BidProvider;

export function useBid() {
	const { bidPlaced, updated, domain, makeABid, close } =
		React.useContext(BidContext);
	return { bidPlaced, updated, domain, makeABid, close };
}
