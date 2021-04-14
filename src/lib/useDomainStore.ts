import { ApolloQueryResult, gql, useLazyQuery, useQuery } from '@apollo/client';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { getAddress } from 'ethers/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Maybe } from 'true-myth';
import { getDomainId } from './domains';

export interface Domain {
  id: string;
  name: string;
  parent: string;
  subdomains: string[];
  owner: string;
  minter: string;
  metadata: string;
}

interface _DomainData {
  id: string;
  name: string;
  parent: string;
  subdomains: string[];
  owner: string;
  minter: string;
  metadata: string;
}

interface DomainData {
  domains: _DomainData[];
}

interface DomainData {
  domain: _DomainData;
}

// interface ZeroTransaction {
//   txHash: string;
//   method: string;
//   description: string;
//   pending: boolean;
//   nonce: number;
// }
export const zeroAddress: any =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

export const DOMAIN_QUERY = gql`
  query Domain($id: ID!) {
    domains(where: { id: $id }) {
      id
      name
      parent {
        id
        name
      }
      subdomains {
        id
        name
      }
      owner
      minter
      lockedBy
      isLocked
      metadata
    }
  }
`;

export const CHILDREN_QUERY = gql`
  query ChildrenDomains($id: ID!) {
    domains(where: { parent: $parent }) {
      id
      name
      subdomains
      owner
      minter
      lockedBy
      isLocked
    }
  }
`;

export const OWNED_DOMAIN_QUERY = gql`
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
    }
  }
`;

const ALL_DOMAIN_QUERY = gql`
  query allDomain($id: ID!) {
    domains(where: { id: $id }) {
      id
      parent
      name
    }
  }
`;

type QueryArgs = Partial<Record<string, any>>;

type RefetchQuery<T> = (variables?: QueryArgs) => Promise<ApolloQueryResult<T>>;

function useDomain(name: string) {
  const {
    data: dataDomain,
    error: errorDomain,
    refetch: refetchDomain,
  } = useQuery<DomainData>(DOMAIN_QUERY, {
    variables: { id: name },
    fetchPolicy:  'no-cache',
  });
  console.log(name, 'DOMAIN STORE NAME')
  const _domain: Maybe<any> = useMemo(() => {
    if (dataDomain && dataDomain.domains) {
      const test = dataDomain;
      console.log(test, 'dataDomains');

      return Maybe.of({
        ...dataDomain.domains[0],
        // id: dataDomain.domain.id,
        // name: dataDomain.domain.name,
        // parent: dataDomain.domain.parent,
        // subdomains: dataDomain.domain.subdomains,
        // owner: dataDomain.domain.owner,
        // minter: dataDomain.domain.minter,
        // metadata: dataDomain.domain.metadata,
        // id: 'test',
        // name: 'test',
        // parent: 'test',
        // subdomains: [],
        // owner: 'test',
        // minter: 'test',
        // metadata: 'test',

        // owner: getAddress(dataDomain.domain.owner),
        // parent: dataDomain.domain.parent,
        // minter: getAddress(dataDomain.domain.minter),
        // metadata: dataDomain.domain.metadata,
        // subdomains: dataDomain.domain.subdomains,
      });
    }

    // console.log(JSON.stringify(dataDomain) + 'dataDomain2');
    if (errorDomain) {
      console.error(errorDomain + 'Error');
    }
    // console.log(dataDomain + 'dataDomain');
    // console.log(dataDomain + 'Domain Data');
    return Maybe.nothing();
  }, [dataDomain, errorDomain]);

  const refetch = useCallback(
    (domainId?: string) =>
      Promise.all([
        refetchDomain({ variables: { id: domainId } }),
        // refetchChildren(<any>{ variables: { parent: domainId } }),
      ]),

    [refetchDomain],
  );
  // console.log(JSON.stringify(dataDomain) + 'return function');
  return { name: _domain, refetchDomain: refetch! };
}

function useOwnedDomains(): {
  owned: Maybe<any[]>;
  refetchOwned: RefetchQuery<any>;
} {
  const context = useWeb3React<Web3Provider>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { account } = context;
  const [getOwned, { data, refetch, error }] = useLazyQuery<any>(
    OWNED_DOMAIN_QUERY,
    {
      variables: { owner: account },
    },
  );

  const owned: Maybe<any[]> = useMemo(() => {
    if (error) {
      // TODO: maybe throw?
      console.error(error);
    }
    if (data) {
      return Maybe.of(
        data.domains.map((d: any) => ({
          ...d,
          owner: getAddress(d.owner),
          parent: d.parent,
          subdomains: [],

          metadata: d.metadata,
        })),
      );
    }
    return Maybe.nothing();
  }, [error, data]);

  useEffect(() => {
    if (refetch) {
      refetch({ variables: { owner: account } });
    } else if (account) {
      getOwned({ variables: { owner: account } });
    }
  }, [account, getOwned, refetch]);

  //console.log('usedomain list', owned);

  useEffect(() => {
    if (refetch) {
      refetch({ variables: { owner: account } });
    } else if (account) {
      getOwned({ variables: { owner: account } });
    }
  }, [account, getOwned, refetch]);

  return { owned, refetchOwned: refetch! };
}

// maybe fx
function useAllDomains(
  domain: string,
): {
  _allDomains: Maybe<any[]>;
  refetchAllDomains: RefetchQuery<any>;
} {
  const id = getDomainId(domain);
  // const context = useWeb3React<Web3Provider>();
  // const { account } = context;
  const [getAllDomains, { data, refetch, error }] = useLazyQuery<any>(
    ALL_DOMAIN_QUERY,
    {
      variables: { id },
    },
  );

  const _allDomains: Maybe<any[]> = useMemo(() => {
    if (error) {
      // TODO: maybe throw?
      console.error(error);
    }
    if (data) {
      return Maybe.of(
        data.domains.map((d: any) => ({
          ...d,
          owner: getAddress(d.owner),
          name: d.name,
        })),
      );
    }
    return Maybe.nothing();
  }, [data, error]);

  useEffect(() => {
    if (refetch) {
      refetch({ variables: { to: id } });
    } else if (domain) {
      getAllDomains({ variables: { to: id } });
    }
  }, [domain, getAllDomains, id, refetch]);

  return { _allDomains, refetchAllDomains: refetch! };
}

const useDomainStore = () => {
  const owned = useOwnedDomains();
  const [transactions, setTransactions] = useState<any[]>([]);

  const pushTransaction = useCallback(
    (tx: any) => {
      setTransactions(
        transactions.filter((_tx) => _tx.nonce !== tx.nonce).concat(tx),
      );
    },
    [transactions, setTransactions],
  );

  const updateTransaction = useCallback(
    (tx: any) => {
      const txIndex = transactions.findIndex((_tx) => _tx.txHash === tx.txHash);
      if (txIndex < 0) {
        console.error(
          `updateTransaction: could not find transaction ${tx.txHash}`,
        );
        return;
      }
      transactions[txIndex] = tx;
      setTransactions(transactions);
    },
    [transactions, setTransactions],
  );

  return {
    useDomain,
    useAllDomains,
    ...owned,
    pushTransaction,
    updateTransaction,
    transactions,
  };
};

export type DomainStoreContext = ReturnType<typeof useDomainStore>;

export type DomainContext = ReturnType<typeof useDomain>;

export { useDomainStore };
// function subdomains(subdomains: any, arg1: string) {
//   throw new Error('Function not implemented.');
// }
