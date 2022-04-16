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
				return zsale.createInstance({
					web3Provider,
					contractAddress: '0x63E34f60EA13b34681B76Dcb1614dD985dD8E11e',
					merkleTreeFileUri:
						'https://d3810nvssqir6b.cloudfront.net/final-wolf-beast-mintlist-merkleTree.json',
					publicSalePurchaseLimit: 10,
					advanced: {
						merkleTreeFileIPFSHash:
							'QmRUkCPbiFtw8zPAQ6nY9iUgwJeGVsAGYcv8iYc66tYs4H',
					},
				});
			}

			case NETWORK_TYPES.RINKEBY: {
				return zsale.createInstance({
					web3Provider,
					contractAddress: '0xC82E9E9B1e28F10a4C13a915a0BDCD4Db00d086d',
					merkleTreeFileUri:
						'https://d3810nvssqir6b.cloudfront.net/kovan-test-merkleTree.json',
					publicSalePurchaseLimit: 10,
					advanced: {
						merkleTreeFileIPFSHash:
							'Qmf8XuYT181zdvhNXSeYUhkptgezzK8QJnrAD16GGj8TrV',
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
