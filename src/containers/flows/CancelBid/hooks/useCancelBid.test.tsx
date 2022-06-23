/*
 * Unit tests for useCancelBid
 */
//- Test Imports
import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

//- Hooks Imports
import useCancelBid, { UseCancelBidReturn } from './useCancelBid';

//- Constants Imports
import constants from '../CancelBid.constants';

//- Mocks Imports
import * as mocks from './useCanceBid.mocks';

//////////
// Mock //
//////////

var mockCancelBid = jest.fn();
var mockTx = jest.fn();

jest.mock('lib/hooks/sdk', () => ({
	useZnsSdk: () => ({
		instance: {
			zauction: {
				cancelBid: mockCancelBid,
			},
		},
	}),
}));

jest.mock('@web3-react/core', () => ({
	useWeb3React: () => ({
		library: {
			getSigner: () => ({ isSigner: true }),
		},
	}),
}));

///////////
// Setup //
///////////

const jestConsole = console;
const consoleError = console.error;

beforeEach(() => {
	global.console = require('console');
	console.error = jest.fn();
});

afterEach(() => {
	global.console = jestConsole;
	console.error = consoleError;
});

const setupHook = () => {
	const returnVal = {};
	const TestComponent = () => {
		Object.assign(returnVal, useCancelBid());
		return null;
	};
	render(<TestComponent />);
	return returnVal as UseCancelBidReturn;
};

///////////
// Tests //
///////////
describe('useCancelBid', () => {
	describe('zAuction Version 1 Bid', () => {
		test('successfully cancels bid', async () => {
			mockCancelBid.mockResolvedValue({ wait: mockTx });
			mockTx.mockResolvedValue(undefined);
			const hook = setupHook();

			await act(() => hook.cancel(mocks.mockBidV1));

			expect(mockCancelBid).toBeCalledTimes(1);
			expect(mockTx).toBeCalledTimes(1);
			expect(mockCancelBid).toBeCalledWith(mocks.mockBidV1, false, {
				isSigner: true,
			});
		});

		test('status updates as expected for v1 bid', async () => {
			mockCancelBid.mockResolvedValue({ wait: mockTx });
			const hook = setupHook();

			act(() => {
				hook.cancel(mocks.mockBidV1);
			});

			expect(hook.status).toBe(constants.MESSAGES.TEXT_WAITING_FOR_WALLET_V1);
			await (() =>
				expect(hook.status).toBe(constants.MESSAGES.TEXT_CANCELLING_BID));
			await waitFor(() => expect(mockTx).toHaveBeenCalledTimes(1));
			expect(hook.status).toBeUndefined();
		});

		test('handles failed/rejected signature', async () => {
			mockCancelBid.mockRejectedValue(undefined);
			const hook = setupHook();

			var err: Error | undefined;
			try {
				await act(async () => {
					await hook.cancel(mocks.mockBidV1);
				});
			} catch (e) {
				err = e as Error;
			}

			expect(mockCancelBid).toBeCalledTimes(1);
			expect(err?.message).toBe(constants.ERRORS.SIGNATURE);
			expect(console.error).toHaveBeenCalled();
		});

		test('handles failed/rejected transaction', async () => {
			mockCancelBid.mockResolvedValue({
				wait: mockTx,
			});
			mockTx.mockRejectedValue(undefined);
			const hook = setupHook();

			var err: Error | undefined;
			try {
				await act(async () => {
					await hook.cancel(mocks.mockBidV1);
				});
			} catch (e) {
				err = e as Error;
			}

			expect(mockTx).toBeCalledTimes(1);
			expect(err?.message).toBe(constants.ERRORS.TRANSACTION);
			expect(console.error).toHaveBeenCalled();
		});
	});

	describe('zAuction Version 2 Bid', () => {
		test('successfully cancels bid', async () => {
			mockCancelBid.mockResolvedValue({ wait: mockTx });
			mockTx.mockResolvedValue(undefined);
			const hook = setupHook();

			await act(() => hook.cancel(mocks.mockBidV2));

			expect(mockCancelBid).toBeCalledTimes(1);
			expect(mockTx).toBeCalledTimes(1);
			expect(mockCancelBid).toBeCalledWith(mocks.mockBidV2, true, {
				isSigner: true,
			});
		});

		test('status updates as expected for v2 bid', async () => {
			mockCancelBid.mockResolvedValue({ wait: mockTx });
			const hook = setupHook();

			act(() => {
				hook.cancel(mocks.mockBidV2);
			});

			expect(hook.status).toBe(constants.MESSAGES.TEXT_WAITING_FOR_WALLET_V2);
			await (() =>
				expect(hook.status).toBe(constants.MESSAGES.TEXT_CANCELLING_BID));
			await waitFor(() => expect(mockTx).toHaveBeenCalledTimes(1));
			expect(hook.status).toBeUndefined();
		});

		test('handles failed/rejected signature', async () => {
			mockCancelBid.mockRejectedValue(undefined);
			const hook = setupHook();

			var err: Error | undefined;
			try {
				await act(async () => {
					await hook.cancel(mocks.mockBidV2);
				});
			} catch (e) {
				err = e as Error;
			}

			expect(mockCancelBid).toBeCalledTimes(1);
			expect(err?.message).toBe(constants.ERRORS.SIGNATURE);
			expect(console.error).toHaveBeenCalled();
		});

		test('handles failed/rejected transaction', async () => {
			mockCancelBid.mockResolvedValue({
				wait: mockTx,
			});
			mockTx.mockRejectedValue(undefined);
			const hook = setupHook();

			var err: Error | undefined;
			try {
				await act(async () => {
					await hook.cancel(mocks.mockBidV2);
				});
			} catch (e) {
				err = e as Error;
			}

			expect(mockTx).toBeCalledTimes(1);
			expect(err?.message).toBe(constants.ERRORS.TRANSACTION);
			expect(console.error).toHaveBeenCalled();
		});
	});
});
