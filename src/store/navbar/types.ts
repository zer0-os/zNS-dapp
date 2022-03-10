import { SET_NAVBAR_TITLE, SET_NAVBAR_SEARCHING_STATUS } from './actionTypes';

/**
 * Navbar state definition
 */
export type NavbarState = {
	title?: string;
	isSearching: boolean;
};

/**
 * Navbar Payloads definition
 */
export type SetNavbarTitlePayload = {
	title?: string;
};

export type SetNavbarSearchingStatusPayload = {
	isSearching: boolean;
};

/**
 * Navbar actions definition
 */
export type SetNavbarTitle = {
	type: typeof SET_NAVBAR_TITLE;
	payload: SetNavbarTitlePayload;
};
export type SetNavbarSearchingStatus = {
	type: typeof SET_NAVBAR_SEARCHING_STATUS;
	payload: SetNavbarSearchingStatusPayload;
};

/**
 * Union Navbar actions definition
 * Will add more actions here
 *
 * To be used in Reducer
 */
export type NavbarActions = SetNavbarTitle | SetNavbarSearchingStatus;
