import { SET_NAVBAR_TITLE } from './actionTypes';
import { SetNavbarTitlePayload, SetNavbarTitle } from './types';

/**
 *  SET_NAVBAR_TITLE actions
 */
export const setNavbarTitle = (
	payload: SetNavbarTitlePayload,
): SetNavbarTitle => ({
	type: SET_NAVBAR_TITLE,
	payload,
});
