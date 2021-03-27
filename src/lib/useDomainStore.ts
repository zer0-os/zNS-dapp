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
  children: string[];
  owner: string;
  controller: string;
  metadata: string;
  parent: string;
  timeCreated: number;
}

interface _DomainData {
  id: string;
  name: string;
  owner: string;
  parent: string;
  controller: string;
  subdomains: string;
  timeCreated: number;
  metadata: string;
}

interface DomainsData {
  domains: _DomainData[];
}

interface DomainData {
  domain: _DomainData;
}

interface ZeroTransaction {
  txHash: string;
  method: string;
  description: string;
  pending: boolean;
  nonce: number;
}
export const zeroAddress: any =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
// TODO: turn queries into fragments
const domainQuery = gql`
  query Domain($id: ID!) {
    domain(id: $id) {
      id
      name
      parent
      subdomains
      owner
      minter
      lockedBy
      isLocked
      metadata
      timeStamp
    }
  }
`;

const childrenQuery = gql`
  query ChildrenDomains($parent: Bytes!) {
    domains(where: { parent: $parent }) {
      id
      name
      parent
      subdomains
      owner
      minter
      lockedBy
      isLocked
      metadata
      timeStamp
    }
  }
`;

const ownedDomainsQuery = gql`
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
      timeStamp
    }
  }
`;

const allDomainsQuery = gql`
  query Domain($id: ID!) {
    domains(where: { parent: $parent }) {
      id
      parent
      name
      subdomain
    }
  }
`;

type QueryArgs = Partial<Record<string, any>> | undefined;

type RefetchQuery<T> = (variables?: QueryArgs) => Promise<ApolloQueryResult<T>>;

function useDomain(domain: string) {
  const id = getDomainId(domain);
  const {
    error: errorDomain,
    data: dataDomain,
    refetch: refetchDomain,
  } = useQuery<DomainData>(domainQuery, {
    variables: { id },
  });

  const {
    error: errorChildren,
    data: dataChildren,
    refetch: refetchChildren,
  } = useQuery<DomainsData>(childrenQuery, {
    variables: { parent: id },
  });

  const _domain: Maybe<Domain> = useMemo(() => {
    //console.log('domain!', dataDomain);
    if (errorDomain) {
      // TODO: maybe throw?
      console.error(errorDomain);
    }
    if (errorChildren) {
      console.error(errorChildren);
    }
    if (dataDomain && dataDomain.domain) {
      const children =
        dataChildren &&
        dataChildren.domains[0] &&
        dataChildren.domains[0].parent === id
          ? dataChildren.domains.map((d) => d.name)
          : //.filter((d) => d !== 'ROOT')
            [];
      return Maybe.of({
        ...dataDomain.domain,
        owner: getAddress(dataDomain.domain.owner),
        parent: dataDomain.domain.parent,
        metadata: dataDomain.domain.metadata,
        subdomains: dataDomain.domain.subdomains,
        name: dataDomain.domain.name,
        controller: getAddress(dataDomain.domain.controller),

        children,
      });
    }
    return Maybe.nothing();
  }, [dataDomain, errorDomain, errorChildren, dataChildren, id]);

  const refetch = useCallback(
    (domainId?: string) =>
      Promise.all([
        refetchDomain({ variables: { id: domainId } }),
        refetchChildren({ variables: { parent: domainId } }),
      ]),
    [refetchChildren, refetchDomain],
  );

  return { domain: _domain, refetchDomain: refetch };
}

function useOwnedDomains(): {
  owned: Maybe<Domain[]>;
  refetchOwned: RefetchQuery<DomainsData>;
} {
  const context = useWeb3React<Web3Provider>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { account } = context;
  const [getOwned, { data, refetch, error }] = useLazyQuery<DomainsData>(
    ownedDomainsQuery,
    {
      variables: { owner: account },
    },
  );

  const owned: Maybe<Domain[]> = useMemo(() => {
    if (error) {
      // TODO: maybe throw?
      console.error(error);
    }
    if (data) {
      return Maybe.of(
        data.domains.map((d) => ({
          ...d,
          owner: getAddress(d.owner),
          parent: d.parent,
          children: [],
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
  _allDomains: Maybe<Domain[]>;
  refetchAllDomains: RefetchQuery<DomainsData>;
} {
  const id = getDomainId(domain);
  // const context = useWeb3React<Web3Provider>();
  // const { account } = context;
  const [getAllDomains, { data, refetch, error }] = useLazyQuery<DomainsData>(
    allDomainsQuery,
    {
      variables: { id },
    },
  );

  const _allDomains: Maybe<Domain[]> = useMemo(() => {
    if (error) {
      // TODO: maybe throw?
      console.error(error);
    }
    if (data) {
      return Maybe.of(
        data.domains.map((d) => ({
          ...d,
          owner: getAddress(d.owner),
          parent: d.parent,
          children: [],
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
  const [transactions, setTransactions] = useState<ZeroTransaction[]>([]);

  const pushTransaction = useCallback(
    (tx: ZeroTransaction) => {
      setTransactions(
        transactions.filter((_tx) => _tx.nonce !== tx.nonce).concat(tx),
      );
    },
    [transactions, setTransactions],
  );

  const updateTransaction = useCallback(
    (tx: ZeroTransaction) => {
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
