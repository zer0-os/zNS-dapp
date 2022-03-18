import { ethers } from 'ethers';

export type DAO = {
	id: string;
	icon: string;
	name: string;
	zna: string;
	value: ethers.BigNumber;
	holders: number;
};
