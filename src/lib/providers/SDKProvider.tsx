import { useWeb3React } from '@web3-react/core';
import * as zns from '@zero-tech/zns-sdk';
import {
	DomainBidEvent,
	DomainMintEvent,
	DomainSaleEvent,
	DomainTransferEvent,
} from '@zero-tech/zns-sdk';
import React from 'react';
import { useChainSelector } from './ChainSelectorProvider';

export function useSDKProvider() {
	const web3Context = useWeb3React();
	const chainSelector = useChainSelector();

	const instance = React.useMemo(() => {
		switch (chainSelector.selectedChain) {
			case 1: {
				return zns.createInstance(
					zns.configurations.mainnetConfiguration(web3Context.library),
				);
			}

			case 42: {
				return zns.createInstance(
					zns.configurations.kovanConfiguration(web3Context.library),
				);
			}

			default: {
				console.error('no sdk configuration for selected chain');
				break;
			}
		}
	}, [web3Context.chainId]);

	const getMints = async (domainId: string) => {
		const events = await instance?.getDomainEvents(domainId);
		const mints = events?.filter((element) => {
			return element.type === 0;
		}) as DomainMintEvent[];
		return mints;
	};

	const getTransfers = async (domainId: string) => {
		const events = await instance?.getDomainEvents(domainId);
		const transfers = events?.filter((element) => {
			return element.type === 1;
		}) as DomainTransferEvent[];
		return transfers;
	};

	const getBids = async (domainId: string) => {
		const events = await instance?.getDomainEvents(domainId);
		const bids = events?.filter((element) => {
			return element.type === 2;
		}) as DomainBidEvent[];
		return bids;
	};

	const getSales = async (domainId: string) => {
		const events = await instance?.getDomainEvents(domainId);
		const sales = events?.filter((element) => {
			return element.type === 3;
		}) as DomainSaleEvent[];
		return sales;
	};

	return { instance, getMints, getTransfers, getBids, getSales };
}
