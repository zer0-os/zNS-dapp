import { gql } from '@apollo/client';

export const SubdomainQuery = gql`
  query ChildrenDomains($parent: ID!) {
    domains(where: { parent: $parent }) {
      id
      name
      subdomains
      owner
      minter
      lockedBy
      isLocked
      metadata
    }
  }
`;
