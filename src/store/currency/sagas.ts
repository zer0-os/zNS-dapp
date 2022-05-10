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
import * as action from './actions';
import * as actionTpye from './actionTypes';

/**
 * Get Wild Price USD saga
 */
export function* getWildPriceUsd() {
	try {
		const price: number = yield call(wildTokenPrice);
		yield put(action.getWildPriceUsdSuccess(price));
	} catch (e) {
		yield put(action.getWildPriceUsdError('Error in getting wild price usd'));
	}
}

export function* getWildPriceUsdSaga() {
	yield takeEvery(actionTpye.GET_WILD_PRICE_USD_REQUEST, getWildPriceUsd);
}

/**
 * Get Wild Price 24hr Percentage Change USD saga
 */
export function* getWildPricePercentageChange() {
	try {
		const percentage: number = yield call(wildPricePercentageChange);
		yield put(action.getWildPricePercentageChangeSuccess(percentage));
	} catch (e) {
		yield put(
			action.getWildPricePercentageChangeError(
				'Error in getting wild price percentage change',
			),
		);
	}
}

export function* getWildPricePercentageChangeSaga() {
	yield takeEvery(
		actionTpye.GET_WILD_PRICE_PERCENTAGE_CHANGE_REQUEST,
		getWildPricePercentageChange,
	);
}

/**
 * Get Loot Price USD saga
 */
export function* getLootPriceUsd() {
	try {
		const price: number = yield call(lootTokenPrice);
		yield put(action.getLootPriceUsdSuccess(price));
	} catch (e) {
		yield put(action.getLootPriceUsdError('Error in getting loot price usd'));
	}
}

export function* getLootPriceUsdSaga() {
	yield takeEvery(actionTpye.GET_LOOT_PRICE_USD_REQUEST, getLootPriceUsd);
}

/**
 * Get Zero Price USD saga
 */
export function* getZeroPriceUsd() {
	try {
		const price: number = yield call(zeroTokenPrice);
		yield put(action.getZeroPriceUsdSuccess(price));
	} catch (e) {
		yield put(action.getZeroPriceUsdError('Error in getting Zero price usd'));
	}
}

export function* getZeroPriceUsdSaga() {
	yield takeEvery(actionTpye.GET_ZERO_PRICE_USD_REQUEST, getZeroPriceUsd);
}

/**
 * Get Zero Price 24hr Percentage Change USD saga
 */
export function* getZeroPricePercentageChange() {
	try {
		const percentage: number = yield call(zeroPricePercentageChange);
		yield put(action.getZeroPricePercentageChangeSuccess(percentage));
	} catch (e) {
		yield put(
			action.getZeroPricePercentageChangeError(
				'Error in getting Zero price percentage change',
			),
		);
	}
}

export function* getZeroPricePercentageChangeSaga() {
	yield takeEvery(
		actionTpye.GET_ZERO_PRICE_PERCENTAGE_CHANGE_REQUEST,
		getZeroPricePercentageChange,
	);
}
