import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React from 'react';
import { DomainRequest } from '../types';

interface RequestsForDomain {
	requests: DomainRequest[];
}

const requestsByParentQuery = gql`
	query DomainRequests($id: ID!) {
		domainRequests(where: { parent: $id }) {
			id
			parent {
				id
				name
				owner {
					id
				}
				minter
				metadata
			}
			offeredAmount
			requestUri
			label
			domain
			requestor {
				id
			}
			nonce
			approved
			fulfilled
			timestamp
		}
	}
`;

export function useQueryDomainRequestsByParentId(parentDomainId: string) {
	const query = useQuery<RequestsForDomain>(requestsByParentQuery, {
		variables: { id: parentDomainId },
		fetchPolicy: 'no-cache',
	});

	return query;
}

interface RequestsForOwner {
	domains: {
		id: string;
		name: string;
		requests: DomainRequest[];
	}[];
}

const requestsForDomainsByOwner = gql`
	query DomainRequests($owner: ID!) {
		domains(where: {owner: $owner}}) {
			id
			name
			requests {
				id
				offeredAmount
				requestUri
				label
				domain
				requestor {
					id
				}
				nonce
				approved
				fulfilled
				timestamp
			}
		}
	}
`;

export function useRequestsForOwnedDomains(account: string | undefined) {
	const [getOwned, { data, error }] = useLazyQuery<RequestsForOwner>(
		requestsForDomainsByOwner,
	);

	React.useEffect(() => {
		if (account) {
			getOwned({
				variables: { owner: account },
			});
		}
	}, [getOwned, account]);

	const requests: RequestsForOwner | undefined = React.useMemo(() => {
		if (error) {
			console.error(error);
		}

		if (data) {
			return data;
		}
	}, [error, data]);

	return { requests };
}

interface RequestsForDomain {
	requests: DomainRequest[];
}

const requestsByRequestorQuery = gql`
	query DomainRequests($requestor: ID!) {
		domainRequests(where: { requestor: $requestor }) {
			id
			parent {
				id
				name
				owner {
					id
				}
				minter
				metadata
			}
			offeredAmount
			requestUri
			label
			domain
			requestor {
				id
			}
			nonce
			approved
			fulfilled
			timestamp
		}
	}
`;

export function useRequestsMadeByAccount(account: string | undefined) {
	const [getOwned, { data, error }] = useLazyQuery<RequestsForDomain>(
		requestsByRequestorQuery,
	);

	React.useEffect(() => {
		if (account) {
			getOwned({
				variables: { requestor: account },
			});
		}
	}, [getOwned, account]);

	const requests: RequestsForDomain | undefined = React.useMemo(() => {
		if (error) {
			console.error(error);
		}

		if (data) {
			return data;
		}
	}, [error, data]);

	return { requests };
}
