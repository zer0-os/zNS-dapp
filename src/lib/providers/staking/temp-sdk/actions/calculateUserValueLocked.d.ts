import { SubConfig, UserValue } from '../types';
export declare const calculateUserValueLocked: (
	userAddress: string,
	config: SubConfig,
) => Promise<UserValue>;
