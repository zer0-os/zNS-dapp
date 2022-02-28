import { useSelector } from 'react-redux';
import {
	setNavbarTitle as reduxSetNavbarTitle,
	setNavbarSearchingStatus as reduxSetNavbarSearchingStatus,
} from 'store/navbar/actions';
import {
	getNavbarTitle,
	getNavbarSearchingStatus,
} from 'store/navbar/selectors';
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
	setNavbarSearchingStatus: jest.fn(),
}));

const mockReduxState = {
	title: getNavbarTitle(storeReady),
	isSearching: getNavbarSearchingStatus(storeReady),
};

describe('useNavbarRedux', () => {
	beforeEach(() => {
		const mockAction1 = {
			type: 'SET_NAVBAR_TITLE',
			payload: 'some data',
		};
		const mockAction2 = {
			type: 'SET_NAVBAR_SEARCHING_STATUS',
			payload: 'some data',
		};

		(useSelector as jest.Mock).mockReturnValueOnce(mockReduxState);
		(reduxSetNavbarTitle as jest.Mock).mockReturnValueOnce(mockAction1);
		(reduxSetNavbarSearchingStatus as jest.Mock).mockReturnValueOnce(
			mockAction2,
		);
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

		it('#setNavbarSearchingStatus', () => {
			const { reduxActions } = renderHook(
				useNavbarRedux,
			) as UseNavbarReduxReturn;

			reduxActions.setNavbarSearchingStatus({ isSearching: true });

			expect(reduxSetNavbarSearchingStatus).toHaveBeenCalledTimes(1);
			expect(reduxSetNavbarSearchingStatus).toHaveBeenCalledWith({
				isSearching: true,
			});
		});
	});
});
