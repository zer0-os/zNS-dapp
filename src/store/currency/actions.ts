import * as actionType from './actionTypes';
import * as currencyType from './types';

/**
 *  GET_WILD_PRICE_USD actions
 */
export const getWildPriceUsdRequest =
	(): currencyType.GetWildPriceUsdRequest => ({
		type: actionType.GET_WILD_PRICE_USD_REQUEST,
	});

export const getWildPriceUsdSuccess = (
	payload: number,
): currencyType.GetWildPriceUsdSuccess => ({
	type: actionType.GET_WILD_PRICE_USD_SUCCESS,
	payload,
});

export const getWildPriceUsdError = (
	payload: string,
): currencyType.GetWildPriceUsdError => ({
	type: actionType.GET_WILD_PRICE_USD_ERROR,
	payload,
});

export const getWildPricePercentageChangeRequest =
	(): currencyType.GetWildPricePercentageChangeRequest => ({
		type: actionType.GET_WILD_PRICE_PERCENTAGE_CHANGE_REQUEST,
	});

export const getWildPricePercentageChangeSuccess = (
	payload: number,
): currencyType.GetWildPricePercentageChangeSuccess => ({
	type: actionType.GET_WILD_PRICE_PERCENTAGE_CHANGE_SUCCESS,
	payload,
});

export const getWildPricePercentageChangeError = (
	payload: string,
): currencyType.GetWildPricePercentageChangeError => ({
	type: actionType.GET_WILD_PRICE_PERCENTAGE_CHANGE_ERROR,
	payload,
});

/**
 *  GET_LOOT_PRICE_USD actions
 */
export const getLootPriceUsdRequest =
	(): currencyType.GetLootPriceUsdRequest => ({
		type: actionType.GET_LOOT_PRICE_USD_REQUEST,
	});

export const getLootPriceUsdSuccess = (
	payload: number,
): currencyType.GetLootPriceUsdSuccess => ({
	type: actionType.GET_LOOT_PRICE_USD_SUCCESS,
	payload,
});

export const getLootPriceUsdError = (
	payload: string,
): currencyType.GetLootPriceUsdError => ({
	type: actionType.GET_LOOT_PRICE_USD_ERROR,
	payload,
});

/**
 *  GET_ZERO_PRICE_USD actions
 */
export const getZeroPriceUsdRequest =
	(): currencyType.GetZeroPriceUsdRequest => ({
		type: actionType.GET_ZERO_PRICE_USD_REQUEST,
	});

export const getZeroPriceUsdSuccess = (
	payload: number,
): currencyType.GetZeroPriceUsdSuccess => ({
	type: actionType.GET_ZERO_PRICE_USD_SUCCESS,
	payload,
});

export const getZeroPriceUsdError = (
	payload: string,
): currencyType.GetZeroPriceUsdError => ({
	type: actionType.GET_ZERO_PRICE_USD_ERROR,
	payload,
});

export const getZeroPricePercentageChangeRequest =
	(): currencyType.GetZeroPricePercentageChangeRequest => ({
		type: actionType.GET_ZERO_PRICE_PERCENTAGE_CHANGE_REQUEST,
	});

export const getZeroPricePercentageChangeSuccess = (
	payload: number,
): currencyType.GetZeroPricePercentageChangeSuccess => ({
	type: actionType.GET_ZERO_PRICE_PERCENTAGE_CHANGE_SUCCESS,
	payload,
});

export const getZeroPricePercentageChangeError = (
	payload: string,
): currencyType.GetZeroPricePercentageChangeError => ({
	type: actionType.GET_ZERO_PRICE_PERCENTAGE_CHANGE_ERROR,
	payload,
});
