import { DomainRequestAndContents, NftStatusCard } from 'lib/types';
import {
	SET_STAKING_REQUESTING_REQUEST,
	SET_STAKING_REQUESTED_REQUEST,
	SET_STAKING_APPROVING_REQUEST,
	SET_STAKING_APPROVED_REQUEST,
	SET_STAKING_FULFILLING_REQUEST,
	SET_STAKING_FULFILLED_REQUEST,
} from './actionTypes';

/**
 * Staking state definition
 */
export type StakingState = {
	requesting: NftStatusCard[];
	requested: NftStatusCard[];
	approving: DomainRequestAndContents[];
	approved: DomainRequestAndContents[];
	fulfilling: DomainRequestAndContents[];
	fulfilled: DomainRequestAndContents[];
};

/**
 * Stacking Payloads definition
 */
export type StackingRequestPayload = NftStatusCard;

export type StackingApprovePayload = DomainRequestAndContents;

export type StackingFulfillPayload = DomainRequestAndContents;

/**
 * Staking actions definition
 */
export type SetStakingRequestingRequest = {
	type: typeof SET_STAKING_REQUESTING_REQUEST;
	payload: StackingRequestPayload;
};

export type SetStakingRequestedRequest = {
	type: typeof SET_STAKING_REQUESTED_REQUEST;
	payload: StackingRequestPayload;
};

export type SetStakingApprovingRequest = {
	type: typeof SET_STAKING_APPROVING_REQUEST;
	payload: StackingApprovePayload;
};

export type SetStakingApprovedRequest = {
	type: typeof SET_STAKING_APPROVED_REQUEST;
	payload: StackingApprovePayload;
};

export type SetStakingFulfillingRequest = {
	type: typeof SET_STAKING_FULFILLING_REQUEST;
	payload: StackingFulfillPayload;
};

export type SetStakingFulfilledRequest = {
	type: typeof SET_STAKING_FULFILLED_REQUEST;
	payload: StackingFulfillPayload;
};

/**
 * Union Staking actions definition
 *
 * To be used in Reducer
 */
export type StackingActions =
	| SetStakingRequestingRequest
	| SetStakingRequestedRequest
	| SetStakingApprovingRequest
	| SetStakingApprovedRequest
	| SetStakingFulfillingRequest
	| SetStakingFulfilledRequest;
