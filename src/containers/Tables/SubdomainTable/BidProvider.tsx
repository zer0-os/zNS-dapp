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
});

type BidProviderType = {
	children: React.ReactNode;
};

const BidProvider: React.FC<BidProviderType> = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	const [biddingOn, setBiddingOn] = useState<Maybe<Domain>>();

	const makeABid = (domain: Domain) => {
		setBiddingOn(domain);
	};

	const close = () => {
		setBiddingOn(undefined);
	};

	const contextValue = {
		domain: biddingOn,
		makeABid,
		close,
	};

	return (
		<BidContext.Provider value={contextValue}>{children}</BidContext.Provider>
	);
};

export default BidProvider;

export function useBid() {
	const { domain, makeABid, close } = React.useContext(BidContext);
	return { domain, makeABid, close };
}
