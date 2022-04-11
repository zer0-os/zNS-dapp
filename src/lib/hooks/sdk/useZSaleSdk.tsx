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
					contractAddress: '0x0', // TODO: Replace with proper contract address
					merkleTreeFileUri:
						'https://d3810nvssqir6b.cloudfront.net/airwilds1whitelist.json',
				});
			}

			case NETWORK_TYPES.RINKEBY: {
				return zsale.createInstance({
					web3Provider,
					contractAddress: '0xC82E9E9B1e28F10a4C13a915a0BDCD4Db00d086d',
					merkleTreeFileUri:
						'https://ipfs.io/ipfs/QmSarejrKPohT6peSHAWwLDkfBhy8qwEouFhBMzzw2vCit',
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
