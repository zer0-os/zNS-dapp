import React, { useCallback, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';
import {
	chainIdToNetworkType,
	defaultNetworkId,
	NETWORK_TYPES,
} from 'lib/network';
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
import addresses from 'lib/addresses';

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

	const network = useMemo(
		() => chainIdToNetworkType(chainSelector.selectedChain),
		[chainSelector.selectedChain],
	);

	const createInstance = useCallback(async () => {
		setInstance(undefined);

		// Get provider, or initialise default provider if wallet is not connected
		const provider =
			library ||
			new ethers.providers.JsonRpcProvider(RPC_URLS[defaultNetworkId]);

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
		const config: Config = createConfig(addresses[network].zDao, provider);

		const sdk = createSDKInstance(config);

		/**
		 * 30/03/2022
		 * Remap functions for mainnet as the contract isn't live yet
		 */
		sdk.listZNAs = sdk.listZNAsFromParams;
		sdk.doesZDAOExist = sdk.doesZDAOExistFromParams;
		sdk.getZDAOByZNA = sdk.getZDAOByZNAFromParams;
		await Promise.all(DAOS[network].map((d) => sdk.createZDAOFromParams(d)));

		setInstance(sdk);
	}, [library, network]);

	useUpdateEffect(createInstance, [library, network]);

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
