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
import reducer, { INITIAL_STATE } from './reducer';
import {
	NFT_STATUS_CARD_1,
	NFT_STATUS_CARD_2,
	DOMAIN_REQUEST_AND_CONTENTS_1,
	DOMAIN_REQUEST_AND_CONTENTS_2,
} from './staking.mockData';

describe('staking.reducer', () => {
	it('should be able to set staking requesting request', () => {
		const mockRequestingPayload = NFT_STATUS_CARD_1;
		const setStakingRequestingRequest: SetStakingRequestingRequest = {
			type: SET_STAKING_REQUESTING_REQUEST,
			payload: mockRequestingPayload,
		};
		const expected = {
			...INITIAL_STATE,
			requesting: [mockRequestingPayload],
		};

		expect(reducer(INITIAL_STATE, setStakingRequestingRequest)).toEqual(
			expected,
		);
	});

	it('should be able to set staking requested request', () => {
		const mockRequestedPayload = NFT_STATUS_CARD_2;
		const setStakingRequestedRequest: SetStakingRequestedRequest = {
			type: SET_STAKING_REQUESTED_REQUEST,
			payload: mockRequestedPayload,
		};
		const expected = {
			...INITIAL_STATE,
			requesting: [],
			requested: [mockRequestedPayload],
		};

		expect(reducer(INITIAL_STATE, setStakingRequestedRequest)).toEqual(
			expected,
		);
	});

	it('should be able to set staking approving request', () => {
		const mockApprovingPayload = DOMAIN_REQUEST_AND_CONTENTS_1;
		const setStakingApprovingRequest: SetStakingApprovingRequest = {
			type: SET_STAKING_APPROVING_REQUEST,
			payload: mockApprovingPayload,
		};
		const expected = {
			...INITIAL_STATE,
			approving: [mockApprovingPayload],
		};

		expect(reducer(INITIAL_STATE, setStakingApprovingRequest)).toEqual(
			expected,
		);
	});

	it('should be able to set staking approved request', () => {
		const mockApprovedPayload = DOMAIN_REQUEST_AND_CONTENTS_2;
		const setStakingApprovedRequest: SetStakingApprovedRequest = {
			type: SET_STAKING_APPROVED_REQUEST,
			payload: mockApprovedPayload,
		};
		const expected = {
			...INITIAL_STATE,
			approving: [],
			approved: [mockApprovedPayload],
		};

		expect(reducer(INITIAL_STATE, setStakingApprovedRequest)).toEqual(expected);
	});

	it('should be able to set staking fulfilling request', () => {
		const mockFulfillingPayload = DOMAIN_REQUEST_AND_CONTENTS_1;
		const setStakingFulfillingRequest: SetStakingFulfillingRequest = {
			type: SET_STAKING_FULFILLING_REQUEST,
			payload: mockFulfillingPayload,
		};
		const expected = {
			...INITIAL_STATE,
			fulfilling: [mockFulfillingPayload],
		};

		expect(reducer(INITIAL_STATE, setStakingFulfillingRequest)).toEqual(
			expected,
		);
	});

	it('should be able to set staking fulfilled request', () => {
		const mockFulfilledPayload = DOMAIN_REQUEST_AND_CONTENTS_2;
		const setStakingFulfilledRequest: SetStakingFulfilledRequest = {
			type: SET_STAKING_FULFILLED_REQUEST,
			payload: mockFulfilledPayload,
		};
		const expected = {
			...INITIAL_STATE,
			fulfilling: [],
			fulfilled: [mockFulfilledPayload],
		};

		expect(reducer(INITIAL_STATE, setStakingFulfilledRequest)).toEqual(
			expected,
		);
	});
});
