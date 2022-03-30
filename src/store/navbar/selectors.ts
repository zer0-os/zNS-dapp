import { createSelector } from 'reselect';
import { AppState } from 'store';
import { REDUCER_NAME } from './reducer';

/**
 *
 * Navbar reducer
 */
const getNavbarReducer = (state: AppState) => state[REDUCER_NAME];

/**
 *
 * Navbar selectors
 */
export const getNavbarTitle = createSelector(
	getNavbarReducer,
	(navbar) => navbar.title,
);

export const getNavbarSearchingStatus = createSelector(
	getNavbarReducer,
	(navbar) => navbar.isSearching,
);
