import React, { useCallback, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import {
	chainIdToNetworkType,
	defaultNetworkId,
	NETWORK_TYPES,
} from 'lib/network';
import { RPC_URLS } from 'lib/connectors';
import { ethers } from 'ethers';
import { WALLETS } from 'constants/wallets';
import { LOCAL_STORAGE_KEYS } from 'constants/localStorage';
import {
	Config,
	createSDKInstance,
	developmentConfiguration,
	productionConfiguration,
	SDKInstance,
} from '@zero-tech/zdao-sdk';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useDidMount } from 'lib/hooks/useDidMount';
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
	const { library, chainId, active } = useWeb3React<Web3Provider>(); // get provider for connected wallet

	const [instance, setInstance] = useState<SDKInstance | undefined>();

	const selectedChain = chainId || defaultNetworkId;
	const network = chainIdToNetworkType(selectedChain);

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

		if (
			Object.values(WALLETS).includes(
				localStorage.getItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET) as WALLETS,
			) &&
			!active
		) {
			// it is still loading wallet connected account
			return;
		}

		const createConfig =
			network === NETWORK_TYPES.MAINNET
				? productionConfiguration
				: developmentConfiguration;

		// Create SDK configuration object
		const config: Config = createConfig(provider, 'snapshot.mypinata.cloud');

		const sdk = createSDKInstance(config);

		setInstance(sdk);
	}, [library, active, network, selectedChain]);

	useUpdateEffect(createInstance, [library, active, network, selectedChain]);
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
