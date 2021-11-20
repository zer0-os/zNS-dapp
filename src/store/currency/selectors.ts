import { createSelector } from 'reselect';
import { AppState } from 'store';
import { REDUCER_NAME } from './reducer';

/**
 *
 * Currency reducer
 */
const getCurrencyReducer = (state: AppState) => state[REDUCER_NAME];

/**
 *
 * Curreency selectors
 */
export const getCurrency = createSelector(
	getCurrencyReducer,
	(currency) => currency,
);
