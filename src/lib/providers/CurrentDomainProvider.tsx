// React Imports
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

// Web3 Imports
import { useZnsDomain } from 'lib/hooks/useZnsDomain';
import { usePropsState } from 'lib/hooks/usePropsState';
import { DisplayParentDomain, Maybe, Metadata } from 'lib/types';
import { getDomainId } from 'lib/utils';

// Constants Imports
import { ROUTES } from 'constants/routes';
import { IS_DEFAULT_NETWORK, ROOT_DOMAIN } from '../../constants/domains';

export const CurrentDomainContext = React.createContext({
	domain: undefined as Maybe<DisplayParentDomain>,
	domainId: '',
	domainRaw: '/',
	domainMetadata: undefined as Maybe<Metadata>,
	app: '',
	loading: true,
	refetch: () => {}, // @todo update this
	setDomainMetadata: (v: Maybe<Metadata>) => {},
});

const parseDomainFromURI = (pathname: string) => {
	if (pathname.startsWith(ROUTES.MARKET)) {
		return (
			pathname.replace(ROUTES.MARKET, '') === ''
				? '/'
				: pathname.replace(ROUTES.MARKET, '')
		).substring(1);
	}
	return '';
};

const CurrentDomainProvider: React.FC = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	// Get current domain from react-router-dom
	const { location } = useHistory();

	// Get current domain details from web3 hooks
	const domain = parseDomainFromURI(location.pathname);
	const zna =
		ROOT_DOMAIN +
		(domain.length ? (IS_DEFAULT_NETWORK ? domain : '.' + domain) : '');

	const domainId = getDomainId(zna);
	const znsDomain = useZnsDomain(domainId);
	const [domainMetadata, setDomainMetadata] = usePropsState(
		znsDomain.domainMetadata,
	);

	const contextValue = {
		domain: znsDomain.domain,
		domainId,
		domainRaw: domain,
		domainMetadata,
		app:
			location.pathname.indexOf(ROUTES.MARKET) > -1
				? ROUTES.MARKET
				: ROUTES.STAKING,
		loading: znsDomain.loading,
		refetch: znsDomain.refetch,
		setDomainMetadata,
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
