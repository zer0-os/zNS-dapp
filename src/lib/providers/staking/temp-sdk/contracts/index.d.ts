import * as ethers from 'ethers';
import { ZStakeCorePool, ZStakePoolBase, ZStakePoolFactory } from './types';
export * from './types';
export declare const getZStakePoolBase: (
	address: string,
	provider: ethers.providers.Provider,
) => Promise<ZStakePoolBase>;
export declare const getZStakeCorePool: (
	address: string,
	provider: ethers.providers.Provider,
) => Promise<ZStakeCorePool>;
export declare const getZStakePoolFactory: (
	address: string,
	provider: ethers.providers.Provider,
) => Promise<ZStakePoolFactory>;
