import { SET_NAVBAR_TITLE } from './actionTypes';
import { NavbarState, NavbarActions } from './types';

export const REDUCER_NAME = 'navbar';

export const INITIAL_STATE: NavbarState = {
	title: undefined,
};

const reducer = (state = INITIAL_STATE, action: NavbarActions) => {
	switch (action.type) {
		case SET_NAVBAR_TITLE:
			return {
				...state,
				title: action.payload.title,
			};
		default:
			return {
				...state,
			};
	}
};

export default reducer;
