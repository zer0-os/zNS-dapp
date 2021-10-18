import { useWeb3React } from '@web3-react/core';
import * as zns from '@zero-tech/zns-sdk';
import {
	DomainBidEvent,
	DomainMintEvent,
	DomainSaleEvent,
	DomainTradingData,
	DomainTransferEvent,
} from '@zero-tech/zns-sdk';
import React from 'react';
import { useChainSelector } from './ChainSelectorProvider';

export function useZnsSdk() {
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
				throw new Error('SDK isn´t available for this chainId');
			}
		}
	}, [web3Context.chainId]);

	const getMintEvents = async (domainId: string) => {
		try {
			const events = await instance?.getDomainEvents(domainId);
			const mintEvents = events?.filter((element) => {
				return element.type === 0;
			}) as DomainMintEvent[];
			return mintEvents;
		} catch (e) {
			console.error('Failed to retrieve mint event data');
			return;
		}
	};

	const getTransferEvents = async (domainId: string) => {
		try {
			const events = await instance?.getDomainEvents(domainId);
			const transferEvents = events?.filter((element) => {
				return element.type === 1;
			}) as DomainTransferEvent[];
			return transferEvents;
		} catch {
			console.error('Failed to retrieve transfer event data');
			return;
		}
	};

	const getBids = async (domainId: string) => {
		try {
			const events = await instance?.getDomainEvents(domainId);
			const bids = events?.filter((element) => {
				return element.type === 2;
			}) as DomainBidEvent[];
			return bids;
		} catch {
			console.error('Failed to retrive bid data');
			return;
		}
	};

	const getSaleEvents = async (domainId: string) => {
		try {
			const events = await instance?.getDomainEvents(domainId);
			const sales = events?.filter((element) => {
				return element.type === 3;
			}) as DomainSaleEvent[];
			return sales;
		} catch {
			console.error('Failed to retrieve sale event data');
			return;
		}
	};

	const getSubdomainTradingData = async (domainId: string) => {
		try {
			const data: DomainTradingData = await instance?.getSubdomainTradingData(
				domainId,
			);
			return data;
		} catch {
			console.error('Failed to retrieve sale event data');
			return;
		}
	};

	return {
		instance,
		getMintEvents,
		getTransferEvents,
		getBids,
		getSaleEvents,
		getSubdomainTradingData,
	};
}
