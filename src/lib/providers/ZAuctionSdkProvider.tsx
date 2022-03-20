import { useWeb3React } from '@web3-react/core';
import * as zAuction from '@zero-tech/zauction-sdk';
import * as zns from '@zero-tech/zns-sdk';
import React from 'react';
import { useChainSelector } from './ChainSelectorProvider';

export function useZAuctionSdk() {
	const web3Context = useWeb3React();
	const chainSelector = useChainSelector();

	const instance = React.useMemo(() => {
		switch (chainSelector.selectedChain) {
			case 1: {
				return zAuction.createInstance(
					zns.configuration.mainnetConfiguration(web3Context.library)
						.zAuctionRoutes[0].config,
				);
			}

			case 4: {
				return zAuction.createInstance(
					zns.configuration.rinkebyConfiguration(web3Context.library)
						.zAuctionRoutes[0].config,
				);
			}

			case 42: {
				return zAuction.createInstance(
					zns.configuration.kovanConfiguration(web3Context.library)
						.zAuctionRoutes[0].config,
				);
			}

			default: {
				throw new Error('SDK isn´t available for this chainId');
			}
		}
	}, [web3Context.library, chainSelector.selectedChain]);

	return {
		instance,
	};
}
