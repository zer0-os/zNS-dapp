/*
 * Unit tests for useCancelBid
 */
//- Test Imports
import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

//- Constants Imports
import { MESSAGES } from '../AcceptBid.constants';
import * as ERROR_TEXT from 'constants/errors';

//- Hooks Imports
import useAcceptBid, { UseAcceptBidReturn } from './useAcceptBid';

//- Mocks Imports
import * as mocks from './useAcceptBid.mocks';

//////////
// Mock //
//////////

var mockAcceptBid = jest.fn();
var mockTx = jest.fn();

jest.mock('lib/hooks/sdk', () => ({
	useZnsSdk: () => ({
		instance: {
			zauction: {
				acceptBid: mockAcceptBid,
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

const OTHER_ERROR = 'some other error';

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
		Object.assign(returnVal, useAcceptBid());
		return null;
	};
	render(<TestComponent />);
	return returnVal as UseAcceptBidReturn;
};

///////////
// Tests //
///////////
describe('useAcceptBid', () => {
	describe('zAuction Version 1 Bid', () => {
		test('successfully accepts bid', async () => {
			mockAcceptBid.mockResolvedValue({ wait: mockTx });
			mockTx.mockResolvedValue(undefined);
			const hook = setupHook();

			await act(() => hook.accept(mocks.mockBidV1));

			expect(mockAcceptBid).toBeCalledTimes(1);
			expect(mockTx).toBeCalledTimes(1);
			expect(mockAcceptBid).toBeCalledWith(mocks.mockBidV1, { isSigner: true });
		});

		test('status updates as expected', async () => {
			mockAcceptBid.mockResolvedValue({ wait: mockTx });
			const hook = setupHook();

			act(() => {
				hook.accept(mocks.mockBidV1);
			});

			expect(hook.status).toBe(MESSAGES.TEXT_WAITING_FOR_WALLET);
			await (() => expect(hook.status).toBe(MESSAGES.TEXT_ACCEPTING_BID));
			await waitFor(() => expect(mockTx).toHaveBeenCalledTimes(1));
			expect(hook.status).toBeUndefined();
		});

		test('handles failed/rejected signature when data has already been consumed', async () => {
			mockAcceptBid.mockRejectedValue(
				new Error(ERROR_TEXT.MESSAGES.DATA_CONSUMED),
			);
			const hook = setupHook();

			var err: Error | undefined;
			try {
				await act(async () => {
					await hook.accept(mocks.mockBidV1);
				});
			} catch (e) {
				err = e as Error;
			}

			expect(mockAcceptBid).toBeCalledTimes(1);
			expect(err?.message).toBe(ERROR_TEXT.ERRORS.DATA_CONSUMED);
			expect(console.error).toHaveBeenCalled();
		});

		test('handles failed/rejected signature when rejected by wallet', async () => {
			mockAcceptBid.mockRejectedValue(
				new Error(ERROR_TEXT.MESSAGES.TRANSACTION_DENIED),
			);
			const hook = setupHook();

			var err: Error | undefined;
			try {
				await act(async () => {
					await hook.accept(mocks.mockBidV1);
				});
			} catch (e) {
				err = e as Error;
			}

			expect(mockAcceptBid).toBeCalledTimes(1);
			expect(err?.message).toBe(ERROR_TEXT.ERRORS.REJECTED_WALLET);
			expect(console.error).toHaveBeenCalled();
		});

		test('handles alternative errors thrown for generic error messaging', async () => {
			mockAcceptBid.mockRejectedValue(new Error(OTHER_ERROR));
			const hook = setupHook();

			var err: Error | undefined;
			try {
				await act(async () => {
					await hook.accept(mocks.mockBidV1);
				});
			} catch (e) {
				err = e as Error;
			}

			expect(mockAcceptBid).toBeCalledTimes(1);
			expect(err?.message).toBe(ERROR_TEXT.ERRORS.PROBLEM_OCCURRED);
			expect(console.error).toHaveBeenCalled();
		});

		test('handles failed/rejected transaction', async () => {
			mockAcceptBid.mockResolvedValue({
				wait: mockTx,
			});
			mockTx.mockRejectedValue(undefined);
			const hook = setupHook();

			var err: Error | undefined;
			try {
				await act(async () => {
					await hook.accept(mocks.mockBidV1);
				});
			} catch (e) {
				err = e as Error;
			}

			expect(mockTx).toBeCalledTimes(1);
			expect(err?.message).toBe(ERROR_TEXT.ERRORS.TRANSACTION);
			expect(console.error).toHaveBeenCalled();
		});
	});

	describe('zAuction Version 2 Bid', () => {
		test('successfully accepts bid', async () => {
			mockAcceptBid.mockResolvedValue({ wait: mockTx });
			mockTx.mockResolvedValue(undefined);
			const hook = setupHook();

			await act(() => hook.accept(mocks.mockBidV2));

			expect(mockAcceptBid).toBeCalledTimes(1);
			expect(mockTx).toBeCalledTimes(1);
			expect(mockAcceptBid).toBeCalledWith(mocks.mockBidV2, { isSigner: true });
		});

		test('status updates as expected', async () => {
			mockAcceptBid.mockResolvedValue({ wait: mockTx });
			const hook = setupHook();

			act(() => {
				hook.accept(mocks.mockBidV2);
			});

			expect(hook.status).toBe(MESSAGES.TEXT_WAITING_FOR_WALLET);
			await (() => expect(hook.status).toBe(MESSAGES.TEXT_ACCEPTING_BID));
			await waitFor(() => expect(mockTx).toHaveBeenCalledTimes(1));
			expect(hook.status).toBeUndefined();
		});

		test('handles failed/rejected signature when data has already been consumed', async () => {
			mockAcceptBid.mockRejectedValue(
				new Error(ERROR_TEXT.MESSAGES.DATA_CONSUMED),
			);
			const hook = setupHook();

			var err: Error | undefined;
			try {
				await act(async () => {
					await hook.accept(mocks.mockBidV2);
				});
			} catch (e) {
				err = e as Error;
			}

			expect(mockAcceptBid).toBeCalledTimes(1);
			expect(err?.message).toBe(ERROR_TEXT.ERRORS.DATA_CONSUMED);
			expect(console.error).toHaveBeenCalled();
		});

		test('handles failed/rejected signature when rejected by wallet', async () => {
			mockAcceptBid.mockRejectedValue(
				new Error(ERROR_TEXT.MESSAGES.TRANSACTION_DENIED),
			);
			const hook = setupHook();

			var err: Error | undefined;
			try {
				await act(async () => {
					await hook.accept(mocks.mockBidV2);
				});
			} catch (e) {
				err = e as Error;
			}

			expect(mockAcceptBid).toBeCalledTimes(1);
			expect(err?.message).toBe(ERROR_TEXT.ERRORS.REJECTED_WALLET);
			expect(console.error).toHaveBeenCalled();
		});

		test('handles alternative errors thrown for generic error messaging', async () => {
			mockAcceptBid.mockRejectedValue(new Error(OTHER_ERROR));
			const hook = setupHook();

			var err: Error | undefined;
			try {
				await act(async () => {
					await hook.accept(mocks.mockBidV2);
				});
			} catch (e) {
				err = e as Error;
			}

			expect(mockAcceptBid).toBeCalledTimes(1);
			expect(err?.message).toBe(ERROR_TEXT.ERRORS.PROBLEM_OCCURRED);
			expect(console.error).toHaveBeenCalled();
		});

		test('handles failed/rejected transaction', async () => {
			mockAcceptBid.mockResolvedValue({
				wait: mockTx,
			});
			mockTx.mockRejectedValue(undefined);
			const hook = setupHook();

			var err: Error | undefined;
			try {
				await act(async () => {
					await hook.accept(mocks.mockBidV2);
				});
			} catch (e) {
				err = e as Error;
			}

			expect(mockTx).toBeCalledTimes(1);
			expect(err?.message).toBe(ERROR_TEXT.ERRORS.TRANSACTION);
			expect(console.error).toHaveBeenCalled();
		});
	});
});
