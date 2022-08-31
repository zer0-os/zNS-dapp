import { AppState } from 'store';
import { REDUCER_NAME } from './reducer';
import {
	getStakingRequesting,
	getStakingRequested,
	getStakingApproving,
	getStakingApproved,
	getStakingFulfilling,
	getStakingFulfilled,
} from './selectors';
import { stakingReady } from './staking.mockData';

describe('staking.selectors', () => {
	it('should return requesting from state', () => {
		const requesting = getStakingRequesting({
			[REDUCER_NAME]: stakingReady,
		} as AppState);
		expect(requesting).toEqual(stakingReady.requesting);
	});

	it('should return requested from state', () => {
		const requested = getStakingRequested({
			[REDUCER_NAME]: stakingReady,
		} as AppState);
		expect(requested).toEqual(stakingReady.requested);
	});

	it('should return approving from state', () => {
		const approving = getStakingApproving({
			[REDUCER_NAME]: stakingReady,
		} as AppState);
		expect(approving).toEqual(stakingReady.approving);
	});

	it('should return approved from state', () => {
		const approved = getStakingApproved({
			[REDUCER_NAME]: stakingReady,
		} as AppState);
		expect(approved).toEqual(stakingReady.approved);
	});

	it('should return fulfilling from state', () => {
		const fulfilling = getStakingFulfilling({
			[REDUCER_NAME]: stakingReady,
		} as AppState);
		expect(fulfilling).toEqual(stakingReady.fulfilling);
	});

	it('should return fulfilled from state', () => {
		const fulfilled = getStakingFulfilled({
			[REDUCER_NAME]: stakingReady,
		} as AppState);
		expect(fulfilled).toEqual(stakingReady.fulfilled);
	});
});
