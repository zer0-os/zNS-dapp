import { ethers } from 'ethers';

/**
 * Converts a number to fiat format - just a locale string
 * with 2 dp
 * @param n number to convert
 * @returns number as locale string converted to 2dp
 */
export const toFiat = (n: number) => {
	return (n ?? 0).toLocaleString(undefined, {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	});
};

/**
 * Converts a big number to a locale string with decimals
 * @param n number to convert
 * @param decimalPlaces decimal places to round to (default 2)
 * @returns a converted big number
 */
export const displayEther = (n: ethers.BigNumber, decimalPlaces?: number) => {
	return Number(Number(ethers.utils.formatEther(n))).toLocaleString(undefined, {
		maximumFractionDigits: decimalPlaces || 2,
		minimumFractionDigits: decimalPlaces || 2,
	});
};

/**
 * Multiplies a BigNumber by a conversion rate, and
 * returns it in Fiat format (locale string with 2dp)
 * @param n number to convert
 * @param conversionRate conversion rate to apply
 * @returns fiat format of BigNumber * conversion rate
 */
export const displayEtherToFiat = (
	n: ethers.BigNumber,
	conversionRate: number,
) => {
	try {
		const fiat = toFiat(Number(ethers.utils.formatEther(n)) * conversionRate);
		return fiat;
	} catch {
		return '-';
	}
};
