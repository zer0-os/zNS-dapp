import { BigNumber, ethers } from 'ethers';
export interface SubConfig {
	address: string;
	provider: ethers.providers.Provider;
}
export interface Config {
	wildPoolAddress: string;
	lpTokenPoolAddress: string;
	factoryAddress: string;
	provider: ethers.providers.Provider;
}
export interface Instance {
	factory: FactoryInstance;
	wildPool: PoolInstance;
	liquidityPool: PoolInstance;
}
export interface FactoryInstance {
	getPoolAddress: (poolToken: string) => Promise<string>;
	getPoolData: (poolAddress: string) => Promise<PoolData>;
}
export interface PoolInstance {
	stake: (
		amount: string,
		lockUntil: ethers.BigNumber,
		signer: ethers.Signer,
	) => Promise<ethers.ContractTransaction>;
	unstake: (
		depositId: string,
		amount: string,
		signer: ethers.Signer,
	) => Promise<ethers.ContractTransaction>;
	processRewards: (
		signer: ethers.Signer,
	) => Promise<ethers.ContractTransaction>;
	updateStakeLock: (
		depositId: string,
		lockUntil: ethers.BigNumber,
		signer: ethers.Signer,
	) => Promise<ethers.ContractTransaction>;
	pendingYieldRewards: (address: string) => Promise<ethers.BigNumber>;
	getAllDeposits: (address: string) => Promise<Deposit[]>;
	getUser: (address: string) => Promise<User>;
	getPoolToken: () => Promise<string>;
	getLastYieldDistribution: () => Promise<ethers.BigNumber>;
	getLiquidityPoolWeight: () => Promise<number>;
	getTokenPoolWeight: () => Promise<number>;
	getRewardTokensPerBlock: () => Promise<ethers.BigNumber>;
	calculateUserValueLocked: (address: string) => Promise<UserValue>;
}
export interface Deposit {
	depositId: number;
	tokenAmount: BigNumber;
	weight: BigNumber;
	lockedFrom: BigNumber;
	lockedUntil: BigNumber;
	isYield: boolean;
}
export interface User {
	tokenAmount: BigNumber;
	totalWeight: BigNumber;
	subYieldRewards: BigNumber;
}
export interface UserValue {
	userValueLocked: ethers.BigNumber;
	userValueUnlocked: ethers.BigNumber;
}
export interface PoolData {
	poolToken: string;
	poolAddress: string;
	weight: number;
	isFlashPool: boolean;
}
