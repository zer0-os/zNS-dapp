import * as zsale from '@zero-tech/zsale-sdk';
import { chainIdToNetworkType, NETWORK_TYPES } from 'lib/network';
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';
import React from 'react';

export function useZSaleSdk() {
	const chainSelector = useChainSelector();
	// TODO: Add suport to handle multiple contracts
	const instance = React.useMemo(() => {
		const network = chainIdToNetworkType(chainSelector.selectedChain);

		switch (network) {
			case NETWORK_TYPES.MAINNET: {
				return zsale.createInstance({
					isEth: true,
					contractAddress: '0x0', // TODO: Replace with proper contract address
					merkleTreeFileUri:
						'https://d3810nvssqir6b.cloudfront.net/airwilds1whitelist.json',
				});
			}

			case NETWORK_TYPES.RINKEBY: {
				return zsale.createInstance({
					isEth: true,
					contractAddress: '0xC1f42bff2b07ae3c4c14D19e28d86D947c94B69F',
					merkleTreeFileUri:
						'ipfs://QmSarejrKPohT6peSHAWwLDkfBhy8qwEouFhBMzzw2vCit',
				});
			}

			default: {
				throw new Error('SDK isn´t available for this chainId');
			}
		}
	}, [chainSelector.selectedChain]);

	return {
		instance,
	};
}
