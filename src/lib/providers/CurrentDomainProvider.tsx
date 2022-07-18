// React Imports
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';

// Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ConvertedTokenInfo } from '@zero-tech/zns-sdk';

//- Library Imports
import { getDocumentTitle } from 'lib/utils/documentTitle';
import { defaultNetworkId } from 'lib/network';
import { appFromPathname, getDomainId, zNAFromPathname } from 'lib/utils';
import { useZnsDomain } from 'lib/hooks/useZnsDomain';
import { usePropsState } from 'lib/hooks/usePropsState';
import { DisplayParentDomain, Maybe, Metadata } from 'lib/types';

// Constants Imports
import { IS_DEFAULT_NETWORK, ROOT_DOMAIN } from '../../constants/domains';
import { ROUTES } from 'constants/routes';

export const CurrentDomainContext = React.createContext({
	domain: undefined as Maybe<DisplayParentDomain>,
	domainId: '',
	domainRaw: '/',
	domainMetadata: undefined as Maybe<Metadata>,
	app: '',
	loading: true,
	refetch: () => {}, // @todo update this
	setDomainMetadata: (v: Maybe<Metadata>) => {},
	paymentToken: undefined as Maybe<string>,
	paymentTokenInfo: {} as ConvertedTokenInfo,
});

const CurrentDomainProvider: React.FC = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	const { chainId } = useWeb3React<Web3Provider>(); // get provider for connected wallet

	// Get current domain from react-router-dom
	const { pathname } = useLocation();

	const domain = zNAFromPathname(pathname);

	const zna =
		ROOT_DOMAIN +
		(domain.length ? (IS_DEFAULT_NETWORK ? domain : '.' + domain) : '');

	const domainId = getDomainId(zna);
	const znsDomain = useZnsDomain(domainId, chainId || defaultNetworkId);
	const [domainMetadata, setDomainMetadata] = usePropsState(
		znsDomain.domainMetadata,
	);
	const appPathname = appFromPathname(pathname);
	const app =
		appPathname === ROUTES.STAKING
			? ROUTES.STAKING + ROUTES.STAKING_POOLS
			: appPathname;

	getDocumentTitle(zna, app, domainMetadata?.title);

	const contextValue = {
		domain: znsDomain.domain,
		domainId,
		domainRaw: domain,
		domainMetadata,
		app: app,
		loading: znsDomain.loading,
		refetch: znsDomain.refetch,
		setDomainMetadata,
		paymentToken: znsDomain.paymentToken,
		paymentTokenInfo: {
			...znsDomain.paymentTokenInfo,
			id: znsDomain.paymentToken || '',
		},
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
