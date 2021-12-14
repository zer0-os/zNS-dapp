import { ethers } from 'ethers';
import { SubConfig } from '../types';
export declare const pendingYieldRewards: (
	address: string,
	config: SubConfig,
) => Promise<ethers.BigNumber>;
