// React Imports
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Web3 Imports
import { useZnsDomain } from 'lib/hooks/useZnsDomain';
import { DisplayParentDomain, Maybe } from 'lib/types';
import { getDomainId } from 'lib/utils';

export const CurrentDomainContext = React.createContext({
	domain: undefined as Maybe<DisplayParentDomain>,
	loading: true,
	refetch: () => {}, // @todo update this
});

type CurrentDomainProviderType = {
	children: React.ReactNode;
};

const CurrentDomainProvider: React.FC<CurrentDomainProviderType> = ({
	children,
}) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	// Get current domain from react-router-dom
	const { location } = useHistory();

	// Get current domain details from web3 hooks
	const domain = location.pathname.substring(1);
	const domainId = getDomainId(domain);
	const znsDomain = useZnsDomain(domainId);

	const contextValue = {
		domain: znsDomain.domain,
		loading: znsDomain.loading,
		refetch: znsDomain.refetch,
	};

	return (
		<CurrentDomainContext.Provider value={contextValue}>
			{children}
		</CurrentDomainContext.Provider>
	);
};

export default CurrentDomainProvider;

export function useCurrentDomain() {
	const { domain, loading, refetch } = React.useContext(CurrentDomainContext);
	return { domain, loading, refetch };
}
