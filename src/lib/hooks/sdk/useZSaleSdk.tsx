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
import React from 'react';

export function useZSaleSdk() {
	// TODO: Add suport to handle multiple contracts
	const { library, chainId } = useWeb3React<Web3Provider>();
	const instanceObject = React.useMemo(() => {
		const web3Provider =
			library ||
			(new ethers.providers.JsonRpcProvider(
				RPC_URLS[defaultNetworkId],
			) as Web3Provider);
		const network = chainIdToNetworkType(chainId);

		switch (network) {
			case NETWORK_TYPES.MAINNET: {
				// TODO: Modify with actual contractAddress for wapes
				return {
					//TODO: Update with mainnet address and proper merkleTree
					wapesInstance: zsale.createWapeSaleInstance({
						web3Provider,
						contractAddress: '0x66cA971F1fE3d3d526cAbb0314633F6a7Ef3F887',
						merkleTreeFileUri:
							'https://res.cloudinary.com/fact0ry/raw/upload/v1670283876/drops/wapes/merkle/wape-sale-mintlist-merkleTree.json',
						advanced: {
							merkleTreeFileIPFSHash:
								'QmdrXFrUwdXAycSwbJNBkRAG7ee8cqNpCqJDShSVWZwgCf',
						},
					}),
					claimInstance: zsale.createClaimWithChildInstance({
						web3Provider,
						contractAddress: '0xF1c77209aEb972383b03Da16DAb7957AcE183CF5',
						claimingRegistrarAddress:
							'0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D',
					}),
				};
			}

			case NETWORK_TYPES.RINKEBY: {
				return {
					wapesInstance: zsale.createWapeSaleInstance({
						web3Provider,
						contractAddress: '0x14441C716b0C195Aaf2d2fF7401c17B81e101227',
						merkleTreeFileUri:
							'https://d3810nvssqir6b.cloudfront.net/kovan-test-merkleTree.json',
						advanced: {
							merkleTreeFileIPFSHash:
								'Qmf8XuYT181zdvhNXSeYUhkptgezzK8QJnrAD16GGj8TrV',
						},
					}),
					claimInstance: zsale.createClaimWithChildInstance({
						web3Provider,
						contractAddress: '0x0cda74723a9945977df45268394dff7989e0265b',
						claimingRegistrarAddress:
							'0x06b3fb925b342411fc7420fdc7bd5433f7a7261b',
					}),
				};
			}

			// TODO: Update this with proper address
			case NETWORK_TYPES.GOERLI: {
				return {
					wapesInstance: zsale.createWapeSaleInstance({
						web3Provider,
						publicSalePurchaseLimit: 9,
						contractAddress: '0xB97Aa9C072dc3b67976dA1CC04E84D26525973BE',
						merkleTreeFileUri:
							'https://res.cloudinary.com/fact0ry/raw/upload/v1671045872/drops/wapes/merkle/modified-dry-run-mintlist-merkleTree.json',
						advanced: {
							merkleTreeFileIPFSHash:
								'Qmc9LFv4SvStGMg7KLDmyoqTzk1t6nMnpAcF5JpsUXkVPy',
						},
					}),

					claimInstance: zsale.createClaimWithChildInstance({
						web3Provider,
						contractAddress: '0x0cda74723a9945977df45268394dff7989e0265b',
						claimingRegistrarAddress:
							'0x06b3fb925b342411fc7420fdc7bd5433f7a7261b',
					}),
				};
			}

			default: {
				throw new Error('SDK isn´t available for this chainId');
			}
		}
	}, [chainId, library]);

	(global as any).zsale = { ...instanceObject };

	return {
		...instanceObject,
	};
}
