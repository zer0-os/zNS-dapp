import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'store';
import {
	setStakingApprovedRequest as reduxSetStakingApprovedRequest,
	setStakingApprovingRequest as reduxSetStakingApprovingRequest,
	setStakingFulfilledRequest as reduxSetStakingFulfilledRequest,
	setStakingFulfillingRequest as reduxSetStakingFulfillingRequest,
	setStakingRequestedRequest as reduxSetStakingRequestedRequest,
	setStakingRequestingRequest as reduxSetStakingRequestingRequest,
} from 'store/staking/actions';
import {
	getStakingApproved,
	getStakingApproving,
	getStakingFulfilled,
	getStakingFulfilling,
	getStakingRequested,
	getStakingRequesting,
} from 'store/staking/selectors';
import { DomainRequestAndContents, NftStatusCard } from 'lib/types';
import { StakingState } from '../types';

export type UseStakingReduxReturn = {
	reduxState: StakingState;
	reduxActions: {
		setRequesting: (params: NftStatusCard) => void;
		setRequested: (params: NftStatusCard) => void;
		setApproving: (params: DomainRequestAndContents) => void;
		setApproved: (params: DomainRequestAndContents) => void;
		setFulfilling: (params: DomainRequestAndContents) => void;
		setFulfilled: (params: DomainRequestAndContents) => void;
	};
};

export const useStakingRedux = (): UseStakingReduxReturn => {
	const dispatch = useDispatch();

	const reduxState = useSelector((state: AppState) => ({
		requesting: getStakingRequesting(state),
		requested: getStakingRequested(state),
		approving: getStakingApproving(state),
		approved: getStakingApproved(state),
		fulfilling: getStakingFulfilling(state),
		fulfilled: getStakingFulfilled(state),
	}));

	const setRequesting = useCallback(
		(params: NftStatusCard) => {
			dispatch(reduxSetStakingRequestingRequest(params));
		},
		[dispatch],
	);

	const setRequested = useCallback(
		(params: NftStatusCard) => {
			dispatch(reduxSetStakingRequestedRequest(params));
		},
		[dispatch],
	);

	const setApproving = useCallback(
		(params: DomainRequestAndContents) => {
			dispatch(reduxSetStakingApprovingRequest(params));
		},
		[dispatch],
	);

	const setApproved = useCallback(
		(params: DomainRequestAndContents) => {
			dispatch(reduxSetStakingApprovedRequest(params));
		},
		[dispatch],
	);

	const setFulfilling = useCallback(
		(params: DomainRequestAndContents) => {
			dispatch(reduxSetStakingFulfillingRequest(params));
		},
		[dispatch],
	);

	const setFulfilled = useCallback(
		(params: DomainRequestAndContents) => {
			dispatch(reduxSetStakingFulfilledRequest(params));
		},
		[dispatch],
	);

	const reduxActions = useMemo(
		() => ({
			setRequesting,
			setRequested,
			setApproving,
			setApproved,
			setFulfilling,
			setFulfilled,
		}),
		[
			setRequesting,
			setRequested,
			setApproving,
			setApproved,
			setFulfilling,
			setFulfilled,
		],
	);

	return { reduxState, reduxActions };
};
