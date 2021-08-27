import { DocumentNode, OperationVariables, useQuery } from '@apollo/client';
import {
	DomainQueryResult,
	DomainsQueryResult,
	Maybe,
	ParentDomain,
} from 'lib/types';
import { getDomainId } from 'lib/utils';

import { queries } from '../zns';

const defaultFetchPolicy = 'cache-and-network';

function useQueryHook<T>(query: DocumentNode, variables?: OperationVariables) {
	const hook = useQuery<T>(query, {
		variables,
		fetchPolicy: defaultFetchPolicy,
		pollInterval: 5000,
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

export function useDomainByNameQuery(domainName: string) {
	const id = getDomainId(domainName);
	const query = useDomainByIdQuery(id);
	return query;
}

export function useDomainsOwnedByUserQuery(account: string) {
	const query = useQueryHook<DomainsQueryResult>(queries.ownedByAccountQuery, {
		owner: account.toLowerCase(),
	});

	return query;
}
