import {
	GET_WILD_PRICE_USD_REQUEST,
	GET_WILD_PRICE_USD_SUCCESS,
	GET_WILD_PRICE_USD_ERROR,
	GET_LOOT_PRICE_USD_REQUEST,
	GET_LOOT_PRICE_USD_SUCCESS,
	GET_LOOT_PRICE_USD_ERROR,
} from './actionTypes';

/**
 * Currency state definition
 */
export type CurrencyState = {
	wildPriceUsd: number;
	lootPriceUsd: number;
	error: {
		wildPriceUsd: string | undefined;
		lootPriceUsd: string | undefined;
	};
};

/**
 * Currency actions definition
 */
export type GetWildPriceUsdRequest = {
	type: typeof GET_WILD_PRICE_USD_REQUEST;
};
export type GetWildPriceUsdSuccess = {
	type: typeof GET_WILD_PRICE_USD_SUCCESS;
	payload: number;
};
export type GetWildPriceUsdError = {
	type: typeof GET_WILD_PRICE_USD_ERROR;
	payload: string;
};

export type GetLootPriceUsdRequest = {
	type: typeof GET_LOOT_PRICE_USD_REQUEST;
};
export type GetLootPriceUsdSuccess = {
	type: typeof GET_LOOT_PRICE_USD_SUCCESS;
	payload: number;
};
export type GetLootPriceUsdError = {
	type: typeof GET_LOOT_PRICE_USD_ERROR;
	payload: string;
};

/**
 * Union Currency actions definition
 *
 * To be used in Reducer
 */
export type CurrencyActions =
	| GetWildPriceUsdRequest
	| GetWildPriceUsdSuccess
	| GetWildPriceUsdError
	| GetLootPriceUsdRequest
	| GetLootPriceUsdSuccess
	| GetLootPriceUsdError;
