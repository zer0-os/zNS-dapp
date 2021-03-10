import { Web3Provider } from '@ethersproject/providers';
import { Registry__factory, Registry } from '../types';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import addresses from './addresses';
import { Maybe } from 'true-myth';
import { chainIdToNetworkType } from './network';

export interface ContractAddresses {
  registry: string;
}

export interface Contracts {
  registry: Registry;
}

function useZnsContracts(): Maybe<Contracts> {
  const context = useWeb3React<Web3Provider>();
  const { library, active, chainId } = context;
  const contracts = useMemo((): Maybe<Contracts> => {
    if (!active || !library) return Maybe.nothing();
    return Maybe.of({
      registry: Registry__factory.connect(
        addresses[chainIdToNetworkType(chainId!)].registry,
        library.getSigner(),
      ),
    });
  }, [active, library, chainId]);
  return contracts;
}

export { useZnsContracts };
