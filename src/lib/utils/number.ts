import millify from 'millify';
import { ethers } from 'ethers';

export const formatNumber = (number: number) => {
	return millify(number, {
		precision: 2,
		lowercase: false,
	});
};

export const formatEthers = (number: string) => {
	const asNumber = Number(ethers.utils.formatEther(number));
	return formatNumber(asNumber);
};
