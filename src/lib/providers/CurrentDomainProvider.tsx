// React Imports
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

// Web3 Imports
import { useZnsDomain } from 'lib/hooks/useZnsDomain';
import { DisplayParentDomain, Maybe } from 'lib/types';
import { getDomainId } from 'lib/utils';

export const CurrentDomainContext = React.createContext({
	domain: undefined as Maybe<DisplayParentDomain>,
	app: '',
	loading: true,
	refetch: () => {}, // @todo update this
});

type CurrentDomainProviderType = {
	children: React.ReactNode;
};

const parseDomainFromURI = (pathname: string) => {
	if (pathname.startsWith('/market')) {
		return (
			pathname.replace('/market', '') === ''
				? '/'
				: pathname.replace('/market', '')
		).substring(1);
	}
	return '';
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
	const domain = parseDomainFromURI(location.pathname);
	console.log({ domain });
	const domainId = getDomainId(domain);
	const znsDomain = useZnsDomain(domainId);

	const contextValue = {
		domain: znsDomain.domain,
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
