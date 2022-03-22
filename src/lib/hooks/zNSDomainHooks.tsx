import { DocumentNode, OperationVariables, useQuery } from '@apollo/client';
import { DomainQueryResult, DomainsQueryResult } from 'lib/types';

import { queries } from '../zns';

const defaultFetchPolicy = 'cache-and-network';

function useQueryHook<T>(
	query: DocumentNode,
	variables?: OperationVariables,
	pollInterval?: number,
) {
	const hook = useQuery<T>(query, {
		variables,
		fetchPolicy: defaultFetchPolicy,
		pollInterval: pollInterval,
	});

	return hook;
}

export function useDomainsByNameContainsQuery(pattern: string) {
	const query = useQueryHook<DomainsQueryResult>(queries.byNameQuery, {
		name: pattern,
	});

	return query;
}

export function useDomainByIdQuery(domainId: string) {
	const query = useQueryHook<DomainQueryResult>(queries.byIdQuery, {
		id: domainId,
	});

	return query;
}

export function useDomainsOwnedByUserQuery(
	account: string,
	pollInterval?: number,
) {
	const query = useQueryHook<DomainsQueryResult>(
		queries.ownedByAccountQuery,
		{
			owner: account.toLowerCase(),
		},
		pollInterval,
	);

	return query;
}
