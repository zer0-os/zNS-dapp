import { ethers } from 'ethers';

export type Transaction = {
	action: 'Sent' | 'Received';
	asset: string;
	amount?: ethers.BigNumber;
	address: string;
	date: Date;
	id: string;
	icon: string;
};
