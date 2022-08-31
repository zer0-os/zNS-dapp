import {
	SET_STAKING_REQUESTING_REQUEST,
	SET_STAKING_REQUESTED_REQUEST,
	SET_STAKING_APPROVING_REQUEST,
	SET_STAKING_APPROVED_REQUEST,
	SET_STAKING_FULFILLING_REQUEST,
	SET_STAKING_FULFILLED_REQUEST,
} from './actionTypes';
import {
	SetStakingRequestingRequest,
	SetStakingRequestedRequest,
	SetStakingApprovingRequest,
	SetStakingApprovedRequest,
	SetStakingFulfillingRequest,
	SetStakingFulfilledRequest,
} from './types';
import {
	setStakingRequestingRequest,
	setStakingRequestedRequest,
	setStakingApprovingRequest,
	setStakingApprovedRequest,
	setStakingFulfillingRequest,
	setStakingFulfilledRequest,
} from './actions';
import {
	NFT_STATUS_CARD_1,
	NFT_STATUS_CARD_2,
	DOMAIN_REQUEST_AND_CONTENTS_1,
	DOMAIN_REQUEST_AND_CONTENTS_2,
} from './staking.mockData';

describe('staking.actions', () => {
	it('setStakingRequestingRequest', () => {
		const mockRequestingPayload = NFT_STATUS_CARD_1;
		const expectedAction: SetStakingRequestingRequest = {
			type: SET_STAKING_REQUESTING_REQUEST,
			payload: mockRequestingPayload,
		};

		expect(setStakingRequestingRequest(mockRequestingPayload)).toEqual(
			expectedAction,
		);
	});

	it('setStakingRequestedRequest', () => {
		const mockRequestedPayload = NFT_STATUS_CARD_2;
		const expectedAction: SetStakingRequestedRequest = {
			type: SET_STAKING_REQUESTED_REQUEST,
			payload: mockRequestedPayload,
		};

		expect(setStakingRequestedRequest(mockRequestedPayload)).toEqual(
			expectedAction,
		);
	});

	it('setStakingApprovingRequest', () => {
		const mockApprovingPayload = DOMAIN_REQUEST_AND_CONTENTS_1;
		const expectedAction: SetStakingApprovingRequest = {
			type: SET_STAKING_APPROVING_REQUEST,
			payload: mockApprovingPayload,
		};

		expect(setStakingApprovingRequest(mockApprovingPayload)).toEqual(
			expectedAction,
		);
	});

	it('setStakingApprovedRequest', () => {
		const mockApprovedPayload = DOMAIN_REQUEST_AND_CONTENTS_2;
		const expectedAction: SetStakingApprovedRequest = {
			type: SET_STAKING_APPROVED_REQUEST,
			payload: mockApprovedPayload,
		};

		expect(setStakingApprovedRequest(mockApprovedPayload)).toEqual(
			expectedAction,
		);
	});

	it('setStakingFulfillingRequest', () => {
		const mockFulfillingPayload = DOMAIN_REQUEST_AND_CONTENTS_1;
		const expectedAction: SetStakingFulfillingRequest = {
			type: SET_STAKING_FULFILLING_REQUEST,
			payload: mockFulfillingPayload,
		};

		expect(setStakingFulfillingRequest(mockFulfillingPayload)).toEqual(
			expectedAction,
		);
	});

	it('setStakingFulfilledRequest', () => {
		const mockFulfilledPayload = DOMAIN_REQUEST_AND_CONTENTS_2;
		const expectedAction: SetStakingFulfilledRequest = {
			type: SET_STAKING_FULFILLED_REQUEST,
			payload: mockFulfilledPayload,
		};

		expect(setStakingFulfilledRequest(mockFulfilledPayload)).toEqual(
			expectedAction,
		);
	});
});
