/*
 * Unit tests for useCancelBid
 */
//- Test Imports
import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

//- Constants Imports
import { MESSAGES, ERRORS } from '../AcceptBid.constants';

//- Hooks Imports
import useAcceptBid, { UseAcceptBidReturn } from './useAcceptBid';

//- Type Imports
import { ZAuctionVersionType } from '../AcceptBid.types';

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
	version: ZAuctionVersionType.V2,
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
		Object.assign(returnVal, useAcceptBid());
		return null;
	};
	render(<TestComponent />);
	return returnVal as UseAcceptBidReturn;
};

///////////
// Tests //
///////////

test('successfully accepts bid', async () => {
	mockAcceptBid.mockResolvedValue({ wait: mockTx });
	mockTx.mockResolvedValue(undefined);
	const hook = setupHook();

	await act(() => hook.accept(mockBid));

	expect(mockAcceptBid).toBeCalledTimes(1);
	expect(mockTx).toBeCalledTimes(1);
	expect(mockAcceptBid).toBeCalledWith(mockBid, { isSigner: true });
});

test('status updates as expected', async () => {
	mockAcceptBid.mockResolvedValue({ wait: mockTx });
	const hook = setupHook();

	act(() => {
		hook.accept(mockBid);
	});

	expect(hook.status).toBe(MESSAGES.TEXT_WAITING_FOR_WALLET);
	await (() => expect(hook.status).toBe(MESSAGES.TEXT_ACCEPTING_BID));
	await waitFor(() => expect(mockTx).toHaveBeenCalledTimes(1));
	expect(hook.status).toBeUndefined();
});

test('handles failed/rejected signature when data has already been consumed', async () => {
	mockAcceptBid.mockRejectedValue(new Error('data already consumed'));
	const hook = setupHook();

	var err: Error | undefined;
	try {
		await act(async () => {
			await hook.accept(mockBid);
		});
	} catch (e) {
		err = e as Error;
	}

	expect(mockAcceptBid).toBeCalledTimes(1);
	expect(err?.message).toBe(ERRORS.DATA_CONSUMED);
	expect(console.error).toHaveBeenCalled();
});

test('handles failed/rejected signature when rejected by wallet', async () => {
	mockAcceptBid.mockRejectedValue(new Error('Rejected by wallet.'));
	const hook = setupHook();

	var err: Error | undefined;
	try {
		await act(async () => {
			await hook.accept(mockBid);
		});
	} catch (e) {
		err = e as Error;
	}

	expect(mockAcceptBid).toBeCalledTimes(1);
	expect(err?.message).toBe(ERRORS.REJECTED_WALLET);
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
			await hook.accept(mockBid);
		});
	} catch (e) {
		err = e as Error;
	}

	expect(mockTx).toBeCalledTimes(1);
	expect(err?.message).toBe(ERRORS.TRANSACTION);
	expect(console.error).toHaveBeenCalled();
});
