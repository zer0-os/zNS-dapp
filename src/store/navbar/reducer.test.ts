import { SET_NAVBAR_SEARCHING_STATUS, SET_NAVBAR_TITLE } from './actionTypes';
import { SetNavbarSearchingStatus, SetNavbarTitle } from './types';
import reducer, { INITIAL_STATE } from './reducer';
import { NAVBAR_IS_SEARCHING, NAVBAR_TITLE } from './navbar.mockData';

describe('navbar.reducer', () => {
	it('should be able to set navbar title', () => {
		const mockSetNavbarTitlePayload = {
			title: NAVBAR_TITLE,
		};
		const setNavbarTitle: SetNavbarTitle = {
			type: SET_NAVBAR_TITLE,
			payload: mockSetNavbarTitlePayload,
		};
		const expected = {
			...INITIAL_STATE,
			title: NAVBAR_TITLE,
		};

		expect(reducer(INITIAL_STATE, setNavbarTitle)).toEqual(expected);
	});

	it('should be able to set navbar searching status', () => {
		const mockSetNavbarSearchingStatusPayload = {
			isSearching: NAVBAR_IS_SEARCHING,
		};
		const setNavbarSearchingStatus: SetNavbarSearchingStatus = {
			type: SET_NAVBAR_SEARCHING_STATUS,
			payload: mockSetNavbarSearchingStatusPayload,
		};
		const expected = {
			...INITIAL_STATE,
			isSearching: NAVBAR_IS_SEARCHING,
		};

		expect(reducer(INITIAL_STATE, setNavbarSearchingStatus)).toEqual(expected);
	});
});
