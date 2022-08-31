import { AppState } from 'store';
import { REDUCER_NAME } from './reducer';
import { getNavbarTitle, getNavbarSearchingStatus } from './selectors';
import { navbarReady } from './navbar.mockData';

describe('navbar.selectors', () => {
	it('should return navbar title from state', () => {
		const navbarTitle = getNavbarTitle({
			[REDUCER_NAME]: navbarReady,
		} as AppState);

		expect(navbarTitle).toEqual(navbarReady.title);
	});

	it('should return navbar searching status from state', () => {
		const navbarSearchingStatus = getNavbarSearchingStatus({
			[REDUCER_NAME]: navbarReady,
		} as AppState);

		expect(navbarSearchingStatus).toEqual(navbarReady.isSearching);
	});
});
