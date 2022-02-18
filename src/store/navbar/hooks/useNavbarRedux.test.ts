import { useSelector } from 'react-redux';
import { setNavbarTitle as reduxSetNavbarTitle } from 'store/navbar/actions';
import { getNavbarTitle } from 'store/navbar/selectors';
import { storeReady } from 'store/store.mockData';
import { renderHook } from 'lib/testUtils';
import { NAVBAR_TITLE } from '../navbar.mockData';
import { useNavbarRedux, UseNavbarReduxReturn } from './useNavbarRedux';

jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'),
	useSelector: jest.fn(),
}));

jest.mock('store/navbar/actions', () => ({
	setNavbarTitle: jest.fn(),
}));

const mockReduxState = {
	title: getNavbarTitle(storeReady),
};

describe('useNavbarRedux', () => {
	beforeEach(() => {
		const mockAction = {
			type: 'SET_NAVBAR_TITLE',
			payload: 'some data',
		};

		(useSelector as jest.Mock).mockReturnValueOnce(mockReduxState);
		(reduxSetNavbarTitle as jest.Mock).mockReturnValueOnce(mockAction);
	});

	describe('reduxState', () => {
		it('Should return correct redux state', async () => {
			const { reduxState } = renderHook(useNavbarRedux) as UseNavbarReduxReturn;

			expect(reduxState).toEqual(mockReduxState);
		});
	});

	describe('reduxActions', () => {
		it('#setNavbarTitle', () => {
			const { reduxActions } = renderHook(
				useNavbarRedux,
			) as UseNavbarReduxReturn;

			reduxActions.setNavbarTitle({ title: NAVBAR_TITLE });

			expect(reduxSetNavbarTitle).toHaveBeenCalledTimes(1);
			expect(reduxSetNavbarTitle).toHaveBeenCalledWith({ title: NAVBAR_TITLE });
		});
	});
});
