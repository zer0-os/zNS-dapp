import { useWeb3React } from '@web3-react/core';
import * as zns from '@zero-tech/zns-sdk';
import {
	DomainBidEvent,
	DomainMetricsCollection,
	DomainMintEvent,
	DomainSaleEvent,
	DomainTransferEvent,
} from '@zero-tech/zns-sdk/lib/types';
import { ContractTransaction, ethers } from 'ethers';
import React from 'react';
import { useChainSelector } from './ChainSelectorProvider';

export function useZnsSdk() {
	const web3Context = useWeb3React();
	const chainSelector = useChainSelector();

	const instance = React.useMemo(() => {
		switch (chainSelector.selectedChain) {
			case 1: {
				return zns.createInstance(
					zns.configuration.mainnetConfiguration(web3Context.library),
				);
			}

			case 42: {
				return zns.createInstance(
					zns.configuration.kovanConfiguration(web3Context.library),
				);
			}

			default: {
				throw new Error('SDK isn´t available for this chainId');
			}
		}
	}, [web3Context.library, chainSelector.selectedChain]);

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

	const getDomainMetrics = async (domainIds: string[]) => {
		try {
			const data: DomainMetricsCollection = await instance?.getDomainMetrics(
				domainIds,
			);
			return data;
		} catch {
			console.error('Failed to retrieve sale event data');
			return;
		}
	};

	const lockDomainMetadata = async (
		domainId: string,
		lockStatus: boolean,
		signer: ethers.Signer,
	) => {
		try {
			const data: ContractTransaction = await instance?.lockDomainMetadata(
				domainId,
				lockStatus,
				signer,
			);
			return data;
		} catch {
			console.error('Failed to retrieve sale event data');
			return;
		}
	};

	const setDomainMetadata = async (
		domainId: string,
		metadataUri: string,
		signer: ethers.Signer,
	) => {
		try {
			const data: ContractTransaction = await instance?.setDomainMetadata(
				domainId,
				metadataUri,
				signer,
			);
			return data;
		} catch {
			console.error('Failed to retrieve sale event data');
			return;
		}
	};

	const setAndLockMetadata = async (
		domainId: string,
		metadataUri: string,
		signer: ethers.Signer,
	) => {
		try {
			const data: ContractTransaction = await instance?.setDomainMetadata(
				domainId,
				metadataUri,
				signer,
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
		getDomainMetrics,
		lockDomainMetadata,
		setDomainMetadata,
		setAndLockMetadata,
	};
}
