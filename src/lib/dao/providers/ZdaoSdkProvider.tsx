import React, { useCallback, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import {
	chainIdToNetworkType,
	defaultNetworkId,
	NETWORK_TYPES,
} from 'lib/network';
import { RPC_URLS } from 'lib/connectors';
import { ethers } from 'ethers';
import {
	Config,
	createSDKInstance,
	developmentConfiguration,
	productionConfiguration,
	SDKInstance,
} from '@zero-tech/zdao-sdk';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useDidMount } from 'lib/hooks/useDidMount';
import addresses from 'lib/addresses';
import { Web3Provider } from '@ethersproject/providers';

export const zDaoContext = React.createContext({
	instance: undefined as SDKInstance | undefined,
});

type DaoSdkProviderProps = {
	children: React.ReactNode;
};

export const ZdaoSdkProvider: React.FC<DaoSdkProviderProps> = ({
	children,
}) => {
	const { library, chainId } = useWeb3React<Web3Provider>(); // get provider for connected wallet

	const [instance, setInstance] = useState<SDKInstance | undefined>();

	const { network, selectedChain } = useMemo(() => {
		const selectedChain = chainId || defaultNetworkId;
		const network = chainIdToNetworkType(selectedChain);
		return {
			network,
			selectedChain,
		};
	}, [chainId]);

	const createInstance = useCallback(async () => {
		setInstance(undefined);

		// Get provider, or initialise default provider if wallet is not connected
		const provider =
			library || new ethers.providers.JsonRpcProvider(RPC_URLS[selectedChain]);

		if (
			network !== NETWORK_TYPES.MAINNET &&
			network !== NETWORK_TYPES.RINKEBY
		) {
			throw new Error('Network not supported');
		}

		const createConfig =
			network === NETWORK_TYPES.MAINNET
				? productionConfiguration
				: developmentConfiguration;

		// Create SDK configuration object
		const config: Config = createConfig(
			addresses[network].zDao,
			provider,
			'ipfs.io',
		);

		const sdk = createSDKInstance(config);
		setInstance(sdk);
	}, [library, network, selectedChain]);

	useUpdateEffect(createInstance, [library, network, selectedChain]);
	useDidMount(() => {
		createInstance();
	});

	const contextValue = {
		instance,
	};

	return (
		<zDaoContext.Provider value={contextValue}>{children}</zDaoContext.Provider>
	);
};

export function useZdaoSdk() {
	const context = React.useContext(zDaoContext);

	return context;
}
