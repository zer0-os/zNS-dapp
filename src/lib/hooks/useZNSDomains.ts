import { useMemo, useCallback } from 'react';
import { ApolloQueryResult, QueryOptions } from '@apollo/client';
import { useSubgraphProvider } from 'lib/providers/SubgraphProvider';
import { DomainQueryResult } from 'lib/types';
import { queries } from 'lib/zns';

export interface UseZNSDomainsReturn {
	getDomainData: (
		domainId: string,
	) => Promise<ApolloQueryResult<DomainQueryResult> | undefined>;
	getDomainMint: (
		domainId: string,
	) => Promise<ApolloQueryResult<DomainQueryResult> | undefined>;
}

export const useZNSDomains = (): UseZNSDomainsReturn => {
	const subgraphProvider = useSubgraphProvider();

	const getDomainData = useCallback(
		async (
			domainId: string,
		): Promise<ApolloQueryResult<DomainQueryResult> | undefined> => {
			const options: QueryOptions = {
				query: queries.byIdQuery,
				variables: { id: domainId },
				fetchPolicy: 'cache-first',
			};

			const tx = await subgraphProvider.client!.query(options);

			return tx;
		},
		[subgraphProvider.client],
	);

	const getDomainMint = useCallback(
		async (
			domainId: string,
		): Promise<ApolloQueryResult<DomainQueryResult> | undefined> => {
			const options: QueryOptions = {
				query: queries.getDomainMintEvent,
				variables: { id: domainId },
				fetchPolicy: 'cache-first',
			};

			const tx = await subgraphProvider.client!.query(options);

			return tx;
		},
		[subgraphProvider.client],
	);

	return useMemo(
		() => ({
			getDomainData,
			getDomainMint,
		}),
		[getDomainData, getDomainMint],
	);
};
