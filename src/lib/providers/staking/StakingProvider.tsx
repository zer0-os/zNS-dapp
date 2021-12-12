// React Imports
import React, { useEffect, useState } from 'react';

// Web3 Imports
import { Domain, Maybe } from 'lib/types';

import POOL_DATA from './PoolData';

export type Stat = {
	fieldName: string;
	isLoading: boolean;
	title: string;
	subTitle: string;
};

export const StakingContext = React.createContext({
	pools: [] as any[] | undefined,
	getPoolByDomain: (domain: string) => {},
	openStakingModal: (domain: string) => {},
	closeStakingModal: () => {},
	stakingOn: undefined as any | undefined,
});

type StakingProviderType = {
	children: React.ReactNode;
};

const StakingProvider: React.FC<StakingProviderType> = ({ children }) => {
	// change from 'any' type
	const [pools, setPoolData] = useState<any[] | undefined>();
	const [stakingOn, setStakingOn] = useState<any | undefined>();

	useEffect(() => {
		getPoolData();
	});

	const getPoolData = async () => {
		// Simulate async data
		await new Promise((r) => setTimeout(r, 3000));
		setPoolData(POOL_DATA);
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
		openStakingModal,
		stakingOn,
		closeStakingModal,
	} = React.useContext(StakingContext);
	return {
		pools,
		getPoolByDomain,
		openStakingModal,
		stakingOn,
		closeStakingModal,
	};
}
