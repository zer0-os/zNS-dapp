import * as actionType from './actionTypes';
import * as currencyType from './types';
import reducer, { INITIAL_STATE } from './reducer';
import { currencyReady } from './currency.mockData';

describe('currency.reducer', () => {
	it('should be able to get wild price usd request', () => {
		const getWildPriceUsdRequest: currencyType.GetWildPriceUsdRequest = {
			type: actionType.GET_WILD_PRICE_USD_REQUEST,
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
		const getWildPriceUsdSuccess: currencyType.GetWildPriceUsdSuccess = {
			type: actionType.GET_WILD_PRICE_USD_SUCCESS,
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
		const getWildPriceUsdError: currencyType.GetWildPriceUsdError = {
			type: actionType.GET_WILD_PRICE_USD_ERROR,
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
		const getLotPriceUsdRequest: currencyType.GetLootPriceUsdRequest = {
			type: actionType.GET_LOOT_PRICE_USD_REQUEST,
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
		const getWildLootUsdSuccess: currencyType.GetLootPriceUsdSuccess = {
			type: actionType.GET_LOOT_PRICE_USD_SUCCESS,
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
		const getLootPriceUsdError: currencyType.GetLootPriceUsdError = {
			type: actionType.GET_LOOT_PRICE_USD_ERROR,
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

	it('should be able to get zero price usd request', () => {
		const getZeroPriceUsdRequest: currencyType.GetZeroPriceUsdRequest = {
			type: actionType.GET_ZERO_PRICE_USD_REQUEST,
		};
		const expected = {
			...INITIAL_STATE,
			error: {
				...INITIAL_STATE.error,
				zeroPriceUsd: undefined,
			},
		};

		expect(reducer(INITIAL_STATE, getZeroPriceUsdRequest)).toEqual(expected);
	});

	it('should be able to handle get zero price usd success', () => {
		const mockPrice = currencyReady.zeroPriceUsd;
		const getZeroPriceUsdSuccess: currencyType.GetZeroPriceUsdSuccess = {
			type: actionType.GET_ZERO_PRICE_USD_SUCCESS,
			payload: mockPrice,
		};
		const expected = {
			...INITIAL_STATE,
			zeroPriceUsd: mockPrice,
		};

		expect(reducer(INITIAL_STATE, getZeroPriceUsdSuccess)).toEqual(expected);
	});

	it('should be able to handle get zero price usd error', () => {
		const mockError = 'mock error';
		const getZeroPriceUsdError: currencyType.GetZeroPriceUsdError = {
			type: actionType.GET_ZERO_PRICE_USD_ERROR,
			payload: mockError,
		};
		const expected = {
			...INITIAL_STATE,
			error: {
				...INITIAL_STATE.error,
				zeroPriceUsd: mockError,
			},
		};

		expect(reducer(INITIAL_STATE, getZeroPriceUsdError)).toEqual(expected);
	});

	it('should be able to get zero price percentage change request', () => {
		const getZeroPricePercentageChangeRequest: currencyType.GetZeroPricePercentageChangeRequest =
			{
				type: actionType.GET_ZERO_PRICE_PERCENTAGE_CHANGE_REQUEST,
			};
		const expected = {
			...INITIAL_STATE,
			error: {
				...INITIAL_STATE.error,
				zeroPercentageChange: undefined,
			},
		};

		expect(reducer(INITIAL_STATE, getZeroPricePercentageChangeRequest)).toEqual(
			expected,
		);
	});

	it('should be able to handle get zero price percentage change success', () => {
		const mockPrice = currencyReady.zeroPriceUsd;
		const getZeroPricePercentageChangeSuccess: currencyType.GetZeroPricePercentageChangeSuccess =
			{
				type: actionType.GET_ZERO_PRICE_PERCENTAGE_CHANGE_SUCCESS,
				payload: mockPrice,
			};
		const expected = {
			...INITIAL_STATE,
			zeroPercentageChange: mockPrice,
		};

		expect(reducer(INITIAL_STATE, getZeroPricePercentageChangeSuccess)).toEqual(
			expected,
		);
	});

	it('should be able to handle get zero price percentage change error', () => {
		const mockError = 'mock error';
		const getZeroPricePercentageChangeError: currencyType.GetZeroPricePercentageChangeError =
			{
				type: actionType.GET_ZERO_PRICE_PERCENTAGE_CHANGE_ERROR,
				payload: mockError,
			};
		const expected = {
			...INITIAL_STATE,
			error: {
				...INITIAL_STATE.error,
				zeroPercentageChange: mockError,
			},
		};

		expect(reducer(INITIAL_STATE, getZeroPricePercentageChangeError)).toEqual(
			expected,
		);
	});

	it('should be able to get wild price percentage change request', () => {
		const getWildPricePercentageChangeRequest: currencyType.GetWildPricePercentageChangeRequest =
			{
				type: actionType.GET_WILD_PRICE_PERCENTAGE_CHANGE_REQUEST,
			};
		const expected = {
			...INITIAL_STATE,
			error: {
				...INITIAL_STATE.error,
				wildPercentageChange: undefined,
			},
		};

		expect(reducer(INITIAL_STATE, getWildPricePercentageChangeRequest)).toEqual(
			expected,
		);
	});

	it('should be able to handle get wild price percentage change success', () => {
		const mockPrice = currencyReady.wildPriceUsd;
		const getWildPricePercentageChangeSuccess: currencyType.GetWildPricePercentageChangeSuccess =
			{
				type: actionType.GET_WILD_PRICE_PERCENTAGE_CHANGE_SUCCESS,
				payload: mockPrice,
			};
		const expected = {
			...INITIAL_STATE,
			wildPercentageChange: mockPrice,
		};

		expect(reducer(INITIAL_STATE, getWildPricePercentageChangeSuccess)).toEqual(
			expected,
		);
	});

	it('should be able to handle get wild price percentage change error', () => {
		const mockError = 'mock error';
		const getWildPricePercentageChangeError: currencyType.GetWildPricePercentageChangeError =
			{
				type: actionType.GET_WILD_PRICE_PERCENTAGE_CHANGE_ERROR,
				payload: mockError,
			};
		const expected = {
			...INITIAL_STATE,
			error: {
				...INITIAL_STATE.error,
				wildPercentageChange: mockError,
			},
		};

		expect(reducer(INITIAL_STATE, getWildPricePercentageChangeError)).toEqual(
			expected,
		);
	});
});
