import { SET_NAVBAR_TITLE, SET_NAVBAR_SEARCHING_STATUS } from './actionTypes';
import {
	SetNavbarTitlePayload,
	SetNavbarTitle,
	SetNavbarSearchingStatusPayload,
	SetNavbarSearchingStatus,
} from './types';

/**
 *  SET_NAVBAR_TITLE actions
 */
export const setNavbarTitle = (
	payload: SetNavbarTitlePayload,
): SetNavbarTitle => ({
	type: SET_NAVBAR_TITLE,
	payload,
});

/**
 *  SET_NAVBAR_SEARCHING_STATUS actions
 */
export const setNavbarSearchingStatus = (
	payload: SetNavbarSearchingStatusPayload,
): SetNavbarSearchingStatus => ({
	type: SET_NAVBAR_SEARCHING_STATUS,
	payload,
});
