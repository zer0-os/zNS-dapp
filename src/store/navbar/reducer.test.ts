import { SET_NAVBAR_TITLE } from './actionTypes';
import { SetNavbarTitle } from './types';
import reducer, { INITIAL_STATE } from './reducer';
import { NAVBAR_TITLE } from './navbar.mockData';

describe('navbar.reducer', () => {
	it('should be able to set navbar title request', () => {
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
});
