// React Imports
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

// Web3 Imports
import { useZnsDomain } from 'lib/hooks/useZnsDomain';
import { Maybe, Domain, Metadata } from 'lib/types';
import { getDomainId, parseDomainFromURI } from 'lib/utils';

export const CurrentDomainContext = React.createContext({
	domain: undefined as Maybe<Domain>,
	metadata: undefined as Maybe<Metadata>,
	subdomains: undefined as Maybe<Domain[]>,
	domainId: '',
	domainRaw: '/',
	app: '',
	loading: true,
	refetch: () => {}, // @todo update this
});

const CurrentDomainProvider: React.FC = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	// Get current domain from react-router-dom
	const { location } = useHistory();

	// Get current domain details from web3 hooks
	const domain = parseDomainFromURI(location.pathname);
	const domainId = getDomainId(domain);
	const znsDomain = useZnsDomain(domainId);

	const contextValue = {
		domain: znsDomain.domain,
		domainId,
		metadata: znsDomain.metadata,
		subdomains: znsDomain.subdomains,
		domainRaw: domain,
		app: location.pathname.indexOf('/market') > -1 ? '/market' : '/staking',
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
	return useContext(CurrentDomainContext);
}
