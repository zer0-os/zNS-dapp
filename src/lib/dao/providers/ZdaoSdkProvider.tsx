import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';
import { chainIdToNetworkType, defaultNetworkId } from 'lib/network';
import { RPC_URLS } from 'lib/connectors';
import { ethers } from 'ethers';
import { DAOS } from 'constants/daos';
import {
	Config,
	createSDKInstance,
	developmentConfiguration,
	productionConfiguration,
	SDKInstance,
} from '@zero-tech/zdao-sdk';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useDidMount } from 'lib/hooks/useDidMount';

export const zDaoContext = React.createContext({
	instance: undefined as SDKInstance | undefined,
});

type DaoSdkProviderProps = {
	children: React.ReactNode;
};

export const ZdaoSdkProvider = ({ children }: DaoSdkProviderProps) => {
	const { library } = useWeb3React(); // get provider for connected wallet
	const chainSelector = useChainSelector();

	const [instance, setInstance] = useState<SDKInstance | undefined>();

	const createInstance = async () => {
		setInstance(undefined);

		// Get provider
		const provider =
			library ||
			new ethers.providers.JsonRpcProvider(RPC_URLS[defaultNetworkId]);
		const network = chainIdToNetworkType(chainSelector.selectedChain);

		const daos = DAOS[network];

		if (!daos) {
			throw new Error('Network not supported');
		}

		const createConfig =
			process.env.NODE_ENV === 'production'
				? productionConfiguration
				: developmentConfiguration;

		// Create SDK configuration object
		const config: Config = createConfig(
			'', // contract isn't live yet
			provider,
		);

		const sdk = createSDKInstance(config);

		await Promise.all(daos.map((d) => sdk.createZDAOFromParams(d)));

		setInstance(sdk);
	};

	useUpdateEffect(() => {
		createInstance();
	}, [library, chainSelector.selectedChain]);
	useDidMount(createInstance);

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
