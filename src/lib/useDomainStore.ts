import { ApolloQueryResult, gql, useLazyQuery, useQuery } from '@apollo/client';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { getAddress } from 'ethers/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Maybe } from 'true-myth';
import { getDomainId } from './domains';

export interface Domain {
  id: string;
  domain: string;
  children: string[];
  owner: string;
  controller: string;
  parent: string;
  image: string;
  resolver: string;
  approval: Maybe<string>;
}

interface _DomainData {
  id: string;
  domain: string;
  owner: string;
  parent: string;
  controller: string;
  image: string;
  resolver: string;
  approval?: string;
}

interface DomainsData {
  domains: _DomainData[];
}

interface DomainData {
  domain: _DomainData;
}

const zeroAddress =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

const domainQuery = gql`
  query Domain($id: ID!) {
    domain(id: $id) {
      id
      domain
      approval
      parent
      owner
      controller
      image
      resolver
    }
  }
`;

const childrenQuery = gql`
  query ChildrenDomains($parent: Bytes!) {
    domains(where: { parent: $parent }) {
      id
      domain
      approval
      parent
      owner
      controller
      image
      resolver
    }
  }
`;

const ownedDomainsQuery = gql`
  query OwnedDomains($owner: Bytes!) {
    domains(where: { owner: $owner }) {
      id
      domain
      approval
      parent
      owner
      controller
      image
      resolver
    }
  }
`;

const approvalQuery = gql`
  query ApprovedDomains($approval: Bytes!) {
    domains(where: { approval: $approval }) {
      id
      domain
      approval
      parent
      owner
      controller
      image
      resolver
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
          ? dataChildren.domains.map((d) => d.domain)
          : //.filter((d) => d !== 'ROOT')
            [];
      return Maybe.of({
        ...dataDomain.domain,
        approval: dataDomain.domain.approval
          ? Maybe.of(dataDomain.domain.approval)
          : Maybe.nothing(),
        owner: getAddress(dataDomain.domain.owner),
        parent: dataDomain.domain.parent,
        resolver: dataDomain.domain.resolver,
        image: dataDomain.domain.image,
        children,
        controller: getAddress(dataDomain.domain.controller),
      });
    }
    return Maybe.nothing();
  }, [dataDomain, errorDomain, dataChildren, dataDomain, errorChildren]);

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
  const { library, account, active, chainId } = context;
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
          approval: d.approval ? Maybe.of(d.approval) : Maybe.nothing(),
          owner: getAddress(d.owner),
          parent: d.parent,
          children: [],
          controller: getAddress(d.controller),
        })),
      );
    }
    return Maybe.nothing();
  }, [data]);

  useEffect(() => {
    if (refetch) {
      refetch({ variables: { owner: account } });
    } else if (account) {
      getOwned({ variables: { owner: account } });
    }
  }, [account]);

  return { owned, refetchOwned: refetch! };
}

function useIncomingApprovals(): {
  incomingApprovals: Maybe<Domain[]>;
  refetchIncomingApprovals: RefetchQuery<DomainsData>;
} {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const [
    getIncomingApprovals,
    { data, refetch, error },
  ] = useLazyQuery<DomainsData>(approvalQuery, {
    variables: { approval: account },
  });

  const incomingApprovals: Maybe<Domain[]> = useMemo(() => {
    if (error) {
      // TODO: maybe throw?
      console.error(error);
    }
    if (data) {
      return Maybe.of(
        data.domains.map((d) => ({
          ...d,
          approval: d.approval ? Maybe.of(d.approval) : Maybe.nothing(),
          owner: getAddress(d.owner),
          parent: d.parent,
          children: [],
          controller: getAddress(d.controller),
        })),
      );
    }
    return Maybe.nothing();
  }, [data]);

  useEffect(() => {
    if (refetch) {
      refetch({ variables: { to: account } });
    } else if (account) {
      getIncomingApprovals({ variables: { to: account } });
    }
  }, [account]);

  return { incomingApprovals, refetchIncomingApprovals: refetch! };
}

const useDomainStore = () => {
  const owned = useOwnedDomains();
  const incomingApprovals = useIncomingApprovals();

  return { useDomain, ...owned, ...incomingApprovals };
};

export type DomainStoreContext = ReturnType<typeof useDomainStore>;

export type DomainContext = ReturnType<typeof useDomain>;

export type IncomingApprovalsContext = ReturnType<typeof useIncomingApprovals>;

export { useDomainStore };
