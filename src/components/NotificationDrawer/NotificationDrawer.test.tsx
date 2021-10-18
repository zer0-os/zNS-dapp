import { cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithRedux } from 'lib/testUtils';
import { notificationsReady } from 'store/notifications/notifications.mockData';

import NotificationDrawer, { TEST_ID } from './NotificationDrawer';

jest.mock('store/notifications/actions', () => ({
	removeNotificationRequest: jest.fn(),
}));

const renderComponent = () => {
	return renderWithRedux(<NotificationDrawer />);
};

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

describe('NotificationDrawer component', () => {
	it('Renders NotificationDrawer containers', () => {
		const { getByTestId } = renderComponent();

		const container = getByTestId(TEST_ID.CONTAINER);
		const notifications = getByTestId(TEST_ID.NOTIFICATIONS.CONTAINER);
		expect(container).toBeInTheDocument();
		expect(notifications).toBeInTheDocument();
	});

	it('Renders all of notifications in redux store', () => {
		const { getByTestId } = renderComponent();

		const notifications = getByTestId(TEST_ID.NOTIFICATIONS.CONTAINER);

		notificationsReady.notifications.forEach((n) => {
			const notification = within(notifications).getByTestId(
				`${TEST_ID.NOTIFICATIONS.CONTAINER}-${n.id}`,
			);
			expect(notification).toBeInTheDocument();

			const notificationText = within(notification).getByText(n.text);
			expect(notificationText).toBeInTheDocument();
		});
	});
});
