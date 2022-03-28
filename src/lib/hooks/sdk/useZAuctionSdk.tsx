import { useWeb3React } from '@web3-react/core';
import * as zAuction from '@zero-tech/zauction-sdk';
import * as zns from '@zero-tech/zns-sdk';
import { ethers } from 'ethers';
import { RPC_URLS } from 'lib/connectors';
import {
	chainIdToNetworkType,
	defaultNetworkId,
	NETWORK_TYPES,
} from 'lib/network';
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';
import React from 'react';

export function useZAuctionSdk() {
	const { library } = useWeb3React();
	const chainSelector = useChainSelector();

	const instance = React.useMemo(() => {
		const provider =
			library ||
			new ethers.providers.JsonRpcProvider(RPC_URLS[defaultNetworkId]);
		const network = chainIdToNetworkType(chainSelector.selectedChain);

		switch (network) {
			case NETWORK_TYPES.MAINNET: {
				return zAuction.createInstance(
					zns.configuration.mainnetConfiguration(provider).zAuctionRoutes[0]
						.config,
				);
			}

			case NETWORK_TYPES.RINKEBY: {
				return zAuction.createInstance(
					zns.configuration.rinkebyConfiguration(provider).zAuctionRoutes[0]
						.config,
				);
			}

			case NETWORK_TYPES.KOVAN: {
				return zAuction.createInstance(
					zns.configuration.kovanConfiguration(provider).zAuctionRoutes[0]
						.config,
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
