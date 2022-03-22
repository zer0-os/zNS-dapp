import { gql } from '@apollo/client';

export const byIdQuery = gql`
	query Domain($id: ID!) {
		domain(id: $id) {
			id
			name
			parent {
				id
				name
			}
			subdomains(first: 1000) {
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
			lockedBy {
				id
			}
			contract {
				id
			}
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
			subdomains(first: 1000) {
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
			lockedBy {
				id
			}
			contract {
				id
			}
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
			subdomains(first: 1000) {
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
			lockedBy {
				id
			}
			contract {
				id
			}
			isLocked
			metadata
		}
	}
`;
