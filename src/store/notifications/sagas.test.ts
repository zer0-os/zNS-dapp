import { takeEvery } from '@redux-saga/core/effects';
import {
	ADD_NOTIFICATION_REQUEST,
	REMOVE_NOTIFICATION_REQUEST,
} from './actionTypes';
import {
	addNotification,
	addNotificationSaga,
	removeNotification,
	removeNotificationSaga,
} from './sagas';

describe('notifications.sagas', () => {
	describe('addNotificationSaga', () => {
		const genSaga = addNotificationSaga();

		it('should wait for every ADD_NOTIFICATION_REQUEST action and call addNotification', () => {
			expect(genSaga.next().value).toEqual(
				takeEvery(ADD_NOTIFICATION_REQUEST, addNotification),
			);
		});

		it('should be done on next iteration', () => {
			expect(genSaga.next().done).toBeTruthy();
		});
	});

	describe('removeNotificationSaga', () => {
		const genSaga = removeNotificationSaga();

		it('should wait for every REMOVE_NOTIFICATION_REQUEST action and call removeNotification', () => {
			expect(genSaga.next().value).toEqual(
				takeEvery(REMOVE_NOTIFICATION_REQUEST, removeNotification),
			);
		});

		it('should be done on next iteration', () => {
			expect(genSaga.next().done).toBeTruthy();
		});
	});
});
