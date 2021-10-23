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
import reducer, { INITIAL_STATE } from './reducer';
import { currencyReady } from './currency.mockData';

describe('currency.reducer', () => {
	it('should be able to get wild price usd request', () => {
		const getWildPriceUsdRequest: GetWildPriceUsdRequest = {
			type: GET_WILD_PRICE_USD_REQUEST,
		};
		const expected = {
			...INITIAL_STATE,
			error: {
				...INITIAL_STATE.error,
				wildPriceUsd: undefined,
			},
		};

		expect(reducer(INITIAL_STATE, getWildPriceUsdRequest)).toEqual(expected);
	});

	it('should be able to handle get wild price usd success', () => {
		const mockPrice = currencyReady.wildPriceUsd;
		const getWildPriceUsdSuccess: GetWildPriceUsdSuccess = {
			type: GET_WILD_PRICE_USD_SUCCESS,
			payload: mockPrice,
		};
		const expected = {
			...INITIAL_STATE,
			wildPriceUsd: mockPrice,
		};

		expect(reducer(INITIAL_STATE, getWildPriceUsdSuccess)).toEqual(expected);
	});

	it('should be able to handle get wild price usd error', () => {
		const mockError = 'mock error';
		const getWildPriceUsdError: GetWildPriceUsdError = {
			type: GET_WILD_PRICE_USD_ERROR,
			payload: mockError,
		};
		const expected = {
			...INITIAL_STATE,
			error: {
				...INITIAL_STATE.error,
				wildPriceUsd: mockError,
			},
		};

		expect(reducer(INITIAL_STATE, getWildPriceUsdError)).toEqual(expected);
	});
	it('should be able to get loot price usd request', () => {
		const getLotPriceUsdRequest: GetLootPriceUsdRequest = {
			type: GET_LOOT_PRICE_USD_REQUEST,
		};
		const expected = {
			...INITIAL_STATE,
			error: {
				...INITIAL_STATE.error,
				lootPriceUsd: undefined,
			},
		};

		expect(reducer(INITIAL_STATE, getLotPriceUsdRequest)).toEqual(expected);
	});

	it('should be able to handle get loot price usd success', () => {
		const mockPrice = currencyReady.lootPriceUsd;
		const getWildLootUsdSuccess: GetLootPriceUsdSuccess = {
			type: GET_LOOT_PRICE_USD_SUCCESS,
			payload: mockPrice,
		};
		const expected = {
			...INITIAL_STATE,
			lootPriceUsd: mockPrice,
		};

		expect(reducer(INITIAL_STATE, getWildLootUsdSuccess)).toEqual(expected);
	});

	it('should be able to handle get loot price usd error', () => {
		const mockError = 'mock error';
		const getLootPriceUsdError: GetLootPriceUsdError = {
			type: GET_LOOT_PRICE_USD_ERROR,
			payload: mockError,
		};
		const expected = {
			...INITIAL_STATE,
			error: {
				...INITIAL_STATE.error,
				lootPriceUsd: mockError,
			},
		};

		expect(reducer(INITIAL_STATE, getLootPriceUsdError)).toEqual(expected);
	});
});
