import {
	SET_STAKING_REQUESTING_REQUEST,
	SET_STAKING_REQUESTED_REQUEST,
	SET_STAKING_APPROVING_REQUEST,
	SET_STAKING_APPROVED_REQUEST,
	SET_STAKING_FULFILLING_REQUEST,
	SET_STAKING_FULFILLED_REQUEST,
} from './actionTypes';
import {
	StackingRequestPayload,
	StackingApprovePayload,
	StackingFulfillPayload,
	SetStakingRequestingRequest,
	SetStakingRequestedRequest,
	SetStakingApprovingRequest,
	SetStakingApprovedRequest,
	SetStakingFulfillingRequest,
	SetStakingFulfilledRequest,
} from './types';

/**
 *  SET_STAKING_REQUESTING_REQUEST actions
 */
export const setStakingRequestingRequest = (
	payload: StackingRequestPayload,
): SetStakingRequestingRequest => ({
	type: SET_STAKING_REQUESTING_REQUEST,
	payload,
});

/**
 *  SET_STAKING_REQUESTED_REQUEST actions
 */
export const setStakingRequestedRequest = (
	payload: StackingRequestPayload,
): SetStakingRequestedRequest => ({
	type: SET_STAKING_REQUESTED_REQUEST,
	payload,
});

/**
 *  SET_STAKING_APPROVING_REQUEST actions
 */
export const setStakingApprovingRequest = (
	payload: StackingApprovePayload,
): SetStakingApprovingRequest => ({
	type: SET_STAKING_APPROVING_REQUEST,
	payload,
});

/**
 *  SET_STAKING_APPROVED_REQUEST actions
 */
export const setStakingApprovedRequest = (
	payload: StackingApprovePayload,
): SetStakingApprovedRequest => ({
	type: SET_STAKING_APPROVED_REQUEST,
	payload,
});

/**
 *  SET_STAKING_FULFILLING_REQUEST actions
 */
export const setStakingFulfillingRequest = (
	payload: StackingFulfillPayload,
): SetStakingFulfillingRequest => ({
	type: SET_STAKING_FULFILLING_REQUEST,
	payload,
});

/**
 *  SET_STAKING_FULFILLED_REQUEST actions
 */
export const setStakingFulfilledRequest = (
	payload: StackingFulfillPayload,
): SetStakingFulfilledRequest => ({
	type: SET_STAKING_FULFILLED_REQUEST,
	payload,
});
