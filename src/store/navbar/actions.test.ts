import { SET_NAVBAR_SEARCHING_STATUS, SET_NAVBAR_TITLE } from './actionTypes';
import { SetNavbarSearchingStatus, SetNavbarTitle } from './types';
import { setNavbarSearchingStatus, setNavbarTitle } from './actions';
import { NAVBAR_IS_SEARCHING, NAVBAR_TITLE } from './navbar.mockData';

describe('navbar.actions', () => {
	it('setNavbarTitle', () => {
		const mockSetNavbarTitlePayload = {
			title: NAVBAR_TITLE,
		};
		const expectedAction: SetNavbarTitle = {
			type: SET_NAVBAR_TITLE,
			payload: mockSetNavbarTitlePayload,
		};

		expect(setNavbarTitle(mockSetNavbarTitlePayload)).toEqual(expectedAction);
	});

	it('setNavbarSearchingStatus', () => {
		const mockSetNavbarSearchingStatusPayload = {
			isSearching: NAVBAR_IS_SEARCHING,
		};
		const expectedAction: SetNavbarSearchingStatus = {
			type: SET_NAVBAR_SEARCHING_STATUS,
			payload: mockSetNavbarSearchingStatusPayload,
		};

		expect(
			setNavbarSearchingStatus(mockSetNavbarSearchingStatusPayload),
		).toEqual(expectedAction);
	});
});
