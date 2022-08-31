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
 * Staking Payloads definition
 */
export type StakingRequestPayload = NftStatusCard;

export type StakingApprovePayload = DomainRequestAndContents;

export type StakingFulfillPayload = DomainRequestAndContents;

/**
 * Staking actions definition
 */
export type SetStakingRequestingRequest = {
	type: typeof SET_STAKING_REQUESTING_REQUEST;
	payload: StakingRequestPayload;
};

export type SetStakingRequestedRequest = {
	type: typeof SET_STAKING_REQUESTED_REQUEST;
	payload: StakingRequestPayload;
};

export type SetStakingApprovingRequest = {
	type: typeof SET_STAKING_APPROVING_REQUEST;
	payload: StakingApprovePayload;
};

export type SetStakingApprovedRequest = {
	type: typeof SET_STAKING_APPROVED_REQUEST;
	payload: StakingApprovePayload;
};

export type SetStakingFulfillingRequest = {
	type: typeof SET_STAKING_FULFILLING_REQUEST;
	payload: StakingFulfillPayload;
};

export type SetStakingFulfilledRequest = {
	type: typeof SET_STAKING_FULFILLED_REQUEST;
	payload: StakingFulfillPayload;
};

/**
 * Union Staking actions definition
 *
 * To be used in Reducer
 */
export type StakingActions =
	| SetStakingRequestingRequest
	| SetStakingRequestedRequest
	| SetStakingApprovingRequest
	| SetStakingApprovedRequest
	| SetStakingFulfillingRequest
	| SetStakingFulfilledRequest;
