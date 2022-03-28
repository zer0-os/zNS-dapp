import React from 'react';

// Web3 imports
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useChainSelector } from './ChainSelectorProvider';
import { RPC_URLS } from 'lib/connectors';
import {
	chainIdToNetworkType,
	defaultNetworkId,
	NETWORK_TYPES,
} from 'lib/network';

// SDK imports
import * as zns from '@zero-tech/zns-sdk';

/**
 * Creates a zNS-SDK instance based on the connected wallet
 * and the connected chain ID.
 * If no wallet is connected, it finds our Infura URL for a given
 * network
 * @returns a configured zNS-SDK instance
 */
export function useZnsSdk() {
	const { library } = useWeb3React(); // get provider for connected wallet
	const chainSelector = useChainSelector();

	const instance = React.useMemo(() => {
		/**
		 * Use connected wallet's provider if it exists, otherwise create
		 * a provider using the Infura URL for the selected chain
		 */
		const provider =
			library ||
			new ethers.providers.JsonRpcProvider(RPC_URLS[defaultNetworkId]);
		const network = chainIdToNetworkType(chainSelector.selectedChain);

		/**
		 * Configure the SDK using provider based on selected network
		 */
		switch (network) {
			case NETWORK_TYPES.MAINNET: {
				return zns.createInstance(
					zns.configuration.mainnetConfiguration(provider),
				);
			}

			case NETWORK_TYPES.RINKEBY: {
				return zns.createInstance(
					zns.configuration.rinkebyConfiguration(provider),
				);
			}

			case NETWORK_TYPES.KOVAN: {
				return zns.createInstance(
					zns.configuration.kovanConfiguration(provider),
				);
			}

			default: {
				throw new Error('SDK isn´t available for this chainId');
			}
		}
	}, [library, chainSelector.selectedChain]);

	return {
		instance,
	};
}
