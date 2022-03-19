import { ApolloQueryResult, QueryOptions } from '@apollo/client';
import React from 'react';
import { useSubgraphProvider } from './SubgraphProvider';

import { queries } from '../zns';
import { DomainQueryResult } from 'lib/types';
import { useZnsSdk } from './ZnsSdkProvider';

interface ZNSDomainsContext {
	getDomainData: (
		domainId: string,
	) => Promise<ApolloQueryResult<DomainQueryResult> | undefined>;

	getDomainMint: (
		domainId: string,
	) => Promise<ApolloQueryResult<DomainQueryResult> | undefined>;
}

export const zNSDomainProvider = React.createContext<ZNSDomainsContext>(
	null as any,
);

export function ZNSDomainsProvider({ children }: any) {
	const subgraphProvider = useSubgraphProvider();
	const { instance: sdk } = useZnsSdk();

	const getDomainData = async (
		domainId: string,
	): Promise<ApolloQueryResult<DomainQueryResult> | undefined> => {
		const options: QueryOptions = {
			query: queries.byIdQuery,
			variables: { id: domainId },
			fetchPolicy: 'cache-first',
		};

		const tx = await subgraphProvider.client!.query(options);

		return tx;
	};

	const getDomainMint = async (
		domainId: string,
	): Promise<ApolloQueryResult<DomainQueryResult> | undefined> => {
		const options: QueryOptions = {
			query: queries.getDomainMintEvent,
			variables: { id: domainId },
			fetchPolicy: 'cache-first',
		};

		const tx = await subgraphProvider.client!.query(options);

		return tx;
	};

	const context: ZNSDomainsContext = { getDomainData, getDomainMint };

	return (
		<zNSDomainProvider.Provider value={context}>
			{children}
		</zNSDomainProvider.Provider>
	);
}

// Hook version
export function useZNSDomains() {
	return React.useContext(zNSDomainProvider);
}
