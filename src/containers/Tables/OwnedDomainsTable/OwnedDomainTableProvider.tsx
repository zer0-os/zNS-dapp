// React Imports
import React, { useState } from 'react';
//- Type Imports

import { Bid, Domain, DomainData } from 'lib/types';

type BidProviderType = {
	children: React.ReactNode;
	onNavigate: any;
}; // The request we're viewing in the request modal

export const RequestTableContext = React.createContext({
	viewBid: (domain: any) => {
		return;
	},
	rowClick: (domain: any) => {
		return;
	},
	setViewingDomainState: (domain: DomainData | undefined): void => {
		return;
	},
	viewingDomain: undefined as any,
	filterOwnBids: undefined as any,
});

const OwnedDomainTableProvider: React.FC<BidProviderType> = ({
	children,
	onNavigate,
}) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////
	const [viewingDomain, setViewingDomain] = React.useState<
		DomainData | undefined
	>();

	const viewBid = async (domain: DomainData) => {
		console.log(domain);

		setViewingDomain(domain);
	};

	const rowClick = (domain: Domain) => {
		if (onNavigate) onNavigate(domain.name);
	};

	const setViewingDomainState = (domain: DomainData | undefined) =>
		setViewingDomain(domain);
	
	let filterOwnBids = true;	

	//////////////////
	// Custom Hooks //
	//////////////////

	const contextValue = {
		viewBid,
		rowClick,
		setViewingDomainState,
		viewingDomain,
		filterOwnBids
	};

	return (
		<RequestTableContext.Provider value={contextValue}>
			{children}
		</RequestTableContext.Provider>
	);
};

export default OwnedDomainTableProvider;

export function useTableProvider() {
	const { viewBid, rowClick, setViewingDomainState, viewingDomain, filterOwnBids } =
		React.useContext(RequestTableContext);
	return { viewBid, rowClick, setViewingDomainState, viewingDomain, filterOwnBids };
}
