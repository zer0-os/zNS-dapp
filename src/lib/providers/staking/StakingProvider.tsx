// React Imports
import React, { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';

import { POOL_DATA, DEPOSIT_DATA } from './mock-data';

export type Stat = {
	fieldName: string;
	isLoading: boolean;
	title: string;
	subTitle: string;
};

export const StakingContext = React.createContext({
	pools: [] as any[] | undefined,
	deposits: [] as any[] | undefined,
	getPoolByDomain: (domain: string) => {},
	selectPoolByDomain: (domain: string) => {},
	deselectPool: () => {},
	selectedPool: undefined as any | undefined,
	selectedDeposit: undefined as any | undefined,
	selectDepositById: (id: string) => {},
	deselectDeposit: () => {},
});

type StakingProviderType = {
	children: React.ReactNode;
};

const StakingProvider: React.FC<StakingProviderType> = ({ children }) => {
	const web3Context = useWeb3React();
	const chainSelector = useChainSelector();

	const { account } = useWeb3React();

	// change from 'any' type
	const [pools, setPoolData] = useState<any[] | undefined>();
	const [deposits, setDepositData] = useState<any[] | undefined>();
	const [selectedPool, setSelectedPool] = useState<any | undefined>();
	const [selectedDeposit, setSelectedDeposit] = useState<any | undefined>();

	//////////////
	// Get data //
	//////////////

	useEffect(() => {
		getPoolData();
	});

	useEffect(() => {
		getDepositData();
	}, [account]);

	const getPoolData = async () => {
		// Simulate async data
		await new Promise((r) => setTimeout(r, 1500));
		setPoolData(POOL_DATA);
	};

	const getDepositData = async () => {
		// Simulate async data
		await new Promise((r) => setTimeout(r, 1500));
		setDepositData(DEPOSIT_DATA);
	};

	const getPoolByDomain = (domain: string) => {
		if (pools) {
			const pool = pools.filter((p) => p.domain === domain);
			return pool.length ? pool[0] : undefined;
		}
	};

	/////////////////
	// Select Data //
	/////////////////

	const selectDepositById = (id: string) => {
		if (deposits) {
			const deposit = deposits.filter((deposit: any) => deposit.id === id);
			if (deposit.length) {
				setSelectedDeposit(deposit[0]);
			}
		}
	};

	const deselectDeposit = () => {
		setSelectedDeposit(undefined);
	};

	const selectPoolByDomain = (domain: string) => {
		if (pools) {
			const pool = pools.filter((pool: any) => pool.domain === domain);
			if (pool.length) {
				setSelectedPool(pool[0]);
			}
		}
	};

	const deselectPool = () => {
		setSelectedPool(undefined);
	};

	const contextValue = {
		pools,
		deposits,
		getPoolByDomain,
		selectPoolByDomain,
		deselectPool,
		selectedPool,
		selectedDeposit,
		selectDepositById,
		deselectDeposit,
	};

	return (
		<StakingContext.Provider value={contextValue}>
			{children}
		</StakingContext.Provider>
	);
};

export default StakingProvider;

export function useStaking() {
	const {
		pools,
		getPoolByDomain,
		deposits,
		selectPoolByDomain,
		selectedPool,
		deselectPool,
		selectDepositById,
		selectedDeposit,
		deselectDeposit,
	} = React.useContext(StakingContext);
	return {
		pools,
		getPoolByDomain,
		deposits,
		selectPoolByDomain,
		selectedPool,
		deselectPool,
		selectedDeposit,
		selectDepositById,
		deselectDeposit,
	};
}
