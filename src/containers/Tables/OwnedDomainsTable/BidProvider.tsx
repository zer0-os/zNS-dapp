// React Imports
import { Bid } from '@zero-tech/zauction-sdk';
import { Domain } from '@zero-tech/zns-sdk';
import React, { useState } from 'react';

type DomainSelection = {
	domain: Domain;
	bids: Bid[];
};

export const BidContext = React.createContext({
	selectedDomain: undefined as DomainSelection | undefined,
	selectDomain: (domain?: DomainSelection) => {
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

	const [selectedDomain, setSelectedDomain] = useState<
		DomainSelection | undefined
	>();

	const selectDomain = (domain?: DomainSelection) => {
		setSelectedDomain(domain);
	};

	const contextValue = {
		selectedDomain,
		selectDomain,
	};

	return (
		<BidContext.Provider value={contextValue}>{children}</BidContext.Provider>
	);
};

export default BidProvider;

export function useBid() {
	const { selectedDomain, selectDomain } = React.useContext(BidContext);
	return { selectedDomain, selectDomain };
}
