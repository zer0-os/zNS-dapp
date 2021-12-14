import { ethers } from 'ethers';
import { SubConfig } from '../types';
export declare const stake: (
	amount: string,
	lockUntil: ethers.BigNumber,
	signer: ethers.Signer,
	config: SubConfig,
) => Promise<ethers.ContractTransaction>;
