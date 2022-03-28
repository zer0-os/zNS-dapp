import * as zsale from '@zero-tech/zsale-sdk';
import { chainIdToNetworkType, NETWORK_TYPES } from 'lib/network';
import React from 'react';
import { useChainSelector } from './ChainSelectorProvider';

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
					contractAddress: '0xAeEaC5F790dD98FD7166bBD50d9938Bf542AFeEf',
					merkleTreeFileUri:
						'https://ipfs.io/ipfs/QmeTHvtancDwS2UC4SshQsS89dveLi171pGLc6b1GLxLDM',
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
