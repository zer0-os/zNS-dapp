import { all, fork } from '@redux-saga/core/effects';
import {
	addNotificationSaga,
	removeNotificationSaga,
} from './notifications/sagas';

/**
 * Main saga
 */
export function* rootSaga() {
	yield all([
		fork(addNotificationSaga),
		fork(removeNotificationSaga),
		/**
		 * Other sagas will be added here
		 */
	]);
}
