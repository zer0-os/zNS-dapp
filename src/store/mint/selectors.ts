import { createSelector } from 'reselect';
import { AppState } from 'store';
import { REDUCER_NAME } from './reducer';

/**
 *
 * Mint reducer
 */
const getMintReducer = (state: AppState) => state[REDUCER_NAME];

/**
 *
 * Mint selectors
 */
export const getMinting = createSelector(
	getMintReducer,
	(mint) => mint.minting,
);
export const getMinted = createSelector(getMintReducer, (mint) => mint.minted);
