import { SubConfig, Deposit } from '../types';
export declare const getAllDeposits: (
	address: string,
	config: SubConfig,
) => Promise<Deposit[]>;
