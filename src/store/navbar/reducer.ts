import { SET_NAVBAR_SEARCHING_STATUS, SET_NAVBAR_TITLE } from './actionTypes';
import { NavbarActions, NavbarState } from './types';

export const REDUCER_NAME = 'navbar';

export const INITIAL_STATE: NavbarState = {
	title: undefined,
	isSearching: false,
};

const reducer = (state = INITIAL_STATE, action: NavbarActions) => {
	switch (action.type) {
		case SET_NAVBAR_TITLE:
			return {
				...state,
				title: action.payload.title,
			};
		case SET_NAVBAR_SEARCHING_STATUS:
			return {
				...state,
				isSearching: action.payload.isSearching,
			};
		default:
			return {
				...state,
			};
	}
};

export default reducer;
