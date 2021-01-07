import { ApolloQueryResult, gql, useLazyQuery, useQuery } from '@apollo/client';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { getAddress } from 'ethers/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Maybe } from 'true-myth';
import { getDomainId } from './domains';

interface Domain {
  id: string;
  domain: string;
  children: string[];
  owner: string;
  controller: string;
}

interface ControlledDomainsData {
  domains: Domain[];
}

interface DomainData {
  domain: Domain;
}

interface ApprovedToData {
  domains: Domain[];
}

interface ApprovedFromData {
  domains: Domain[];
}

const domainQuery = gql`
  query Domain($id: ID!) {
    domain(id: $id) {
      id
      domain
      children
      owner
      approval
      controller
    }
  }
`;

const controlledDomainsQuery = gql`
  query ControlledDomains($owner: Bytes!) {
    domains(where: { owner: $owner }) {
      id
      domain
      children
      owner
      controller
    }
  }
`;

const approvalQuery = gql`
  query Approval($from: Bytes!) {
    domains(where: { to: $from }) {
      id
      domain
      owner
      from
      to
    }
  }
`;

type RefetchQuery<T> = (
  variables?: Partial<Record<string, any>>,
) => Promise<ApolloQueryResult<T>>;

function useDomain(domain: string) {
  const id = domain === '_root' ? '0' : getDomainId(domain);
  const { error, data, refetch } = useQuery<DomainData>(domainQuery, {
    variables: { id },
  });

  const _domain: Maybe<Domain> = useMemo(() => {
    console.log('wtf?', data);
    if (error) {
      // TODO: maybe throw?
      console.error(error);
    }
    if (data) {
      return Maybe.of({
        ...data.domain,
        owner: getAddress(data.domain.owner),
        controller: getAddress(data.domain.controller),
      });
    }
    return Maybe.nothing();
  }, [data]);

  return { domain: _domain, refetchDomain: refetch };
}

function useControlledDomains(): {
  controlled: Maybe<Domain[]>;
  refetchControlled: RefetchQuery<ControlledDomainsData>;
} {
  const context = useWeb3React<Web3Provider>();
  const { library, account, active, chainId } = context;
  const [
    getControlled,
    { data, refetch, error },
  ] = useLazyQuery<ControlledDomainsData>(controlledDomainsQuery, {
    variables: { owner: account },
  });

  const controlled: Maybe<Domain[]> = useMemo(() => {
    if (error) {
      // TODO: maybe throw?
      console.error(error);
    }
    if (data) {
      return Maybe.of(data.domains);
    }
    return Maybe.nothing();
  }, [data]);

  useEffect(() => {
    if (refetch) {
      refetch({ variables: { owner: account } });
    } else if (account) {
      getControlled({ variables: { owner: account } });
    }
  }, [account]);
  return { controlled, refetchControlled: refetch! };
}

function useApprovedTo(): {
  approvedTo: Maybe<Domain[]>;
  refetchApprovedTo: RefetchQuery<ApprovedToData>;
} {
  const context = useWeb3React<Web3Provider>();
  const { library, account, active, chainId } = context;
  const [
    getApprovedTo,
    { data, refetch, error },
  ] = useLazyQuery<ApprovedToData>(approvalQuery, {
    variables: { owner: account },
  });

  const approvedTo: Maybe<Domain[]> = useMemo(() => {
    if (error) {
      // TODO: maybe throw?
      console.error(error);
    }
    if (data) {
      return Maybe.of(data.domains);
    }
    return Maybe.nothing();
  }, [data]);

  useEffect(() => {
    if (refetch) {
      refetch({ variables: { owner: account } });
    } else if (account) {
      getApprovedTo({ variables: { owner: account } });
    }
  }, [account]);
  return { approvedTo, refetchApprovedTo: refetch! };
}

function useApprovedFrom(): {
  approvedFrom: Maybe<Domain[]>;
  refetchApprovedFrom: RefetchQuery<ApprovedToData>;
} {
  const context = useWeb3React<Web3Provider>();
  const { library, account, active, chainId } = context;
  const [
    getApprovedFrom,
    { data, refetch, error },
  ] = useLazyQuery<ApprovedToData>(approvalQuery, {
    variables: { from: account },
  });

  const approvedFrom: Maybe<Domain[]> = useMemo(() => {
    if (error) {
      // TODO: maybe throw?
      console.error(error);
    }
    if (data) {
      return Maybe.of(data.domains);
    }
    return Maybe.nothing();
  }, [data]);

  useEffect(() => {
    if (refetch) {
      refetch({ variables: { from: account } });
    } else if (account) {
      getApprovedFrom({ variables: { from: account } });
    }
  }, [account]);
  return { approvedFrom, refetchApprovedFrom: refetch! };
}

const useDomainStore = () => {
  const controlled = useControlledDomains();
  const approvedTo = useApprovedTo();
  const approvedFrom = useApprovedFrom();

  return { useDomain, ...controlled, ...approvedTo, ...approvedFrom };
};

export type DomainStoreContext = ReturnType<typeof useDomainStore>;

export type DomainContext = ReturnType<typeof useDomain>;

export { useDomainStore };
