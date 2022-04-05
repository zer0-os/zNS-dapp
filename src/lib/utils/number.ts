//- Constants Imports
import { CURRENCY } from 'constants/currency';

//- Lib Imports
import { BigNumber } from 'ethers';
import jsBigDecimal from 'js-big-decimal';
import millify from 'millify';

export const formatNumber = (
	number: number | string,
	shouldMillify?: boolean,
) => {
	try {
		if (shouldMillify) {
			return millify(Number(number), { precision: 3 });
		}
		if (number < 0.01) {
			return formatBigNumber(number);
		} else {
			return Number(number).toLocaleString();
		}
	} catch (e) {
		console.error(e);
		throw new Error(`Failed to convert ${typeof number}: ${number}`);
	}
};

/**
 * This should be deprecated, as it just calls formatBigNumber now
 */
export const formatEthers = (number: string) => {
	return formatBigNumber(number);
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
	bidAmount ? formatBigNumber(bidAmount).toString() + ` ${CURRENCY.WILD}` : '';

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
