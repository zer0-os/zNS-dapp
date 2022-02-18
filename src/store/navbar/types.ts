import { SET_NAVBAR_TITLE } from './actionTypes';

/**
 * Navbar state definition
 */
export type NavbarState = {
	title?: string;
};

/**
 * Navbar Payloads definition
 */
export type SetNavbarTitlePayload = {
	title?: string;
};

/**
 * Navbar actions definition
 */
export type SetNavbarTitle = {
	type: typeof SET_NAVBAR_TITLE;
	payload: SetNavbarTitlePayload;
};

/**
 * Union Navbar actions definition
 * Will add more actions here
 *
 * To be used in Reducer
 */
export type NavbarActions = SetNavbarTitle;
