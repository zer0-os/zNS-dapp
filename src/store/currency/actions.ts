import {
	GET_WILD_PRICE_USD_REQUEST,
	GET_WILD_PRICE_USD_SUCCESS,
	GET_WILD_PRICE_USD_ERROR,
	GET_LOOT_PRICE_USD_REQUEST,
	GET_LOOT_PRICE_USD_SUCCESS,
	GET_LOOT_PRICE_USD_ERROR,
	GET_ZERO_PRICE_USD_REQUEST,
	GET_ZERO_PRICE_USD_SUCCESS,
	GET_ZERO_PRICE_USD_ERROR,
	GET_WILD_PRICE_PERCENTAGE_CHANGE_REQUEST,
	GET_WILD_PRICE_PERCENTAGE_CHANGE_SUCCESS,
	GET_WILD_PRICE_PERCENTAGE_CHANGE_ERROR,
	GET_ZERO_PRICE_PERCENTAGE_CHANGE_REQUEST,
	GET_ZERO_PRICE_PERCENTAGE_CHANGE_SUCCESS,
	GET_ZERO_PRICE_PERCENTAGE_CHANGE_ERROR,
} from './actionTypes';
import {
	GetWildPriceUsdRequest,
	GetWildPriceUsdSuccess,
	GetWildPriceUsdError,
	GetLootPriceUsdRequest,
	GetLootPriceUsdSuccess,
	GetLootPriceUsdError,
	GetZeroPriceUsdRequest,
	GetZeroPriceUsdSuccess,
	GetZeroPriceUsdError,
	GetWildPricePercentageChangeRequest,
	GetWildPricePercentageChangeSuccess,
	GetWildPricePercentageChangeError,
	GetZeroPricePercentageChangeRequest,
	GetZeroPricePercentageChangeSuccess,
	GetZeroPricePercentageChangeError,
} from './types';

/**
 *  GET_WILD_PRICE_USD actions
 */
export const getWildPriceUsdRequest = (): GetWildPriceUsdRequest => ({
	type: GET_WILD_PRICE_USD_REQUEST,
});

export const getWildPriceUsdSuccess = (
	payload: number,
): GetWildPriceUsdSuccess => ({
	type: GET_WILD_PRICE_USD_SUCCESS,
	payload,
});

export const getWildPriceUsdError = (
	payload: string,
): GetWildPriceUsdError => ({
	type: GET_WILD_PRICE_USD_ERROR,
	payload,
});

export const getWildPricePercentageChangeRequest =
	(): GetWildPricePercentageChangeRequest => ({
		type: GET_WILD_PRICE_PERCENTAGE_CHANGE_REQUEST,
	});

export const getWildPricePercentageChangeSuccess = (
	payload: number,
): GetWildPricePercentageChangeSuccess => ({
	type: GET_WILD_PRICE_PERCENTAGE_CHANGE_SUCCESS,
	payload,
});

export const getWildPricePercentageChangeError = (
	payload: string,
): GetWildPricePercentageChangeError => ({
	type: GET_WILD_PRICE_PERCENTAGE_CHANGE_ERROR,
	payload,
});

/**
 *  GET_LOOT_PRICE_USD actions
 */
export const getLootPriceUsdRequest = (): GetLootPriceUsdRequest => ({
	type: GET_LOOT_PRICE_USD_REQUEST,
});

export const getLootPriceUsdSuccess = (
	payload: number,
): GetLootPriceUsdSuccess => ({
	type: GET_LOOT_PRICE_USD_SUCCESS,
	payload,
});

export const getLootPriceUsdError = (
	payload: string,
): GetLootPriceUsdError => ({
	type: GET_LOOT_PRICE_USD_ERROR,
	payload,
});

/**
 *  GET_ZERO_PRICE_USD actions
 */
export const getZeroPriceUsdRequest = (): GetZeroPriceUsdRequest => ({
	type: GET_ZERO_PRICE_USD_REQUEST,
});

export const getZeroPriceUsdSuccess = (
	payload: number,
): GetZeroPriceUsdSuccess => ({
	type: GET_ZERO_PRICE_USD_SUCCESS,
	payload,
});

export const getZeroPriceUsdError = (
	payload: string,
): GetZeroPriceUsdError => ({
	type: GET_ZERO_PRICE_USD_ERROR,
	payload,
});

export const getZeroPricePercentageChangeRequest =
	(): GetZeroPricePercentageChangeRequest => ({
		type: GET_ZERO_PRICE_PERCENTAGE_CHANGE_REQUEST,
	});

export const getZeroPricePercentageChangeSuccess = (
	payload: number,
): GetZeroPricePercentageChangeSuccess => ({
	type: GET_ZERO_PRICE_PERCENTAGE_CHANGE_SUCCESS,
	payload,
});

export const getZeroPricePercentageChangeError = (
	payload: string,
): GetZeroPricePercentageChangeError => ({
	type: GET_ZERO_PRICE_PERCENTAGE_CHANGE_ERROR,
	payload,
});
