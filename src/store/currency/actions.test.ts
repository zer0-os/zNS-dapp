import * as actionType from './actionTypes';
import * as currencyType from './types';
import * as action from './actions';
import { currencyReady } from './currency.mockData';

describe('currency.actions', () => {
	it('getWildPriceUsdRequest', () => {
		const expectedAction: currencyType.GetWildPriceUsdRequest = {
			type: actionType.GET_WILD_PRICE_USD_REQUEST,
		};

		expect(action.getWildPriceUsdRequest()).toEqual(expectedAction);
	});

	it('getWildPriceUsdSuccess', () => {
		const mockWildPriceUsd = currencyReady.wildPriceUsd;
		const expectedAction: currencyType.GetWildPriceUsdSuccess = {
			type: actionType.GET_WILD_PRICE_USD_SUCCESS,
			payload: mockWildPriceUsd,
		};

		expect(action.getWildPriceUsdSuccess(mockWildPriceUsd)).toEqual(
			expectedAction,
		);
	});

	it('getWildPriceUsdError', () => {
		const mockError = 'mock error';
		const expectedAction: currencyType.GetWildPriceUsdError = {
			type: actionType.GET_WILD_PRICE_USD_ERROR,
			payload: mockError,
		};

		expect(action.getWildPriceUsdError(mockError)).toEqual(expectedAction);
	});
	it('getLootPriceUsdRequest', () => {
		const expectedAction: currencyType.GetLootPriceUsdRequest = {
			type: actionType.GET_LOOT_PRICE_USD_REQUEST,
		};

		expect(action.getLootPriceUsdRequest()).toEqual(expectedAction);
	});

	it('getLootPriceUsdSuccess', () => {
		const mockLootPriceUsd = currencyReady.lootPriceUsd;
		const expectedAction: currencyType.GetLootPriceUsdSuccess = {
			type: actionType.GET_LOOT_PRICE_USD_SUCCESS,
			payload: mockLootPriceUsd,
		};

		expect(action.getLootPriceUsdSuccess(mockLootPriceUsd)).toEqual(
			expectedAction,
		);
	});

	it('getLootPriceUsdError', () => {
		const mockError = 'mock error';
		const expectedAction: currencyType.GetLootPriceUsdError = {
			type: actionType.GET_LOOT_PRICE_USD_ERROR,
			payload: mockError,
		};

		expect(action.getLootPriceUsdError(mockError)).toEqual(expectedAction);
	});

	it('getZeroPriceUsdRequest', () => {
		const expectedAction: currencyType.GetZeroPriceUsdRequest = {
			type: actionType.GET_ZERO_PRICE_USD_REQUEST,
		};

		expect(action.getZeroPriceUsdRequest()).toEqual(expectedAction);
	});

	it('getZeroPriceUsdSuccess', () => {
		const mockZeroPriceUsd = currencyReady.zeroPriceUsd;
		const expectedAction: currencyType.GetZeroPriceUsdSuccess = {
			type: actionType.GET_ZERO_PRICE_USD_SUCCESS,
			payload: mockZeroPriceUsd,
		};

		expect(action.getZeroPriceUsdSuccess(mockZeroPriceUsd)).toEqual(
			expectedAction,
		);
	});

	it('getZeroPriceUsdError', () => {
		const mockError = 'mock error';
		const expectedAction: currencyType.GetZeroPriceUsdError = {
			type: actionType.GET_ZERO_PRICE_USD_ERROR,
			payload: mockError,
		};

		expect(action.getZeroPriceUsdError(mockError)).toEqual(expectedAction);
	});

	it('getZeroPricePercentageChangeRequest', () => {
		const expectedAction: currencyType.GetZeroPricePercentageChangeRequest = {
			type: actionType.GET_ZERO_PRICE_PERCENTAGE_CHANGE_REQUEST,
		};

		expect(action.getZeroPricePercentageChangeRequest()).toEqual(
			expectedAction,
		);
	});

	it('getZeroPricePercentageChangeSuccess', () => {
		const mockZeroPricePercentageChange = currencyReady.zeroPercentageChange;
		const expectedAction: currencyType.GetZeroPricePercentageChangeSuccess = {
			type: actionType.GET_ZERO_PRICE_PERCENTAGE_CHANGE_SUCCESS,
			payload: mockZeroPricePercentageChange,
		};

		expect(
			action.getZeroPricePercentageChangeSuccess(mockZeroPricePercentageChange),
		).toEqual(expectedAction);
	});

	it('getZeroPricePercentageChangeError', () => {
		const mockError = 'mock error';
		const expectedAction: currencyType.GetZeroPricePercentageChangeError = {
			type: actionType.GET_ZERO_PRICE_PERCENTAGE_CHANGE_ERROR,
			payload: mockError,
		};

		expect(action.getZeroPricePercentageChangeError(mockError)).toEqual(
			expectedAction,
		);
	});

	it('getWildPricePercentageChangeRequest', () => {
		const expectedAction: currencyType.GetWildPricePercentageChangeRequest = {
			type: actionType.GET_WILD_PRICE_PERCENTAGE_CHANGE_REQUEST,
		};

		expect(action.getWildPricePercentageChangeRequest()).toEqual(
			expectedAction,
		);
	});

	it('getWildPricePercentageChangeSuccess', () => {
		const mockWildPricePercentageChange = currencyReady.wildPercentageChange;
		const expectedAction: currencyType.GetWildPricePercentageChangeSuccess = {
			type: actionType.GET_WILD_PRICE_PERCENTAGE_CHANGE_SUCCESS,
			payload: mockWildPricePercentageChange,
		};

		expect(
			action.getWildPricePercentageChangeSuccess(mockWildPricePercentageChange),
		).toEqual(expectedAction);
	});

	it('getWildPricePercentageChangeError', () => {
		const mockError = 'mock error';
		const expectedAction: currencyType.GetWildPricePercentageChangeError = {
			type: actionType.GET_WILD_PRICE_PERCENTAGE_CHANGE_ERROR,
			payload: mockError,
		};

		expect(action.getWildPricePercentageChangeError(mockError)).toEqual(
			expectedAction,
		);
	});
});
