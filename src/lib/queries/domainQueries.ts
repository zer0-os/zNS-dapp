import { gql } from '@apollo/client';

export const domainQuery = gql`
  query Domain($id: ID!) {
    domains(id: $id) {
      id
      name
      parent
      owner
      minter
      lockedBy
      isLocked
      metadata
    }
  }
`;
