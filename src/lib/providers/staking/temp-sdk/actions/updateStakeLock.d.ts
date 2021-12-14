import * as ethers from 'ethers';
import { SubConfig } from '../types';
export declare const updateStakeLock: (
	depositId: string,
	lockUntil: ethers.BigNumber,
	signer: ethers.Signer,
	config: SubConfig,
) => Promise<ethers.ContractTransaction>;
