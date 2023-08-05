import { all, fork } from '@redux-saga/core/effects';
import {
	addNotificationSaga,
	removeNotificationSaga,
} from './notifications/sagas';
import {
	getLootPriceUsdSaga,
	getWildPricePercentageChangeSaga,
	getWildPriceUsdSaga,
	getZeroPricePercentageChangeSaga,
	getZeroPriceUsdSaga,
} from './currency/sagas';

/**
 * Main saga
 */
export function* rootSaga() {
	yield all([
		fork(addNotificationSaga),
		fork(removeNotificationSaga),
		fork(getWildPriceUsdSaga),
		fork(getLootPriceUsdSaga),
		fork(getZeroPriceUsdSaga),
		fork(getWildPricePercentageChangeSaga),
		fork(getZeroPricePercentageChangeSaga),
		/**
		 * Other sagas will be added here
		 */
	]);
}
