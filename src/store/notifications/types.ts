import {
	ADD_NOTIFICATION_REQUEST,
	ADD_NOTIFICATION_SUCCESS,
	ADD_NOTIFICATION_ERROR,
	REMOVE_NOTIFICATION_REQUEST,
	REMOVE_NOTIFICATION_SUCCESS,
	REMOVE_NOTIFICATION_ERROR,
} from './actionTypes';

/**
 * Notification definition
 */
export type Notification = {
	id: string;
	text: string;
	duration: number;
};

/**
 * Notifications state definition
 */
export type NotificationsState = {
	notifications: Notification[];
};

/**
 * Notifications Payloads definition
 */
export type AddNotificationRequestPayload = Notification;
export type RemoveNotificationRequestPayload = {
	id: string;
};

/**
 * Notifications actions definition
 */
export type AddNotificationRequest = {
	type: typeof ADD_NOTIFICATION_REQUEST;
	payload: AddNotificationRequestPayload;
};
export type AddNotificationSuccess = {
	type: typeof ADD_NOTIFICATION_SUCCESS;
};
export type AddNotificationError = {
	type: typeof ADD_NOTIFICATION_ERROR;
};

export type RemoveNotificationRequest = {
	type: typeof REMOVE_NOTIFICATION_REQUEST;
	payload: RemoveNotificationRequestPayload;
};
export type RemoveNotificationSuccess = {
	type: typeof REMOVE_NOTIFICATION_SUCCESS;
};
export type RemoveNotificationError = {
	type: typeof REMOVE_NOTIFICATION_ERROR;
};

/**
 * Union Notifications actions definition
 *
 * To be used in Reducer
 */
export type NotificationsActions =
	| AddNotificationRequest
	| AddNotificationSuccess
	| AddNotificationError
	| RemoveNotificationRequest
	| RemoveNotificationSuccess
	| RemoveNotificationError;
