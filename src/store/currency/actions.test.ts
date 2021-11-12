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
import {
	getWildPriceUsdRequest,
	getWildPriceUsdSuccess,
	getWildPriceUsdError,
	getLootPriceUsdRequest,
	getLootPriceUsdSuccess,
	getLootPriceUsdError,
} from './actions';
import { currencyReady } from './currency.mockData';

describe('currency.actions', () => {
	it('getWildPriceUsdRequest', () => {
		const expectedAction: GetWildPriceUsdRequest = {
			type: GET_WILD_PRICE_USD_REQUEST,
		};

		expect(getWildPriceUsdRequest()).toEqual(expectedAction);
	});

	it('getWildPriceUsdSuccess', () => {
		const mockWildPriceUsd = currencyReady.wildPriceUsd;
		const expectedAction: GetWildPriceUsdSuccess = {
			type: GET_WILD_PRICE_USD_SUCCESS,
			payload: mockWildPriceUsd,
		};

		expect(getWildPriceUsdSuccess(mockWildPriceUsd)).toEqual(expectedAction);
	});

	it('getWildPriceUsdError', () => {
		const mockError = 'mock error';
		const expectedAction: GetWildPriceUsdError = {
			type: GET_WILD_PRICE_USD_ERROR,
			payload: mockError,
		};

		expect(getWildPriceUsdError(mockError)).toEqual(expectedAction);
	});
	it('getLootPriceUsdRequest', () => {
		const expectedAction: GetLootPriceUsdRequest = {
			type: GET_LOOT_PRICE_USD_REQUEST,
		};

		expect(getLootPriceUsdRequest()).toEqual(expectedAction);
	});

	it('getLootPriceUsdSuccess', () => {
		const mockLootPriceUsd = currencyReady.lootPriceUsd;
		const expectedAction: GetLootPriceUsdSuccess = {
			type: GET_LOOT_PRICE_USD_SUCCESS,
			payload: mockLootPriceUsd,
		};

		expect(getLootPriceUsdSuccess(mockLootPriceUsd)).toEqual(expectedAction);
	});

	it('getLootPriceUsdError', () => {
		const mockError = 'mock error';
		const expectedAction: GetLootPriceUsdError = {
			type: GET_LOOT_PRICE_USD_ERROR,
			payload: mockError,
		};

		expect(getLootPriceUsdError(mockError)).toEqual(expectedAction);
	});
});
