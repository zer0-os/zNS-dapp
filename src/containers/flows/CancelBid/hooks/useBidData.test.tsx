/*
 * Unit tests for useCancelBid
 */

import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import mock from '../CancelBid.mock';
import useBidData, { UseBidDataReturn } from './useBidData';
import { ethers } from 'ethers';

//////////
// Mock //
//////////

var mockListBids = jest.fn();
var mockGetDomainById = jest.fn();

jest.mock('lib/hooks/sdk', () => ({
	useZnsSdk: () => ({
		instance: {
			getDomainById: mockGetDomainById,
			zauction: {
				listBids: mockListBids,
			},
		},
	}),
}));

jest.mock('lib/metadata', () => ({
	getMetadata: () => Promise.resolve(mock.mockMetadata),
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
		Object.assign(
			returnVal,
			useBidData(mock.mockDomainData.id, mock.mockBidBeingCancelled.bidNonce),
		);
		return null;
	};
	render(<TestComponent />);
	return returnVal as UseBidDataReturn;
};

///////////
// Tests //
///////////

test('successfully retrieves and filters data', async () => {
	mockGetDomainById.mockResolvedValue(mock.mockDomainData);
	mockListBids.mockResolvedValue(mock.mockBids);

	const hook = setupHook();

	expect(hook.isLoading).toBe(true);
	await waitFor(() => expect(hook.isLoading).toBe(false));

	expect(hook.bid).toBe(mock.mockBidBeingCancelled);
	expect(hook.bidData).toStrictEqual({
		assetUrl: mock.mockMetadata.image,
		creator: mock.mockDomainData.minter,
		domainName: mock.mockDomainData.name,
		title: mock.mockMetadata.title,
		highestBid: ethers.BigNumber.from(mock.mockHighestBid.amount),
		yourBid: ethers.BigNumber.from(mock.mockBidBeingCancelled.amount),
	});

	expect(hook.isLoading).toBe(false);
});

test('refetch should trigger', async () => {
	mockGetDomainById.mockResolvedValue(mock.mockDomainData);
	mockListBids.mockResolvedValue(mock.mockBids);

	const hook = setupHook();

	expect(hook.isLoading).toBe(true);
	await waitFor(() => expect(hook.isLoading).toBe(false));

	act(() => hook.refetch()); // trigger refetch

	expect(hook.isLoading).toBe(true);
	expect(hook.bid).toBeFalsy();
	expect(hook.bidData).toBeFalsy();

	await waitFor(() => expect(hook.isLoading).toBe(false));

	expect(hook.bid).toBeTruthy();
	expect(hook.bidData).toBeTruthy();
});

test('handles failed domain request', async () => {
	mockGetDomainById.mockRejectedValue(undefined);

	const hook = setupHook();

	expect(hook.isLoading).toBe(true);
	await waitFor(() => expect(hook.isLoading).toBe(false));

	expect(console.error).toHaveBeenCalled();

	expect(hook.bid).toBeFalsy();
	expect(hook.bidData).toBeFalsy();
});
