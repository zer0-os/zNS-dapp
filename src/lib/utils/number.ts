//- Constants Imports
import { CURRENCY } from 'constants/currency';

//- Lib Imports
import { BigNumber, ethers } from 'ethers';
import jsBigDecimal from 'js-big-decimal';

export const formatNumber = (number: number | string) => {
	return Number(number).toLocaleString();
};

export const formatEthers = (number: string) => {
	const asNumber = Number(ethers.utils.formatEther(number));
	return formatNumber(asNumber);
};

export const formatByDecimalPlace = (
	value: number | string,
	places: number,
	localeCode?: string,
	config = { maximumFractionDigits: places, minimumFractionDigits: places },
) => {
	const number = Number(value);
	return Number.isNaN(number) ? '' : number.toLocaleString(localeCode, config);
};

// Format bid amount in WILD
export const formatBidAmount = (bidAmount?: string) =>
	bidAmount
		? ethers.utils.formatEther(bidAmount).toString() + ` ${CURRENCY.WILD}`
		: '';

/**
 * Formats a big number to something readable.
 * e.g. 1000000 -> 1,000,000
 * @param number to format
 * @returns formatted string
 */
export const formatBigNumber = (
	number: BigNumber | string | number,
): string => {
	try {
		return jsBigDecimal
			.getPrettyValue(number.toString(), undefined, undefined)
			.replace(/\.0+$/, '');
	} catch (e) {
		console.error(e);
		throw new Error('Attempted to prettify invalid number');
	}
};
