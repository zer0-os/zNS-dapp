import {
	ADD_NOTIFICATION_REQUEST,
	REMOVE_NOTIFICATION_REQUEST,
} from './actionTypes';
import {
	Notification,
	AddNotificationRequest,
	RemoveNotificationRequest,
} from './types';
import reducer, { INITIAL_STATE } from './reducer';
import { notificationsReady } from './notifications.mockData';

const mockNotification: Notification = notificationsReady.notifications[0];

describe('notifications.reducer', () => {
	it('should be able to handle adding notification', () => {
		const addNotification: AddNotificationRequest = {
			type: ADD_NOTIFICATION_REQUEST,
			payload: mockNotification,
		};
		const expectedStateAfterAdd = {
			...INITIAL_STATE,
			notifications: [mockNotification],
		};

		expect(reducer(INITIAL_STATE, addNotification)).toEqual(
			expectedStateAfterAdd,
		);
	});

	it('should be able to handle removing notification', () => {
		const removeNotification: RemoveNotificationRequest = {
			type: REMOVE_NOTIFICATION_REQUEST,
			payload: { id: mockNotification.id },
		};
		const initialState = {
			...INITIAL_STATE,
			notifications: [mockNotification],
		};
		const expectedStateAfterRemove = {
			...INITIAL_STATE,
			notifications: [],
		};

		expect(reducer(initialState, removeNotification)).toEqual(
			expectedStateAfterRemove,
		);
	});
});
