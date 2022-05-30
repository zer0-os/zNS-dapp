import { useWeb3React } from '@web3-react/core';
import * as zns from '@zero-tech/zns-sdk';
import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import {
	chainIdToNetworkType,
	defaultNetworkId,
	NETWORK_TYPES,
} from 'lib/network';
import { RPC_URLS } from 'lib/connectors';
import { Web3Provider } from '@ethersproject/providers';

type ZnsSdkProviderProps = {
	children: React.ReactNode;
};

export const SdkContext = React.createContext({
	instance: {} as zns.Instance,
});

export const ZnsSdkProvider = ({ children }: ZnsSdkProviderProps) => {
	const { library, chainId } = useWeb3React<Web3Provider>();

	const instance = React.useMemo(() => {
		/**
		 * Use connected wallet's provider if it exists, otherwise create
		 * a provider using the Infura URL for the selected chain
		 */
		const provider =
			library ||
			new ethers.providers.JsonRpcProvider(RPC_URLS[defaultNetworkId]);
		const network = chainIdToNetworkType(chainId);

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
	}, [library, chainId]);

	useEffect(() => {
		const keys = Object.keys(instance).filter((k) => k.includes('get'));
		const s: any = {};
		keys.forEach((key) => {
			s[key] = (instance as any)[key];
		});
		(global as any).sdk = s;
	}, [instance]);

	const contextValue = {
		instance,
	};

	return (
		<SdkContext.Provider value={contextValue}>{children}</SdkContext.Provider>
	);
};
