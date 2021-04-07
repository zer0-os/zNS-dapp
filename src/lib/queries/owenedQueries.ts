import { gql } from '@apollo/client';

const OwnedDomainsQuery = gql`
  query OwnedDomains($owner: Bytes!) {
    domains(where: { owner: $owner }) {
      id
      name
      parent
      subdomains
      owner
      minter
      lockedBy
      isLocked
      metadata
    }
  }
`;
