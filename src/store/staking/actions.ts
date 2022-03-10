import {
	SET_STAKING_REQUESTING_REQUEST,
	SET_STAKING_REQUESTED_REQUEST,
	SET_STAKING_APPROVING_REQUEST,
	SET_STAKING_APPROVED_REQUEST,
	SET_STAKING_FULFILLING_REQUEST,
	SET_STAKING_FULFILLED_REQUEST,
} from './actionTypes';
import {
	StakingRequestPayload,
	StakingApprovePayload,
	StakingFulfillPayload,
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
	payload: StakingRequestPayload,
): SetStakingRequestingRequest => ({
	type: SET_STAKING_REQUESTING_REQUEST,
	payload,
});

/**
 *  SET_STAKING_REQUESTED_REQUEST actions
 */
export const setStakingRequestedRequest = (
	payload: StakingRequestPayload,
): SetStakingRequestedRequest => ({
	type: SET_STAKING_REQUESTED_REQUEST,
	payload,
});

/**
 *  SET_STAKING_APPROVING_REQUEST actions
 */
export const setStakingApprovingRequest = (
	payload: StakingApprovePayload,
): SetStakingApprovingRequest => ({
	type: SET_STAKING_APPROVING_REQUEST,
	payload,
});

/**
 *  SET_STAKING_APPROVED_REQUEST actions
 */
export const setStakingApprovedRequest = (
	payload: StakingApprovePayload,
): SetStakingApprovedRequest => ({
	type: SET_STAKING_APPROVED_REQUEST,
	payload,
});

/**
 *  SET_STAKING_FULFILLING_REQUEST actions
 */
export const setStakingFulfillingRequest = (
	payload: StakingFulfillPayload,
): SetStakingFulfillingRequest => ({
	type: SET_STAKING_FULFILLING_REQUEST,
	payload,
});

/**
 *  SET_STAKING_FULFILLED_REQUEST actions
 */
export const setStakingFulfilledRequest = (
	payload: StakingFulfillPayload,
): SetStakingFulfilledRequest => ({
	type: SET_STAKING_FULFILLED_REQUEST,
	payload,
});
