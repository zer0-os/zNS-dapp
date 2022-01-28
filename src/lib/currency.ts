import { ethers } from 'ethers';

export const toFiat = (x: number) =>
	x.toLocaleString(undefined, {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	});

export const displayEther = (x: ethers.BigNumber, decimalPlaces?: number) => {
	return Number(Number(ethers.utils.formatEther(x))).toLocaleString(undefined, {
		maximumFractionDigits: decimalPlaces || 2,
		minimumFractionDigits: decimalPlaces || 2,
	});
};

export const displayEtherToFiat = (
	x: ethers.BigNumber,
	conversionRate: number,
) => {
	try {
		const fiat = toFiat(Number(ethers.utils.formatEther(x)) * conversionRate);
		return fiat;
	} catch {
		return '-';
	}
};
