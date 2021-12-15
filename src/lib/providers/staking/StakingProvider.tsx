// React Imports
import React, { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import { createInstance } from './temp-sdk';
import addresses from 'lib/addresses';

import { wildPool, liquidityPool, Pool } from './pools';
import { Deposit } from './temp-sdk/types';
import { ethers, BigNumber } from 'ethers';
import { useZnsContracts } from 'lib/contracts';
import { chainIdToNetworkType } from 'lib/network';
import { ERC20 } from 'types';
import {
	getApproval,
	getBalance,
	getTotalUserValue,
} from './StakingProvider.helpers';

export type Stat = {
	fieldName: string;
	isLoading: boolean;
	title: string;
	subTitle: string;
};

export interface DepositView extends Deposit {
	pool: any;
}

export const StakingContext = React.createContext({
	deposits: [] as any[] | undefined,
	deselectDeposit: () => {},
	deselectPool: () => {},
	getPoolByDomain: (domain: string) => {},
	pools: [] as any[] | undefined,
	selectDeposit: (id: number, poolName: string) => {},
	selectedDeposit: undefined as any | undefined,
	selectedPool: undefined as any | undefined,
	selectPoolByName: (domain: string) => {},
	wildBalance: undefined as ethers.BigNumber | undefined,
	stake: (amount: number): Promise<ethers.ContractTransaction | undefined> => {
		// @todo how should this typing work?
		return new Promise(() => {
			return undefined;
		});
	},
	claimRewards: (
		poolName: string,
	): Promise<ethers.ContractTransaction | undefined> =>
		// @todo how should this typing work?
		new Promise(() => {
			return undefined;
		}),
	getBalanceByPoolName: (
		poolName: string,
	): Promise<ethers.BigNumber | undefined> =>
		// @todo how should this typing work?
		new Promise(() => {
			return undefined;
		}),
	checkRewards: (poolName: string): Promise<ethers.BigNumber | undefined> =>
		// @todo how should this typing work?
		new Promise(() => {
			return undefined;
		}),
	getWildBalance: (): Promise<ethers.BigNumber | undefined> =>
		// @todo how should this typing work?
		new Promise(() => {
			return undefined;
		}),
	checkApproval: (poolName: string, amount: number): Promise<boolean> =>
		// @todo how should this typing work?
		new Promise(() => {
			return;
		}),
	approve: (
		poolName: string,
	): Promise<ethers.ContractTransaction | undefined> =>
		// @todo how should this typing work?
		new Promise(() => {
			return;
		}),
	totalUserValueLocked: undefined as ethers.BigNumber | undefined,
	totalUserValueUnlocked: undefined as ethers.BigNumber | undefined,
});

type StakingProviderType = {
	children: React.ReactNode;
};

const StakingProvider: React.FC<StakingProviderType> = ({ children }) => {
	const { account, library, chainId } = useWeb3React();
	const contracts = useZnsContracts();

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

	//////////
	// Init //
	//////////

	useEffect(() => {
		if (instance) {
			// Set up on instance ready
			// Account is not necessarily plugged in yet
			getAllPools();
		}
	}, [instance]);

	useEffect(() => {
		if (account && instance) {
			getAllDepositsForUser();

			// Get balances of both tokens
			getUserData();
			// getAllApprovals();
		}
	}, [instance, account]);

	//////////
	// Data //
	//////////

	// change from 'any' type
	const [deposits, setDepositData] = useState<DepositView[] | undefined>();
	const [pools, setPoolData] = useState<any[]>();
	const [selectedDeposit, setSelectedDeposit] = useState<
		DepositView | undefined
	>();
	const [selectedPool, setSelectedPool] = useState<any | undefined>();

	// User
	const [totalUserValueLocked, setTotalUserValueLocked] = useState<
		ethers.BigNumber | undefined
	>();
	const [totalUserValueUnlocked, setTotalUserValueUnlocked] = useState<
		ethers.BigNumber | undefined
	>();
	const [wildBalance, setWildBalance] = useState<
		ethers.BigNumber | undefined
	>();

	//////////////
	// Get data //
	//////////////

	const getAllApprovals = () => {};

	const getPoolByName = (poolName: string): Pool => {
		const filter = pools?.filter((p: Pool) => p.name === poolName);
		return filter?.[0];
	};

	useEffect(() => {
		if (pools && instance && account) {
			// getBalance('Stake WILD');
			getWildBalance();
		}
	}, [pools, instance, account]);

	useEffect(() => {
		// Get user specific data
		if (!instance || !account || !pools) {
			return;
		}

		const get = async () => {
			// Promise.all([
			// 	instance.wildPool.getAllDeposits(account),
			// 	instance.liquidityPool.getAllDeposits(account),
			// ]).then((r: Deposit[][]) => {
			// 	console.log('deeposits', r);
			// });

			// Promise.all([
			// 	getBalance('Stake WILD'),
			// 	getBalance('Farm WILD - ETH LP'),
			// ]).then((d: any) => {
			// 	console.log('balances', d);
			// });

			// Get total user value
			getTotalUserValue(
				[instance.wildPool, instance.liquidityPool],
				account,
			).then((d) => {
				setTotalUserValueLocked(d.locked);
				setTotalUserValueUnlocked(d.unlocked);
			});
		};
		get();
	}, [account, instance, pools]);

	const getWildBalance = async (): Promise<ethers.BigNumber | undefined> => {
		if (contracts?.wildToken && account) {
			const balance = await getBalance(contracts?.wildToken, account);
			setWildBalance(balance);
			return balance;
		}
	};

	const checkRewards = async (poolName: string) => {
		if (!account || !instance) {
			throw new Error('Could not find account or instance');
		}

		try {
			// Grab the pool from the pool list
			const pool = getPoolByName(poolName);
			if (!pool) {
				throw new Error('Failed to find pool named ' + poolName);
			}
			const rewards = await pool.instance?.pendingYieldRewards(account);
			return rewards;
		} catch (e: any) {
			console.error(e);
			return undefined;
		}
	};

	const claimRewards = async (poolName: string) => {
		if (!account || !instance) {
			throw new Error('Could not find account or instance');
		}

		try {
			// Grab the pool from the pool list
			const pool = getPoolByName(poolName);
			if (!pool) {
				throw new Error('Failed to find pool named ' + poolName);
			}
			const rewards = await pool.instance?.pendingYieldRewards(account);
			if (!rewards?.gt(0)) {
				throw new Error('Could not find any user rewards for pool' + poolName);
			}
			const tx = await pool.instance?.processRewards(library.getSigner());
			await tx?.wait();
			if (tx) {
				getUserData();
			}
		} catch (e: any) {
			console.error(e);
			return undefined;
		}
	};

	const approve = async (poolName: string) => {
		if (!account || !instance) {
			throw new Error('Could not find account or instance');
		}

		try {
			// Grab the pool from the pool list
			const pool = getPoolByName(poolName);
			console.log('found', pool);
			if (!pool || !pool.address || !pool.contract) {
				throw new Error('Failed to find pool named ' + poolName);
			}
			const tx = await pool.contract.approve(
				pool.address,
				ethers.constants.MaxUint256,
			);
			await tx?.wait();
		} catch (e: any) {
			console.error(e);
			return undefined;
		}
	};

	// Checks approval for Pool to spend a given token
	const checkApproval = async (poolName: string, amount: number) => {
		// If we don't have the right data set up
		if (!account || !instance) {
			throw new Error('Could not find account or instance');
		}

		try {
			const pool = getPoolByName(poolName);
			if (!pool || !pool.address || !pool.contract) {
				throw new Error('Failed to find pool named ' + poolName);
			}
			const approved = await getApproval(
				pool.contract,
				pool.address,
				account,
				amount,
			);
			return approved;
		} catch (e) {
			console.error(e);
			return false;
		}
	};

	const getBalanceByPoolName = async (poolName: string) => {
		// If we don't have the right data set up
		if (!account || !instance) {
			throw new Error('Could not find account or instance');
		}

		try {
			const pool = getPoolByName(poolName);
			if (!pool || !pool.address || !pool.contract) {
				throw new Error('Failed to find pool named ' + poolName);
			}

			const balance = await getBalance(pool.contract, account);
			return balance;
		} catch (e: any) {
			console.error(e);
			return;
		}
	};

	/////////////
	// Actions //
	/////////////

	const stake = async (
		amount: number,
	): Promise<ethers.ContractTransaction | undefined> => {
		if (library) {
			try {
				const tx = await selectedPool?.instance?.stake(
					amount.toString(),
					BigNumber.from(0),
					library.getSigner(),
				);
				tx?.wait().then((d: any) => {
					getAllDepositsForUser();
					getWildBalance();
				});
				return tx;
			} catch (e) {
				console.error(e);
				return undefined;
			}
		}
	};

	/////////////
	// Getters //
	/////////////

	// User Data

	const getUserData = async () => {
		if (!instance || !account || !contracts) {
			throw new Error('Could not find account, instance, or contract');
		}

		// getBalance('Stake WILD')
	};

	// Deposits

	const getAllDepositsForUser = async () => {
		if (instance && account) {
			// Grab deposits from both pools
			// This will need to be expanded in future to allow for more pools
			const response = await Promise.all([
				instance.liquidityPool.getAllDeposits(account),
				instance.wildPool.getAllDeposits(account),
			]);
			const [lp, wild] = response;
			// Map pool data to each deposit for displaying
			lp.forEach((d) => ((d as any).pool = liquidityPool));
			wild.forEach((d) => ((d as any).pool = wildPool));
			const all = lp.concat(wild) as DepositView[];
			setDepositData(all);
		}
	};

	const getDepositData = async (user: string) => {
		await new Promise((r) => setTimeout(r, 5000));
		setDepositData([]);
	};

	// Pools

	const getAllPools = () => {
		if (!instance || !contracts) {
			return;
		}
		// Hardcoded
		// @todo make dynamic

		// WILD
		wildPool.instance = instance?.wildPool;
		wildPool.contract = contracts?.wildToken;
		wildPool.address = addresses[chainIdToNetworkType(chainId)].wildStakingPool;

		// LP
		liquidityPool.instance = instance?.liquidityPool;
		liquidityPool.contract = contracts?.lpToken;
		liquidityPool.address =
			addresses[chainIdToNetworkType(chainId)].lpStakingPool;

		setPoolData([wildPool, liquidityPool]);
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

	const selectDeposit = (id: number, poolName: string) => {
		if (deposits) {
			const deposit = deposits.filter(
				(deposit: DepositView) =>
					deposit.depositId === id && deposit.pool.name === poolName,
			);
			if (deposit.length) {
				setSelectedDeposit(deposit[0]);
			}
		}
	};

	const deselectDeposit = () => {
		setSelectedDeposit(undefined);
	};

	// Pools

	const selectPoolByName = (name: string) => {
		if (pools) {
			const pool = pools.filter((pool: any) => pool.name === name);
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
		getWildBalance,
		deselectPool,
		getPoolByDomain,
		checkRewards,
		getBalanceByPoolName,
		pools,
		selectDeposit,
		selectedDeposit,
		selectedPool,
		selectPoolByName,
		stake,
		checkApproval,
		approve,
		claimRewards,
		totalUserValueLocked,
		totalUserValueUnlocked,
		wildBalance,
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
		checkRewards,
		getPoolByDomain,
		getWildBalance,
		pools,
		selectDeposit,
		getBalanceByPoolName,
		selectedDeposit,
		selectedPool,
		selectPoolByName,
		stake,
		checkApproval,
		approve,
		claimRewards,
		wildBalance,
		totalUserValueLocked,
		totalUserValueUnlocked,
	} = React.useContext(StakingContext);
	return {
		deposits,
		deselectDeposit,
		deselectPool,
		getPoolByDomain,
		checkRewards,
		pools,
		getBalanceByPoolName,
		selectDeposit,
		selectedDeposit,
		selectedPool,
		selectPoolByName,
		stake,
		checkApproval,
		approve,
		wildBalance,
		claimRewards,
		totalUserValueLocked,
		totalUserValueUnlocked,
	};
}
