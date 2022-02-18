import { SET_NAVBAR_TITLE } from './actionTypes';
import { SetNavbarTitle } from './types';
import { setNavbarTitle } from './actions';
import { NAVBAR_TITLE } from './navbar.mockData';

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
});
