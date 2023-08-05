import React, { useCallback, useState } from 'react';
import { useWeb3 } from 'lib/web3-connection/useWeb3';
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

export const zDaoContext = React.createContext({
	instance: undefined as SDKInstance | undefined,
});

type DaoSdkProviderProps = {
	children: React.ReactNode;
};

export const ZdaoSdkProvider: React.FC<DaoSdkProviderProps> = ({
	children,
}) => {
	const { provider, chainId, isActive } = useWeb3(); // get provider for connected wallet

	const [instance, setInstance] = useState<SDKInstance | undefined>();

	const selectedChain = chainId || defaultNetworkId;
	const network = chainIdToNetworkType(selectedChain);

	const createInstance = useCallback(async () => {
		setInstance(undefined);

		// Get provider, or initialise default provider if wallet is not connected
		const sdkProvider =
			provider || new ethers.providers.JsonRpcProvider(RPC_URLS[selectedChain]);

		if (network !== NETWORK_TYPES.MAINNET && network !== NETWORK_TYPES.GOERLI) {
			throw new Error('Network not supported');
		}

		if (
			Object.values(WALLETS).includes(
				localStorage.getItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET) as WALLETS,
			) &&
			!isActive
		) {
			// it is still loading wallet connected account
			return;
		}

		const createConfig =
			network === NETWORK_TYPES.MAINNET
				? productionConfiguration
				: developmentConfiguration;

		// Create SDK configuration object
		const config: Config = createConfig(sdkProvider, 'snapshot.mypinata.cloud');

		const sdk = createSDKInstance(config);

		setInstance(sdk);
	}, [provider, isActive, network, selectedChain]);

	useUpdateEffect(createInstance, [provider, isActive, network, selectedChain]);
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
