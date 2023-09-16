import { SET_NAVBAR_SEARCHING_STATUS, SET_NAVBAR_TITLE } from './actionTypes';
import {
	SetNavbarSearchingStatus,
	SetNavbarSearchingStatusPayload,
	SetNavbarTitle,
	SetNavbarTitlePayload,
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
