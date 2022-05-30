// React Imports
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

// Web3 Imports
import { useZnsDomain } from 'lib/hooks/useZnsDomain';
import { usePropsState } from 'lib/hooks/usePropsState';
import {
	DisplayParentDomain,
	Maybe,
	Metadata,
	PaymentTokenInfo,
} from 'lib/types';
import { getDomainId } from 'lib/utils';

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
	paymentTokenInfo: {} as PaymentTokenInfo,
});

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

	const [domainMetadata, setDomainMetadata] = usePropsState(
		znsDomain.domainMetadata,
	);

	const contextValue = {
		domain: znsDomain.domain,
		domainId,
		domainRaw: domain,
		domainMetadata,
		app: location.pathname.indexOf('/market') > -1 ? '/market' : '/staking',
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
