import {
	ADD_NOTIFICATION_ERROR,
	ADD_NOTIFICATION_REQUEST,
	ADD_NOTIFICATION_SUCCESS,
	REMOVE_NOTIFICATION_ERROR,
	REMOVE_NOTIFICATION_REQUEST,
	REMOVE_NOTIFICATION_SUCCESS,
} from './actionTypes';
import {
	AddNotificationError,
	AddNotificationRequest,
	AddNotificationRequestPayload,
	AddNotificationSuccess,
	RemoveNotificationError,
	RemoveNotificationRequest,
	RemoveNotificationRequestPayload,
	RemoveNotificationSuccess,
} from './types';

/**
 *  ADD_NOTIFICATION actions
 */
export const addNotificationRequest = (
	payload: AddNotificationRequestPayload,
): AddNotificationRequest => ({
	type: ADD_NOTIFICATION_REQUEST,
	payload,
});

export const addNotificationSuccess = (): AddNotificationSuccess => ({
	type: ADD_NOTIFICATION_SUCCESS,
});

export const addNotificationError = (): AddNotificationError => ({
	type: ADD_NOTIFICATION_ERROR,
});

/**
 *  REMOVE_NOTIFICATION actions
 */
export const removeNotificationRequest = (
	payload: RemoveNotificationRequestPayload,
): RemoveNotificationRequest => ({
	type: REMOVE_NOTIFICATION_REQUEST,
	payload,
});

export const removeNotificationSuccess = (): RemoveNotificationSuccess => ({
	type: REMOVE_NOTIFICATION_SUCCESS,
});

export const removeNotificationError = (): RemoveNotificationError => ({
	type: REMOVE_NOTIFICATION_ERROR,
});
