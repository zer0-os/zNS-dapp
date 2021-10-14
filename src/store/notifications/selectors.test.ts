import { AppState } from 'store';
import { REDUCER_NAME } from './reducer';
import { getNotifications } from './selectors';
import { notificationsReady } from './notifications.mockData';

describe('notifications.selectors', () => {
	it('should return notifications list from state', () => {
		const notifications = getNotifications({
			[REDUCER_NAME]: notificationsReady,
		} as AppState);
		expect(notifications).toEqual(notificationsReady.notifications);
	});
});
