import { takeEvery } from '@redux-saga/core/effects';
import * as actionType from './actionTypes';
import * as saga from './sagas';

describe('currency.sagas', () => {
	describe('getWildPriceUsdSaga', () => {
		const genSaga = saga.getWildPriceUsdSaga();

		it('should wait for every GET_WILD_PRICE_USD_REQUEST action and call getWildPriceUsd', () => {
			expect(genSaga.next().value).toEqual(
				takeEvery(actionType.GET_WILD_PRICE_USD_REQUEST, saga.getWildPriceUsd),
			);
		});

		it('should be done on next iteration', () => {
			expect(genSaga.next().done).toBeTruthy();
		});
	});

	describe('getLootPriceUsdSaga', () => {
		const genSaga = saga.getLootPriceUsdSaga();

		it('should wait for every GET_LOOT_PRICE_USD_REQUEST action and call getLootPriceUsd', () => {
			expect(genSaga.next().value).toEqual(
				takeEvery(actionType.GET_LOOT_PRICE_USD_REQUEST, saga.getLootPriceUsd),
			);
		});

		it('should be done on next iteration', () => {
			expect(genSaga.next().done).toBeTruthy();
		});
	});

	describe('getZeroPriceUsdSaga', () => {
		const genSaga = saga.getZeroPriceUsdSaga();

		it('should wait for every GET_ZERO_PRICE_USD_REQUEST action and call getZeroPriceUsd', () => {
			expect(genSaga.next().value).toEqual(
				takeEvery(actionType.GET_ZERO_PRICE_USD_REQUEST, saga.getZeroPriceUsd),
			);
		});

		it('should be done on next iteration', () => {
			expect(genSaga.next().done).toBeTruthy();
		});
	});

	describe('getZeroPricePercentageChangeSaga', () => {
		const genSaga = saga.getZeroPricePercentageChangeSaga();

		it('should wait for every GET_ZERO_PRICE_PERCENTAGE_CHANGE_REQUEST action and call getZeroPricePercentageChange', () => {
			expect(genSaga.next().value).toEqual(
				takeEvery(
					actionType.GET_ZERO_PRICE_PERCENTAGE_CHANGE_REQUEST,
					saga.getZeroPricePercentageChange,
				),
			);
		});

		it('should be done on next iteration', () => {
			expect(genSaga.next().done).toBeTruthy();
		});
	});

	describe('getWildPricePercentageChangeSaga', () => {
		const genSaga = saga.getWildPricePercentageChangeSaga();

		it('should wait for every GET_WILD_PRICE_PERCENTAGE_CHANGE_REQUEST action and call getWildPricePercentageChange', () => {
			expect(genSaga.next().value).toEqual(
				takeEvery(
					actionType.GET_WILD_PRICE_PERCENTAGE_CHANGE_REQUEST,
					saga.getWildPricePercentageChange,
				),
			);
		});

		it('should be done on next iteration', () => {
			expect(genSaga.next().done).toBeTruthy();
		});
	});
});
