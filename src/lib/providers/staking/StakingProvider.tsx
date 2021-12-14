// React Imports
import React, { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';

import { createInstance } from './temp-sdk';
import addresses from 'lib/addresses';

import { POOL_DATA, DEPOSIT_DATA } from './mock-data';
import { ethers, BigNumber } from 'ethers';
import { useZnsSdk } from '../ZnsSdkProvider';
import { useApprovals } from 'lib/hooks/useApprovals';

export type Stat = {
	fieldName: string;
	isLoading: boolean;
	title: string;
	subTitle: string;
};

export const StakingContext = React.createContext({
	deposits: [] as any[] | undefined,
	deselectDeposit: () => {},
	deselectPool: () => {},
	getPoolByDomain: (domain: string) => {},
	pools: [] as any[] | undefined,
	selectDepositById: (id: string) => {},
	selectedDeposit: undefined as any | undefined,
	selectedPool: undefined as any | undefined,
	selectPoolByDomain: (domain: string) => {},
	stake: (signer: ethers.Signer) => {},
});

type StakingProviderType = {
	children: React.ReactNode;
};

const StakingProvider: React.FC<StakingProviderType> = ({ children }) => {
	const { account, library, chainId } = useWeb3React();
	const { approveAllTokens, isApprovedForAllTokens } = useApprovals();

	const instance = React.useMemo(() => {
		if (library === undefined) {
			return;
		}

		switch (chainId) {
			case 1: {
				return createInstance({
					wildPoolAddress: addresses.MAINNET.wildStakingPool,
					lpTokenPoolAddress: addresses.MAINNET.lpStakingPool,
					factoryAddress: addresses.MAINNET.stakeFactory,
					provider: library,
				});
			}

			case 42: {
				return createInstance({
					wildPoolAddress: addresses.KOVAN.wildStakingPool,
					lpTokenPoolAddress: addresses.KOVAN.lpStakingPool,
					factoryAddress: addresses.KOVAN.stakeFactory,
					provider: library,
				});
			}

			default: {
				throw new Error('SDK isn´t available for this chainId');
			}
		}
	}, [library, chainId]);

	useEffect(() => {
		if (instance) {
			// instance.wildPool.getRewardTokensPerBlock().then((d) => console.log(d));
		}
	}, [instance]);

	// change from 'any' type
	const [deposits, setDepositData] = useState<any[] | undefined>();
	const [pools, setPoolData] = useState<any[] | undefined>();
	const [selectedDeposit, setSelectedDeposit] = useState<any | undefined>();
	const [selectedPool, setSelectedPool] = useState<any | undefined>();

	//////////////
	// Get data //
	//////////////

	useEffect(() => {
		getPoolData();
	});

	const approve = async () => {
		const app = await approveAllTokens({
			operator: addresses.KOVAN.wildStakingPool,
			approved: true,
		});
	};

	const checkApproval = async () => {
		const approval = await isApprovedForAllTokens({
			operator: addresses.KOVAN.lpStakingPool,
			owner: account as string,
		});
	};

	useEffect(() => {
		if (account && instance) {
			getDepositData(account);
			stake(library.getSigner());
		}
	}, [instance, account]);

	/////////////
	// Actions //
	/////////////

	const stake = (signer: ethers.Signer) => {
		instance?.wildPool.stake('1000', BigNumber.from(0), signer);
	};

	/////////////
	// Getters //
	/////////////

	// Deposits

	const getDepositData = async (user: string) => {
		await new Promise((r) => setTimeout(r, 5000));
		setDepositData([]);
	};

	// Pools

	const getPoolData = async () => {
		// Simulate async data
		await new Promise((r) => setTimeout(r, 1500));
		setPoolData(POOL_DATA);
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

	// Deposits

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

	// Pools

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

	/////////////////////
	// Provider Values //
	/////////////////////

	const contextValue = {
		deposits,
		deselectDeposit,
		deselectPool,
		getPoolByDomain,
		pools,
		selectDepositById,
		selectedDeposit,
		selectedPool,
		selectPoolByDomain,
		stake,
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
		deposits,
		deselectDeposit,
		deselectPool,
		getPoolByDomain,
		pools,
		selectDepositById,
		selectedDeposit,
		selectedPool,
		selectPoolByDomain,
		stake,
	} = React.useContext(StakingContext);
	return {
		deposits,
		deselectDeposit,
		deselectPool,
		getPoolByDomain,
		pools,
		selectDepositById,
		selectedDeposit,
		selectedPool,
		selectPoolByDomain,
		stake,
	};
}
