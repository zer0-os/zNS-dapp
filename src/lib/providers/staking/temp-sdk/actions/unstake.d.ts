import { ethers } from 'ethers';
import { SubConfig } from '../types';
export declare const unstake: (
	depositId: string,
	amount: string,
	signer: ethers.Signer,
	config: SubConfig,
) => Promise<ethers.ContractTransaction>;
