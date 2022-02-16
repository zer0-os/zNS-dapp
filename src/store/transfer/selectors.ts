import { createSelector } from 'reselect';
import { AppState } from 'store';
import { REDUCER_NAME } from './reducer';

/**
 *
 * Transfer reducer
 */
const getTransferReducer = (state: AppState) => state[REDUCER_NAME];

/**
 *
 * Transfer selectors
 */
export const getTransferring = createSelector(
	getTransferReducer,
	(transfer) => transfer.transferring,
);
export const getTransferred = createSelector(
	getTransferReducer,
	(transfer) => transfer.transferred,
);
