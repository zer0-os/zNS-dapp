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
import { CurrencyState, CurrencyActions } from './types';

export const REDUCER_NAME = 'currency';

export const INITIAL_STATE: CurrencyState = {
	wildPriceUsd: 0,
	lootPriceUsd: 0,
	zeroPriceUsd: 0,
	wildPercentageChange: 0,
	zeroPercentageChange: 0,
	error: {
		wildPriceUsd: undefined,
		lootPriceUsd: undefined,
		zeroPriceUsd: undefined,
		wildPercentageChange: undefined,
		zeroPercentageChange: undefined,
	},
};

const reducer = (state = INITIAL_STATE, action: CurrencyActions) => {
	switch (action.type) {
		case GET_WILD_PRICE_USD_REQUEST:
			return {
				...state,
				error: {
					...state.error,
					wildPriceUsd: undefined,
				},
			};
		case GET_WILD_PRICE_USD_SUCCESS:
			return {
				...state,
				wildPriceUsd: action.payload,
			};
		case GET_WILD_PRICE_USD_ERROR:
			return {
				...state,
				error: {
					...state.error,
					wildPriceUsd: action.payload,
				},
			};
		case GET_WILD_PRICE_PERCENTAGE_CHANGE_REQUEST:
			return {
				...state,
				error: {
					...state.error,
					wildPercentageChange: undefined,
				},
			};
		case GET_WILD_PRICE_PERCENTAGE_CHANGE_SUCCESS:
			return {
				...state,
				wildPercentageChange: action.payload,
			};
		case GET_WILD_PRICE_PERCENTAGE_CHANGE_ERROR:
			return {
				...state,
				error: {
					...state.error,
					wildPercentageChange: action.payload,
				},
			};
		case GET_LOOT_PRICE_USD_REQUEST:
			return {
				...state,
				error: {
					...state.error,
					lootPriceUsd: undefined,
				},
			};
		case GET_LOOT_PRICE_USD_SUCCESS:
			return {
				...state,
				lootPriceUsd: action.payload,
			};
		case GET_LOOT_PRICE_USD_ERROR:
			return {
				...state,
				error: {
					...state.error,
					lootPriceUsd: action.payload,
				},
			};
		case GET_ZERO_PRICE_USD_REQUEST:
			return {
				...state,
				error: {
					...state.error,
					zeroPriceUsd: undefined,
				},
			};
		case GET_ZERO_PRICE_USD_SUCCESS:
			return {
				...state,
				zeroPriceUsd: action.payload,
			};
		case GET_ZERO_PRICE_USD_ERROR:
			return {
				...state,
				error: {
					...state.error,
					zeroPriceUsd: action.payload,
				},
			};
		case GET_ZERO_PRICE_PERCENTAGE_CHANGE_REQUEST:
			return {
				...state,
				error: {
					...state.error,
					zeroPercentageChange: undefined,
				},
			};
		case GET_ZERO_PRICE_PERCENTAGE_CHANGE_SUCCESS:
			return {
				...state,
				zeroPercentageChange: action.payload,
			};
		case GET_ZERO_PRICE_PERCENTAGE_CHANGE_ERROR:
			return {
				...state,
				error: {
					...state.error,
					zeroPercentageChange: action.payload,
				},
			};
		default:
			return {
				...state,
			};
	}
};

export default reducer;
