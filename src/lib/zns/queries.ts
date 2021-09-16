import { gql } from '@apollo/client';

export const byIdMint = gql`
	query DomainMinted($id: ID!) {
		domainMinteds(where: { domain: $id }) {
			id
			domain {
				id
			}
			blockNumber
			timestamp
			transactionID
			minter {
				id
			}
		}
	}
`;

export const byIdTransfers = gql`
	query DomainTransferred($id: ID!) {
		domainTransferreds(where: { domain: $id }) {
			id
			domain {
				id
			}
			blockNumber
			timestamp
			transactionID
			from {
				id
			}
			to {
				id
			}
		}
	}
`;

export const byIdQuery = gql`
	query Domain($id: ID!) {
		domain(id: $id) {
			id
			name
			parent {
				id
				name
			}
			subdomains {
				id
				name
				metadata
				owner {
					id
				}
				minter {
					id
				}
			}
			owner {
				id
			}
			minter {
				id
			}
			lockedBy
			isLocked
			metadata
		}
	}
`;

export const byNameQuery = gql`
	query Domain($name: String!) {
		domains(where: { name_contains: $name }) {
			id
			name
			parent {
				id
				name
			}
			subdomains {
				id
				name
				metadata
				owner {
					id
				}
				minter {
					id
				}
			}
			owner {
				id
			}
			minter {
				id
			}
			lockedBy
			isLocked
			metadata
		}
	}
`;

export const childDomainsQuery = gql`
	query ChildrenDomains($id: ID!) {
		domains(where: { parent: $parent }) {
			id
			name
			parent {
				id
				name
			}
			subdomains {
				id
				name
				metadata
				owner {
					id
				}
				minter {
					id
				}
			}
			owner {
				id
			}
			minter {
				id
			}
			lockedBy
			isLocked
			metadata
		}
	}
`;

export const ownedByAccountQuery = gql`
	query OwnedDomains($owner: Bytes!) {
		domains(where: { name_not: null, owner: $owner }) {
			id
			name
			parent {
				id
				name
			}
			subdomains {
				id
				name
				metadata
				owner {
					id
				}
				minter {
					id
				}
			}
			owner {
				id
			}
			minter {
				id
			}
			lockedBy
			isLocked
			metadata
		}
	}
`;
