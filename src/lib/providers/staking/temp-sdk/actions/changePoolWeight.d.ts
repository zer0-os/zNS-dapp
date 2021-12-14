import { ethers } from 'ethers';
import { SubConfig } from '../types';
export declare const changePoolWeight: (
	poolAddress: string,
	weight: ethers.BigNumber,
	signer: ethers.Signer,
	config: SubConfig,
) => Promise<ethers.ContractTransaction>;
