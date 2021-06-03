//- React Imports
import React, { useState, useEffect } from 'react';

//- Library Imports
import useNotification from 'lib/hooks/useNotification';

//- Style Imports
import styles from './NotificationDrawer.module.css';

const NotificationDrawer = () => {
	// TODO: Need to animate notifications coming in and out
	// TODO: Change to useMemo
	// TODO: Change notifications over to a portal?

	const [visibleNotifications, setVisibleNotifications] = useState<any>([]);

	const { notifications, removeNotification } = useNotification();

	// TODO: Should move Notification type into a module so we don't have to use 'any'
	const remove = (o: any) => {
		removeNotification(o);
	};

	useEffect(() => {
		setVisibleNotifications([...visibleNotifications, notifications]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notifications]);

	return (
		<div
			className={`${styles.NotificationDrawer} blur  border-primary ${
				!notifications.length ? styles.Hidden : ''
			}`}
		>
			<ul>
				{notifications.map((o: any) => (
					<li key={o.text + Math.random()} onClick={() => remove(o)}>
						{o.text}
					</li>
				))}
			</ul>
		</div>
	);
};

export default NotificationDrawer;
