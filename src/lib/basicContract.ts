import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import addresses from './addresses';
import { Maybe } from 'true-myth';
import { chainIdToNetworkType } from './network';
import { BasicController } from '../types/BasicController';
import { BasicController__factory } from '../types';

export interface ContractAddresses {
  basic: string;
}

export interface Contract {
  basic: BasicController;
}

function useZnsBasicContracts(): Maybe<Contract> {
  const context = useWeb3React<Web3Provider>();
  const { library, active, chainId } = context;
  const contracts = useMemo((): Maybe<Contract> => {
    if (!active || !library) return Maybe.nothing();
    return Maybe.of({
      basic: BasicController__factory.connect(
        addresses[chainIdToNetworkType(chainId!)].basic,
        library.getSigner(),
      ),
    });
  }, [active, library, chainId]);
  return contracts;
}

export { useZnsBasicContracts };
