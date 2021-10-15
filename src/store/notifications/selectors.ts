import { createSelector } from 'reselect';
import { AppState } from 'store';
import { REDUCER_NAME } from './reducer';

/**
 *
 * Notifications reducer
 */
const getNotificationsReducer = (state: AppState) => state[REDUCER_NAME];

/**
 *
 * Notifications selectors
 */
export const getNotifications = createSelector(
	getNotificationsReducer,
	({ notifications }) => notifications,
);
