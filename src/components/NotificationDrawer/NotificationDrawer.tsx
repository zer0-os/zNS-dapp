//- React Imports
import React from 'react';

//- Library Imports
import useNotification from 'lib/hooks/useNotification';
import { Notification } from 'store/notifications/types';

//- Style Imports
import styles from './NotificationDrawer.module.scss';

export const TEST_ID = {
	CONTAINER: 'notification-drawer-container',
	NOTIFICATIONS: {
		CONTAINER: 'notification-drawer-notifications',
		NOTIFICATION: 'notification-drawer-notification',
	},
};

const NotificationDrawer = () => {
	const { notifications, removeNotification } = useNotification();
	const remove = (n: Notification) => {
		removeNotification(n.id);
	};

	return (
		<div
			className={`${
				styles.NotificationDrawer
			} blur border-primary background-primary ${
				!notifications.length ? styles.Hidden : ''
			}`}
			data-testid={TEST_ID.CONTAINER}
		>
			<ul data-testid={TEST_ID.NOTIFICATIONS.CONTAINER}>
				{notifications.map((n: Notification) => (
					<li
						key={n.id}
						onClick={() => remove(n)}
						data-testid={`${TEST_ID.NOTIFICATIONS.CONTAINER}-${n.id}`}
					>
						{n.text}
					</li>
				))}
			</ul>
		</div>
	);
};

export default NotificationDrawer;
