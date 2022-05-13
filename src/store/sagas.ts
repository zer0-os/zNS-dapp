import { all, fork } from '@redux-saga/core/effects';
import {
	addNotificationSaga,
	removeNotificationSaga,
} from './notifications/sagas';
import {
	getWildPriceUsdSaga,
	getLootPriceUsdSaga,
	getZeroPriceUsdSaga,
	getWildPricePercentageChangeSaga,
	getZeroPricePercentageChangeSaga,
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
