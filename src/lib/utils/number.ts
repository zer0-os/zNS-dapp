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

export const ONE_DECIMAL_PLACE_VALUE = 1;
export const TWO_DECIMAL_PLACE_VALUE = 2;
export const THREE_DECIMAL_PLACE_VALUE = 3;

export const formatByDecimalPlace = (
	value: number | string,
	places: number,
	localeCode?: string,
	config = { maximumFractionDigits: places, minimumFractionDigits: places },
) => {
	const number = Number(value);
	return Number.isNaN(number) ? '' : number.toLocaleString(localeCode, config);
};
