// React Imports
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';

// Web3 Imports
import { useZnsDomain } from 'lib/hooks/useZnsDomain';
import { usePropsState } from 'lib/hooks/usePropsState';
import { DisplayParentDomain, Maybe, Metadata } from 'lib/types';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { defaultNetworkId } from 'lib/network';
import { getDomainId, zNAFromPathname } from 'lib/utils';

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

const CurrentDomainProvider: React.FC = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	// Get current domain from react-router-dom
	const { chainId } = useWeb3React<Web3Provider>(); // get provider for connected wallet
	const { pathname } = useLocation();

	// Get current domain details from web3 hooks
	const domain = zNAFromPathname(pathname);

	const zna =
		ROOT_DOMAIN +
		(domain.length ? (IS_DEFAULT_NETWORK ? domain : '.' + domain) : '');

	const domainId = getDomainId(zna);
	const znsDomain = useZnsDomain(domainId, chainId || defaultNetworkId);

	const [domainMetadata, setDomainMetadata] = usePropsState(
		znsDomain.domainMetadata,
	);

	// Change document title based on current network
	if (
		zna.length > 0 &&
		zna !== process.env.REACT_APP_NETWORK &&
		domainMetadata?.title
	) {
		document.title = domainMetadata.title + ' | ' + process.env.REACT_APP_TITLE;
	} else {
		document.title = 'Market | ' + process.env.REACT_APP_TITLE;
	}

	const contextValue = {
		domain: znsDomain.domain,
		domainId,
		domainRaw: domain,
		domainMetadata,
		app:
			pathname.indexOf(ROUTES.MARKET) > -1
				? ROUTES.MARKET
				: ROUTES.STAKING + ROUTES.STAKING_POOLS,
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
