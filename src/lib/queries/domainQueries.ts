// import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApolloQueryResult, gql, useLazyQuery, useQuery } from '@apollo/client';

export const DomainQuery = gql`
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
