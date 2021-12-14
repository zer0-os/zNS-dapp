import { ZStakeCorePool, ZStakePoolFactory } from '../contracts/types';
import { SubConfig } from '../types';
export declare const getCorePool: (
	config: SubConfig,
) => Promise<ZStakeCorePool>;
export declare const getPoolFactory: (
	config: SubConfig,
) => Promise<ZStakePoolFactory>;
