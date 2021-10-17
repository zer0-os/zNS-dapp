import { randomUUID } from 'lib/random';
import { renderHook } from 'lib/testUtils';
import {
	addNotificationRequest as reduxAddNotification,
	removeNotificationRequest as reduxRemoveNotification,
} from 'store/notifications/actions';
import { notificationsReady } from 'store/notifications/notifications.mockData';
import useNotification, { NotificationHook } from './useNotification';

jest.mock('store/notifications/actions', () => ({
	addNotificationRequest: jest.fn(),
	removeNotificationRequest: jest.fn(),
}));

jest.mock('lib/random', () => ({
	randomUUID: jest.fn(),
}));

describe('useNotification', () => {
	it('should return an expected notifications data', () => {
		const { notifications } = renderHook(() =>
			useNotification(),
		) as NotificationHook;

		expect(notifications).toEqual(notificationsReady.notifications);
	});

	it('should dispatch addNotification action', () => {
		const mockParams = {
			id: 'notification_id',
			text: 'notification_text',
			duration: 1000,
		};
		const mockAction = {
			type: 'addNotification',
			payload: 'some data',
		};

		(reduxAddNotification as jest.Mock).mockReturnValueOnce(mockAction);
		(randomUUID as jest.Mock).mockReturnValueOnce(mockParams.id);

		const { addNotification } = renderHook(() =>
			useNotification(),
		) as NotificationHook;

		addNotification(mockParams.text, mockParams.duration);

		expect(reduxAddNotification).toHaveBeenCalledTimes(1);
		expect(reduxAddNotification).toHaveBeenCalledWith(mockParams);
	});

	it('should dispatch removeNotification action', () => {
		const mockParams = {
			id: 'notification_id',
		};
		const mockAction = {
			type: 'removeNotification',
			payload: 'some data',
		};

		(reduxRemoveNotification as jest.Mock).mockReturnValueOnce(mockAction);

		const { removeNotification } = renderHook(() =>
			useNotification(),
		) as NotificationHook;

		removeNotification(mockParams.id);

		expect(reduxRemoveNotification).toHaveBeenCalledTimes(1);
		expect(reduxRemoveNotification).toHaveBeenCalledWith(mockParams);
	});
});
