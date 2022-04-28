import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import * as zsale from '@zero-tech/zsale-sdk';
import { ethers } from 'ethers';
import { RPC_URLS } from 'lib/connectors';
import {
	chainIdToNetworkType,
	defaultNetworkId,
	NETWORK_TYPES,
} from 'lib/network';
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';
import React from 'react';

export function useZSaleSdk() {
	// TODO: Add suport to handle multiple contracts

	const { library } = useWeb3React<Web3Provider>();
	const chainSelector = useChainSelector();
	const instance = React.useMemo(() => {
		const web3Provider =
			library ||
			(new ethers.providers.JsonRpcProvider(
				RPC_URLS[defaultNetworkId],
			) as Web3Provider);
		const network = chainIdToNetworkType(chainSelector.selectedChain);

		switch (network) {
			case NETWORK_TYPES.MAINNET: {
				// TODO: Modify with actual contractAddress & merkleTreeFileUris
				return zsale.createInstance({
					web3Provider,
					contractAddress: '0x63E34f60EA13b34681B76Dcb1614dD985dD8E11e',
					merkleTreeFileUris: [
						'https://d3810nvssqir6b.cloudfront.net/final-wolf-beast-mintlist-merkleTree.json',
						'https://d3810nvssqir6b.cloudfront.net/final-wolf-beast-mintlist-merkleTree.json',
					],
					publicSalePurchaseLimit: 10,
					advanced: {
						merkleTreeFileIPFSHashes: [
							'QmRUkCPbiFtw8zPAQ6nY9iUgwJeGVsAGYcv8iYc66tYs4H',
							'QmRUkCPbiFtw8zPAQ6nY9iUgwJeGVsAGYcv8iYc66tYs4H',
						],
					},
				});
			}

			case NETWORK_TYPES.RINKEBY: {
				return zsale.createInstance({
					web3Provider,
					contractAddress: '0x9e903BB3c48BC2b679B20959F365c0be7Ab88961',
					merkleTreeFileUris: [
						'https://ipfs.io/ipfs/QmXQLJN49XRAgdgeJ8Hz6zf7izQGokPnQ5MZ6p79m2avpk',
						'https://ipfs.io/ipfs/QmXn7C5GrzHU8tgdGRT1g25WQe1rrvrfy1rEWjw6Cjm5sL',
					],
					publicSalePurchaseLimit: 10,
					advanced: {
						merkleTreeFileIPFSHashes: [
							'QmXQLJN49XRAgdgeJ8Hz6zf7izQGokPnQ5MZ6p79m2avpk',
							'QmXn7C5GrzHU8tgdGRT1g25WQe1rrvrfy1rEWjw6Cjm5sL',
						],
					},
				});
			}

			default: {
				throw new Error('SDK isn´t available for this chainId');
			}
		}
	}, [chainSelector.selectedChain, library]);

	return {
		instance,
	};
}
