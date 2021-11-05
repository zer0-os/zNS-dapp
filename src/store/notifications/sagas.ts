import { put, takeEvery } from '@redux-saga/core/effects';
import {
	addNotificationSuccess,
	addNotificationError,
	removeNotificationRequest,
	removeNotificationSuccess,
	removeNotificationError,
} from './actions';
import {
	ADD_NOTIFICATION_REQUEST,
	REMOVE_NOTIFICATION_REQUEST,
} from './actionTypes';
import { AddNotificationRequest, RemoveNotificationRequest } from './types';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Add Notification saga
 */
export function* addNotification(action: AddNotificationRequest) {
	try {
		yield put(addNotificationSuccess());
		const { id, duration } = action.payload;

		// Remove a notification after the duration
		yield delay(duration);
		yield put(removeNotificationRequest({ id }));
	} catch (e: any) {
		yield put(addNotificationError());
	}
}

export function* addNotificationSaga() {
	yield takeEvery(ADD_NOTIFICATION_REQUEST, addNotification);
}

/**
 * Remove Notification saga
 */
export function* removeNotification(action: RemoveNotificationRequest) {
	try {
		yield put(removeNotificationSuccess());
	} catch (e: any) {
		yield put(removeNotificationError());
	}
}

export function* removeNotificationSaga() {
	yield takeEvery(REMOVE_NOTIFICATION_REQUEST, removeNotification);
}
