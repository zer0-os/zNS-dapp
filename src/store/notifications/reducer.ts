import {
	ADD_NOTIFICATION_REQUEST,
	REMOVE_NOTIFICATION_REQUEST,
} from './actionTypes';
import {
	Notification,
	NotificationsState,
	NotificationsActions,
} from './types';

const initialState: NotificationsState = {
	notifications: [],
};

const reducer = (state = initialState, action: NotificationsActions) => {
	switch (action.type) {
		case ADD_NOTIFICATION_REQUEST:
			const { id, text, duration } = action.payload;
			const newNotification: Notification = {
				id: id as string,
				text,
				duration: duration as number,
			};
			return {
				...state,
				notifications: [...state.notifications, newNotification],
			};
		case REMOVE_NOTIFICATION_REQUEST:
			const { id: notificationId } = action.payload;
			return {
				...state,
				notifications: state.notifications.filter(
					(notification) => notification.id !== notificationId,
				),
			};
		default:
			return {
				...state,
			};
	}
};

export default reducer;
