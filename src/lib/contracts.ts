import { Web3Provider } from '@ethersproject/providers';
import { Registrar__factory } from '../types/factories/Registrar__factory';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import addresses from './addresses';
import { chainIdToNetworkType } from './network';
import { Registrar } from '../types/Registrar';
import { BasicController, BasicController__factory } from 'types';

export interface ContractAddresses {
	basic: string;
	registrar: string;
}

export interface Contracts {
	registry: Registrar;
	basicController: BasicController;
}

function useZnsContracts(): Contracts | null {
	const context = useWeb3React<Web3Provider>();
	const { library, active, chainId } = context;
	const contract = useMemo((): Contracts | null => {
		if (!active || !library) return null;
		if (!chainId) {
			console.error(`No chainid detected;`);
			return null;
		}

		const contracts = addresses[chainIdToNetworkType(chainId)];

		if (!contracts) {
			console.error(`chain not supported`);
			return null;
		}

		return {
			registry: Registrar__factory.connect(
				contracts.registrar,
				library.getSigner(),
			),
			basicController: BasicController__factory.connect(
				contracts.basic,
				library.getSigner(),
			),
		};
	}, [active, library, chainId]);
	return contract;
}

export { useZnsContracts };
