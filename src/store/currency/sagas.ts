import {
	wildTokenPrice,
	lootTokenPrice,
	zeroTokenPrice,
} from 'lib/tokenPrices';
import {
	wildPricePercentageChange,
	zeroPricePercentageChange,
} from 'lib/tokenPricePercentageChanges';
import { call, put, takeEvery } from '@redux-saga/core/effects';
import {
	getWildPriceUsdSuccess,
	getWildPriceUsdError,
	getLootPriceUsdSuccess,
	getLootPriceUsdError,
	getZeroPriceUsdSuccess,
	getZeroPriceUsdError,
	getWildPricePercentageChangeSuccess,
	getWildPricePercentageChangeError,
	getZeroPricePercentageChangeSuccess,
	getZeroPricePercentageChangeError,
} from './actions';
import {
	GET_WILD_PRICE_USD_REQUEST,
	GET_LOOT_PRICE_USD_REQUEST,
	GET_ZERO_PRICE_USD_REQUEST,
	GET_WILD_PRICE_PERCENTAGE_CHANGE_REQUEST,
	GET_ZERO_PRICE_PERCENTAGE_CHANGE_REQUEST,
} from './actionTypes';

/**
 * Get Wild Price USD saga
 */
export function* getWildPriceUsd() {
	try {
		const price: number = yield call(wildTokenPrice);
		yield put(getWildPriceUsdSuccess(price));
	} catch (e) {
		yield put(getWildPriceUsdError('Error in getting wild price usd'));
	}

	// getWildPriceUsd();
}

export function* getWildPriceUsdSaga() {
	yield takeEvery(GET_WILD_PRICE_USD_REQUEST, getWildPriceUsd);
}

/**
 * Get Wild Price 24hr Percentage Change USD saga
 */
export function* getWildPricePercentageChange() {
	try {
		const percentage: number = yield call(wildPricePercentageChange);
		yield put(getWildPricePercentageChangeSuccess(percentage)); //
	} catch (e) {
		yield put(
			getWildPricePercentageChangeError(
				'Error in getting wild price percentage change',
			),
		);
	}
}

export function* getWildPricePercentageChangeSaga() {
	yield takeEvery(
		GET_WILD_PRICE_PERCENTAGE_CHANGE_REQUEST,
		getWildPricePercentageChange,
	); //
}

/**
 * Get Loot Price USD saga
 */
export function* getLootPriceUsd() {
	try {
		const price: number = yield call(lootTokenPrice);
		yield put(getLootPriceUsdSuccess(price));
	} catch (e) {
		yield put(getLootPriceUsdError('Error in getting loot price usd'));
	}
}

export function* getLootPriceUsdSaga() {
	yield takeEvery(GET_LOOT_PRICE_USD_REQUEST, getLootPriceUsd);
}

/**
 * Get Zero Price USD saga
 */
export function* getZeroPriceUsd() {
	try {
		const price: number = yield call(zeroTokenPrice);
		yield put(getZeroPriceUsdSuccess(price));
	} catch (e) {
		yield put(getZeroPriceUsdError('Error in getting Zero price usd'));
	}
}

export function* getZeroPriceUsdSaga() {
	yield takeEvery(GET_ZERO_PRICE_USD_REQUEST, getZeroPriceUsd);
}

/**
 * Get Zero Price 24hr Percentage Change USD saga
 */
export function* getZeroPricePercentageChange() {
	try {
		const percentage: number = yield call(zeroPricePercentageChange);
		yield put(getZeroPricePercentageChangeSuccess(percentage)); //
	} catch (e) {
		yield put(
			getZeroPricePercentageChangeError(
				'Error in getting Zero price percentage change',
			),
		);
	}
}

export function* getZeroPricePercentageChangeSaga() {
	yield takeEvery(
		GET_ZERO_PRICE_PERCENTAGE_CHANGE_REQUEST,
		getZeroPricePercentageChange,
	); //
}
