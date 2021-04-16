import { Web3Provider } from '@ethersproject/providers';
import { Registrar__factory } from '../types/factories/Registrar__factory';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import addresses from './addresses';
import { Maybe } from 'true-myth';
import { chainIdToNetworkType } from './network';
import { Registrar } from '../types/Registrar';

export interface ContractAddress {
  registrar: string;
}

export interface Contract {
  registry: Registrar;
}

function useZnsBasicContracts(): Maybe<Contract> {
  const context = useWeb3React<Web3Provider>();
  const { library, active, chainId } = context;
  const contracts = useMemo((): Maybe<Contract> => {
    if (!active || !library) return Maybe.nothing();
    return Maybe.of({
      registry: Registrar__factory.connect(
        addresses[chainIdToNetworkType(chainId!)].registrar,
        library.getSigner(),
      ),
    });
  }, [active, library, chainId]);
  return contracts;
}

export { useZnsBasicContracts };
