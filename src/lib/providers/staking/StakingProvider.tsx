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
	openStakingModal: (domain: string) => {},
	closeStakingModal: () => {},
	stakingOn: undefined as any | undefined,
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
	const [stakingOn, setStakingOn] = useState<any | undefined>();

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

	const stake = async () => {};
	const claim = async () => {};

	const openStakingModal = (poolDomain: string) => {
		if (pools) {
			const pool = pools.filter((pool: any) => pool.domain === poolDomain);
			if (pool.length) {
				setStakingOn(pool[0]);
			}
		}
	};

	const closeStakingModal = () => {
		setStakingOn(undefined);
	};

	const getPoolByDomain = (domain: string) => {
		if (pools) {
			const pool = pools.filter((p) => p.domain === domain);
			return pool.length ? pool[0] : undefined;
		}
	};

	const contextValue = {
		pools,
		deposits,
		getPoolByDomain,
		openStakingModal,
		closeStakingModal,
		stakingOn,
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
		openStakingModal,
		stakingOn,
		closeStakingModal,
	} = React.useContext(StakingContext);
	return {
		pools,
		getPoolByDomain,
		deposits,
		openStakingModal,
		stakingOn,
		closeStakingModal,
	};
}
