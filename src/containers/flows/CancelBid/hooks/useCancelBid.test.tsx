/*
 * Unit tests for useCancelBid
 */

import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import useCancelBid, { UseCancelBidReturn } from './useCancelBid';
import constants from '../CancelBid.constants';

//////////
// Mock //
//////////

var mockCancelBid = jest.fn();
var mockTx = jest.fn();

jest.mock('lib/providers/ZnsSdkProvider', () => ({
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

const mockBid = {
	bidNonce: '1',
	bidder: '0x000000000000000000000000',
	signedMessage: 'message',
	tokenId: 'id',
	amount: '1000000',
	timestamp: '0',
	contract: '0x000000000000000000000000',
	startBlock: '0',
	expireBlock: '0',
};

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

test('successfully cancels bid', async () => {
	mockCancelBid.mockResolvedValue({ wait: mockTx });
	mockTx.mockResolvedValue(undefined);
	const hook = setupHook();

	await act(() => hook.cancel(mockBid));

	expect(mockCancelBid).toBeCalledTimes(1);
	expect(mockTx).toBeCalledTimes(1);
	expect(mockCancelBid).toBeCalledWith(
		mockBid.bidNonce,
		mockBid.signedMessage,
		mockBid.tokenId,
		true,
		{ isSigner: true },
	);
});

test('status updates as expected', async () => {
	mockCancelBid.mockResolvedValue({ wait: mockTx });
	const hook = setupHook();

	act(() => {
		hook.cancel(mockBid);
	});

	expect(hook.status).toBe(constants.MESSAGES.TEXT_WAITING_FOR_WALLET);
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
			await hook.cancel(mockBid);
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
			await hook.cancel(mockBid);
		});
	} catch (e) {
		err = e as Error;
	}

	expect(mockTx).toBeCalledTimes(1);
	expect(err?.message).toBe(constants.ERRORS.TRANSACTION);
	expect(console.error).toHaveBeenCalled();
});
