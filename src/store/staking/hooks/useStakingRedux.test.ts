import { useSelector } from 'react-redux';
import {
	setStakingRequestingRequest as reduxSetStakingRequestingRequest,
	setStakingRequestedRequest as reduxSetStakingRequestedRequest,
	setStakingApprovingRequest as reduxSetStakingApprovingRequest,
	setStakingApprovedRequest as reduxSetStakingApprovedRequest,
	setStakingFulfillingRequest as reduxSetStakingFulfillingRequest,
	setStakingFulfilledRequest as reduxSetStakingFulfilledRequest,
} from 'store/staking/actions';
import {
	getStakingRequesting,
	getStakingRequested,
	getStakingApproving,
	getStakingApproved,
	getStakingFulfilling,
	getStakingFulfilled,
} from 'store/staking/selectors';
import { storeReady } from 'store/store.mockData';
import { renderHook } from 'lib/testUtils';
import {
	NFT_STATUS_CARD_1,
	NFT_STATUS_CARD_2,
	DOMAIN_REQUEST_AND_CONTENTS_1,
	DOMAIN_REQUEST_AND_CONTENTS_2,
} from '../staking.mockData';
import { useStakingRedux, UseStakingReduxReturn } from './useStakingRedux';

jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'),
	useSelector: jest.fn(),
}));

jest.mock('store/staking/actions', () => ({
	setStakingRequestingRequest: jest.fn(),
	setStakingRequestedRequest: jest.fn(),
	setStakingApprovingRequest: jest.fn(),
	setStakingApprovedRequest: jest.fn(),
	setStakingFulfillingRequest: jest.fn(),
	setStakingFulfilledRequest: jest.fn(),
}));

const mockReduxState = {
	requesting: getStakingRequesting(storeReady),
	requested: getStakingRequested(storeReady),
	approving: getStakingApproving(storeReady),
	approved: getStakingApproved(storeReady),
	fulfilling: getStakingFulfilling(storeReady),
	fulfilled: getStakingFulfilled(storeReady),
};

describe('useStakingRedux', () => {
	beforeEach(() => {
		const mockAction1 = {
			type: 'SET_STAKING_REQUESTING_REQUEST',
			payload: 'some data',
		};
		const mockAction2 = {
			type: 'SET_STAKING_REQUESTED_REQUEST',
			payload: 'some data',
		};
		const mockAction3 = {
			type: 'SET_STAKING_APPROVING_REQUEST',
			payload: 'some data',
		};
		const mockAction4 = {
			type: 'SET_STAKING_APPROVED_REQUEST',
			payload: 'some data',
		};
		const mockAction5 = {
			type: 'SET_STAKING_FULFILLING_REQUEST',
			payload: 'some data',
		};
		const mockAction6 = {
			type: 'SET_STAKING_FULFILLED_REQUEST',
			payload: 'some data',
		};

		(useSelector as jest.Mock).mockReturnValueOnce(mockReduxState);
		(reduxSetStakingRequestingRequest as jest.Mock).mockReturnValueOnce(
			mockAction1,
		);
		(reduxSetStakingRequestedRequest as jest.Mock).mockReturnValueOnce(
			mockAction2,
		);
		(reduxSetStakingApprovingRequest as jest.Mock).mockReturnValueOnce(
			mockAction3,
		);
		(reduxSetStakingApprovedRequest as jest.Mock).mockReturnValueOnce(
			mockAction4,
		);
		(reduxSetStakingFulfillingRequest as jest.Mock).mockReturnValueOnce(
			mockAction5,
		);
		(reduxSetStakingFulfilledRequest as jest.Mock).mockReturnValueOnce(
			mockAction6,
		);
	});

	describe('reduxState', () => {
		it('Should return correct redux state', async () => {
			const { reduxState } = renderHook(
				useStakingRedux,
			) as UseStakingReduxReturn;

			expect(reduxState).toEqual(mockReduxState);
		});
	});

	describe('reduxActions', () => {
		it('#setRequesting', () => {
			const { reduxActions } = renderHook(
				useStakingRedux,
			) as UseStakingReduxReturn;

			reduxActions.setRequesting(NFT_STATUS_CARD_1);

			expect(reduxSetStakingRequestingRequest).toHaveBeenCalledTimes(1);
			expect(reduxSetStakingRequestingRequest).toHaveBeenCalledWith(
				NFT_STATUS_CARD_1,
			);
		});

		it('#setRequested', () => {
			const { reduxActions } = renderHook(
				useStakingRedux,
			) as UseStakingReduxReturn;

			reduxActions.setRequested(NFT_STATUS_CARD_2);

			expect(reduxSetStakingRequestedRequest).toHaveBeenCalledTimes(1);
			expect(reduxSetStakingRequestedRequest).toHaveBeenCalledWith(
				NFT_STATUS_CARD_2,
			);
		});

		it('#setApproving', () => {
			const { reduxActions } = renderHook(
				useStakingRedux,
			) as UseStakingReduxReturn;

			reduxActions.setApproving(DOMAIN_REQUEST_AND_CONTENTS_1);

			expect(reduxSetStakingApprovingRequest).toHaveBeenCalledTimes(1);
			expect(reduxSetStakingApprovingRequest).toHaveBeenCalledWith(
				DOMAIN_REQUEST_AND_CONTENTS_1,
			);
		});

		it('#setApproved', () => {
			const { reduxActions } = renderHook(
				useStakingRedux,
			) as UseStakingReduxReturn;

			reduxActions.setApproved(DOMAIN_REQUEST_AND_CONTENTS_2);

			expect(reduxSetStakingApprovedRequest).toHaveBeenCalledTimes(1);
			expect(reduxSetStakingApprovedRequest).toHaveBeenCalledWith(
				DOMAIN_REQUEST_AND_CONTENTS_2,
			);
		});

		it('#setFulfilling', () => {
			const { reduxActions } = renderHook(
				useStakingRedux,
			) as UseStakingReduxReturn;

			reduxActions.setFulfilling(DOMAIN_REQUEST_AND_CONTENTS_1);

			expect(reduxSetStakingFulfillingRequest).toHaveBeenCalledTimes(1);
			expect(reduxSetStakingFulfillingRequest).toHaveBeenCalledWith(
				DOMAIN_REQUEST_AND_CONTENTS_1,
			);
		});

		it('#setFulfilled', () => {
			const { reduxActions } = renderHook(
				useStakingRedux,
			) as UseStakingReduxReturn;

			reduxActions.setFulfilled(DOMAIN_REQUEST_AND_CONTENTS_2);

			expect(reduxSetStakingFulfilledRequest).toHaveBeenCalledTimes(1);
			expect(reduxSetStakingFulfilledRequest).toHaveBeenCalledWith(
				DOMAIN_REQUEST_AND_CONTENTS_2,
			);
		});
	});
});
