import {
	ADD_NOTIFICATION_REQUEST,
	ADD_NOTIFICATION_SUCCESS,
	ADD_NOTIFICATION_ERROR,
	REMOVE_NOTIFICATION_REQUEST,
	REMOVE_NOTIFICATION_SUCCESS,
	REMOVE_NOTIFICATION_ERROR,
} from './actionTypes';
import {
	Notification,
	AddNotificationRequest,
	AddNotificationSuccess,
	AddNotificationError,
	RemoveNotificationRequest,
	RemoveNotificationSuccess,
	RemoveNotificationError,
} from './types';
import {
	addNotificationRequest,
	addNotificationSuccess,
	addNotificationError,
	removeNotificationRequest,
	removeNotificationSuccess,
	removeNotificationError,
} from './actions';
import { notificationsReady } from './notifications.mockData';

const mockNotification: Notification = notificationsReady.notifications[0];

describe('notifications.actions', () => {
	it('addNotificationRequest', () => {
		const expectedAction: AddNotificationRequest = {
			type: ADD_NOTIFICATION_REQUEST,
			payload: mockNotification,
		};

		expect(addNotificationRequest(mockNotification)).toEqual(expectedAction);
	});

	it('addNotificationSuccess', () => {
		const expectedAction: AddNotificationSuccess = {
			type: ADD_NOTIFICATION_SUCCESS,
		};

		expect(addNotificationSuccess()).toEqual(expectedAction);
	});

	it('addNotificationError', () => {
		const expectedAction: AddNotificationError = {
			type: ADD_NOTIFICATION_ERROR,
		};

		expect(addNotificationError()).toEqual(expectedAction);
	});
	it('removeNotificationRequest', () => {
		const expectedAction: RemoveNotificationRequest = {
			type: REMOVE_NOTIFICATION_REQUEST,
			payload: { id: mockNotification.id },
		};

		expect(removeNotificationRequest({ id: mockNotification.id })).toEqual(
			expectedAction,
		);
	});

	it('removeNotificationSuccess', () => {
		const expectedAction: RemoveNotificationSuccess = {
			type: REMOVE_NOTIFICATION_SUCCESS,
		};

		expect(removeNotificationSuccess()).toEqual(expectedAction);
	});

	it('removeNotificationError', () => {
		const expectedAction: RemoveNotificationError = {
			type: REMOVE_NOTIFICATION_ERROR,
		};

		expect(removeNotificationError()).toEqual(expectedAction);
	});
});
