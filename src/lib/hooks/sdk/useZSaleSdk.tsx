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
				return {
					wapesInstance: zsale.createWapeSaleInstance({
						web3Provider,
						publicSalePurchaseLimit: 9,
						contractAddress: '0x82132726A4E757294731FBb1739b0E5957D158bE',
						merkleTreeFileUri:
							'https://res.cloudinary.com/fact0ry/raw/upload/v1670283876/drops/wapes/merkle/wape-sale-mintlist-merkleTree.json',
						advanced: {
							merkleTreeFileIPFSHash:
								'QmdrXFrUwdXAycSwbJNBkRAG7ee8cqNpCqJDShSVWZwgCf',
						},
					}),
					gensInstance: zsale.createGenSaleInstance({
						web3Provider,
						contractAddress: '0x96d19de086c207ec543f9975b37bc2008284222e',
						merkleTreeFileUri:
							'https://res.cloudinary.com/fact0ry/raw/upload/v1678453970/drops/gens/gens-goerli-dry-run-mintlist-merkleTree.json',
						advanced: {
							merkleTreeFileIPFSHash:
								'Qmc9LFv4SvStGMg7KLDmyoqTzk1t6nMnpAcF5JpsUXkVPy',
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
					gensInstance: zsale.createGenSaleInstance({
						web3Provider,
						contractAddress: '0x96d19de086c207ec543f9975b37bc2008284222e',
						merkleTreeFileUri:
							'https://res.cloudinary.com/fact0ry/raw/upload/v1678453970/drops/gens/gens-goerli-dry-run-mintlist-merkleTree.json',
						advanced: {
							merkleTreeFileIPFSHash:
								'QmU2Ut94aBKws5Y9MDmvaMEsJAJDznU2DS2Knz9h4nUqiQ',
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
