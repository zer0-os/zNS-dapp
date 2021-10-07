import { createSelector } from 'reselect';
import { AppState } from 'store';

/**
 *
 * Notifications reducer
 */
const getNotificationsReducer = (state: AppState) => state.notifications;

/**
 *
 * Notifications selectors
 */
export const getNotifications = createSelector(
	getNotificationsReducer,
	({ notifications }) => notifications,
);
