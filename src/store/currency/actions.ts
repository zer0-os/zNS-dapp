import {
	GET_WILD_PRICE_USD_REQUEST,
	GET_WILD_PRICE_USD_SUCCESS,
	GET_WILD_PRICE_USD_ERROR,
	GET_LOOT_PRICE_USD_REQUEST,
	GET_LOOT_PRICE_USD_SUCCESS,
	GET_LOOT_PRICE_USD_ERROR,
} from './actionTypes';
import {
	GetWildPriceUsdRequest,
	GetWildPriceUsdSuccess,
	GetWildPriceUsdError,
	GetLootPriceUsdRequest,
	GetLootPriceUsdSuccess,
	GetLootPriceUsdError,
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
