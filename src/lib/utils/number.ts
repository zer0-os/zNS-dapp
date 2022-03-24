//- Constants Imports
import { CURRENCY } from 'constants/currency';

//- Lib Imports
import { ethers } from 'ethers';

export const formatNumber = (number: number) => {
	// return millify(number, {
	// 	precision: 2,
	// 	lowercase: false,
	// });
	return number.toLocaleString();
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
