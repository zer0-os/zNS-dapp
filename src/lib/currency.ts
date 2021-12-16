import { ethers } from 'ethers';

export const toFiat = (x: number) =>
	x.toLocaleString(undefined, {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	});

export const displayEther = (x: ethers.BigNumber, decimalPlaces?: number) => {
	const wei = x.toString();
	const number = ethers.utils.formatEther(wei);
	const regex = new RegExp(`[0-9]+[\.[0-9]{${(decimalPlaces || 2) + 1}}]?`);
	const rounded = number.match(regex)?.pop();
	if (rounded) {
		return ethers.utils.commify(rounded);
	} else {
		return number;
	}
};
