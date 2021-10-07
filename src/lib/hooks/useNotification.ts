import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	addNotificationRequest,
	removeNotificationRequest,
} from 'store/notifications/actions';
import { getNotifications } from 'store/notifications/selectors';
import { randomUUID } from 'lib/Random';
import { DEFAULT_NOTIFICATION_DURATION } from 'constants/notifications';

const useNotification = () => {
	const notifications = useSelector(getNotifications);

	const dispatch = useDispatch();
	const addNotification = useCallback(
		(text, duration = DEFAULT_NOTIFICATION_DURATION) => {
			dispatch(
				addNotificationRequest({
					id: randomUUID(),
					text,
					duration,
				}),
			);
		},
		[dispatch],
	);

	const removeNotification = useCallback(
		(id) => {
			dispatch(
				removeNotificationRequest({
					id,
				}),
			);
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			notifications,
			addNotification,
			removeNotification,
		}),
		[notifications, addNotification, removeNotification],
	);
};

export default useNotification;
