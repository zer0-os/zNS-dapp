import { createSelector } from 'reselect';
import { AppState } from 'store';
import { REDUCER_NAME } from './reducer';

/**
 *
 * Staking reducer
 */
const getStakingReducer = (state: AppState) => state[REDUCER_NAME];

/**
 *
 * Staking selectors
 */
export const getStakingRequesting = createSelector(
	getStakingReducer,
	(staking) => staking.requesting,
);

export const getStakingRequested = createSelector(
	getStakingReducer,
	(staking) => staking.requested,
);

export const getStakingApproving = createSelector(
	getStakingReducer,
	(staking) => staking.approving,
);

export const getStakingApproved = createSelector(
	getStakingReducer,
	(staking) => staking.approved,
);

export const getStakingFulfilling = createSelector(
	getStakingReducer,
	(staking) => staking.fulfilling,
);

export const getStakingFulfilled = createSelector(
	getStakingReducer,
	(staking) => staking.fulfilled,
);
