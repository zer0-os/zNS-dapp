import { takeEvery } from '@redux-saga/core/effects';
import {
	GET_WILD_PRICE_USD_REQUEST,
	GET_LOOT_PRICE_USD_REQUEST,
} from './actionTypes';
import {
	getWildPriceUsd,
	getWildPriceUsdSaga,
	getLootPriceUsd,
	getLootPriceUsdSaga,
} from './sagas';

describe('currency.sagas', () => {
	describe('getWildPriceUsdSaga', () => {
		const genSaga = getWildPriceUsdSaga();

		it('should wait for every GET_WILD_PRICE_USD_REQUEST action and call getWildPriceUsd', () => {
			expect(genSaga.next().value).toEqual(
				takeEvery(GET_WILD_PRICE_USD_REQUEST, getWildPriceUsd),
			);
		});

		it('should be done on next iteration', () => {
			expect(genSaga.next().done).toBeTruthy();
		});
	});

	describe('getLootPriceUsdSaga', () => {
		const genSaga = getLootPriceUsdSaga();

		it('should wait for every GET_LOOT_PRICE_USD_REQUEST action and call getLootPriceUsd', () => {
			expect(genSaga.next().value).toEqual(
				takeEvery(GET_LOOT_PRICE_USD_REQUEST, getLootPriceUsd),
			);
		});

		it('should be done on next iteration', () => {
			expect(genSaga.next().done).toBeTruthy();
		});
	});
});
