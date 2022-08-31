import { DomainRequestAndContents, NftStatusCard } from 'lib/types';
import {
	SET_STAKING_REQUESTING_REQUEST,
	SET_STAKING_REQUESTED_REQUEST,
	SET_STAKING_APPROVING_REQUEST,
	SET_STAKING_APPROVED_REQUEST,
	SET_STAKING_FULFILLING_REQUEST,
	SET_STAKING_FULFILLED_REQUEST,
} from './actionTypes';
import { StakingState, StakingActions } from './types';

export const REDUCER_NAME = 'staking';

export const INITIAL_STATE: StakingState = {
	requesting: [],
	requested: [],
	approving: [],
	approved: [],
	fulfilling: [],
	fulfilled: [],
};

const reducer = (state = INITIAL_STATE, action: StakingActions) => {
	switch (action.type) {
		case SET_STAKING_REQUESTING_REQUEST:
			return {
				...state,
				requesting: [...state.requesting, action.payload],
			};

		case SET_STAKING_REQUESTED_REQUEST:
			return {
				...state,
				requesting: [
					...state.requesting.filter(
						(n: NftStatusCard) => n !== action.payload,
					),
				],
				requested: [...state.requested, action.payload],
			};

		case SET_STAKING_APPROVING_REQUEST:
			return {
				...state,
				approving: [...state.approving, action.payload],
			};

		case SET_STAKING_APPROVED_REQUEST:
			return {
				...state,
				approving: [
					...state.approving.filter(
						(d: DomainRequestAndContents) => d !== action.payload,
					),
				],
				approved: [...state.approved, action.payload],
			};

		case SET_STAKING_FULFILLING_REQUEST:
			return {
				...state,
				fulfilling: [...state.fulfilling, action.payload],
			};

		case SET_STAKING_FULFILLED_REQUEST:
			return {
				...state,
				fulfilling: [
					...state.fulfilling.filter(
						(d: DomainRequestAndContents) => d !== action.payload,
					),
				],
				fulfilled: [...state.fulfilled, action.payload],
			};

		default:
			return {
				...state,
			};
	}
};

export default reducer;
