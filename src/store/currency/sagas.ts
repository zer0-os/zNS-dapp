import { wildTokenPrice, lootTokenPrice } from 'lib/tokenPrices';
import { call, put, takeEvery } from '@redux-saga/core/effects';
import {
	getWildPriceUsdSuccess,
	getWildPriceUsdError,
	getLootPriceUsdSuccess,
	getLootPriceUsdError,
} from './actions';
import {
	GET_WILD_PRICE_USD_REQUEST,
	GET_LOOT_PRICE_USD_REQUEST,
} from './actionTypes';

/**
 * Get Wild Price USD saga
 */
export function* getWildPriceUsd() {
	try {
		const price: number = yield call(wildTokenPrice);
		yield put(getWildPriceUsdSuccess(price));
	} catch (e: any) {
		yield put(getWildPriceUsdError('Error in getting wild price usd'));
	}

	// getWildPriceUsd();
}

export function* getWildPriceUsdSaga() {
	yield takeEvery(GET_WILD_PRICE_USD_REQUEST, getWildPriceUsd);
}

/**
 * Get Loot Price USD saga
 */
export function* getLootPriceUsd() {
	try {
		const price: number = yield call(lootTokenPrice);
		yield put(getLootPriceUsdSuccess(price));
	} catch (e: any) {
		yield put(getLootPriceUsdError('Error in getting loot price usd'));
	}
}

export function* getLootPriceUsdSaga() {
	yield takeEvery(GET_LOOT_PRICE_USD_REQUEST, getLootPriceUsd);
}
