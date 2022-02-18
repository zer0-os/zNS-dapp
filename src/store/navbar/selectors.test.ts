import { AppState } from 'store';
import { REDUCER_NAME } from './reducer';
import { getNavbarTitle } from './selectors';
import { navbarReady } from './navbar.mockData';

describe('navbar.selectors', () => {
	it('should return navbar title from state', () => {
		const navbarTitle = getNavbarTitle({
			[REDUCER_NAME]: navbarReady,
		} as AppState);

		expect(navbarTitle).toEqual(navbarReady.title);
	});
});
