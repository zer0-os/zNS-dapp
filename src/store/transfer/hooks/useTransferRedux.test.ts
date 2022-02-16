import { useSelector } from 'react-redux';
import {
	setTransferringRequest as reduxSetTransferringRequest,
	setTransferredRequest as reduxSetTransferredRequest,
} from 'store/transfer/actions';
import { getTransferring, getTransferred } from 'store/transfer/selectors';
import { storeReady } from 'store/store.mockData';
import { renderHook } from 'lib/testUtils';
import {
	TRANSFER_SUBMIT_PARAMS_1,
	TRANSFER_SUBMIT_PARAMS_2,
} from '../transfer.mockData';
import { useTransferRedux, UseTransferReduxReturn } from './useTransferRedux';

jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'),
	useSelector: jest.fn(),
}));

jest.mock('store/transfer/actions', () => ({
	setTransferringRequest: jest.fn(),
	setTransferredRequest: jest.fn(),
}));

const mockReduxState = {
	transferring: getTransferring(storeReady),
	transferred: getTransferred(storeReady),
};

describe('useTransferRedux', () => {
	beforeEach(() => {
		const mockAction1 = {
			type: 'SET_TRANSFERRING_REQUEST',
			payload: 'some data',
		};
		const mockAction2 = {
			type: 'SET_TRANSFERRED_REQUEST',
			payload: 'some data',
		};

		(useSelector as jest.Mock).mockReturnValueOnce(mockReduxState);
		(reduxSetTransferringRequest as jest.Mock).mockReturnValueOnce(mockAction1);
		(reduxSetTransferredRequest as jest.Mock).mockReturnValueOnce(mockAction2);
	});

	describe('reduxState', () => {
		it('Should return correct redux state', async () => {
			const { reduxState } = renderHook(
				useTransferRedux,
			) as UseTransferReduxReturn;

			expect(reduxState).toEqual(mockReduxState);
		});
	});

	describe('reduxActions', () => {
		it('#setTransferring', () => {
			const { reduxActions } = renderHook(
				useTransferRedux,
			) as UseTransferReduxReturn;

			reduxActions.setTransferring(TRANSFER_SUBMIT_PARAMS_1);

			expect(reduxSetTransferringRequest).toHaveBeenCalledTimes(1);
			expect(reduxSetTransferringRequest).toHaveBeenCalledWith(
				TRANSFER_SUBMIT_PARAMS_1,
			);
		});

		it('#setTransferred', () => {
			const { reduxActions } = renderHook(
				useTransferRedux,
			) as UseTransferReduxReturn;

			reduxActions.setTransferred(TRANSFER_SUBMIT_PARAMS_2);

			expect(reduxSetTransferredRequest).toHaveBeenCalledTimes(1);
			expect(reduxSetTransferredRequest).toHaveBeenCalledWith(
				TRANSFER_SUBMIT_PARAMS_2,
			);
		});
	});
});
