import { ethers } from 'ethers';
import { SubConfig } from '../types';
export declare const processRewards: (
	signer: ethers.Signer,
	config: SubConfig,
) => Promise<ethers.ContractTransaction>;
