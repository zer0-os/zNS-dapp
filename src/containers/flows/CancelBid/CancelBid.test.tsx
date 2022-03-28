/*
 * This test file is testing all pieces of this puzzle together
 * CancelBid.tsx - useBidData.ts - useCancelBid.ts
 *
 * These tests are currently mocking internal custom hook functions
 * This could be extended such that the custom hooks themselves are mocked, as
 * they are all unit tested
 */

// Testing imports
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Component & data imports
import mock from './CancelBid.mock';

// Other library imports
import { ethers } from 'ethers';
import CancelBid from './CancelBid';
import constants from './CancelBid.constants';

/////////////////////////////
// Mock external functions //
/////////////////////////////

// Using var so these get hoisted
var mockGetDomainById = jest.fn();
var mockListBids = jest.fn();
var mockCancelBid = jest.fn();
var mockOnSuccess = jest.fn();
var mockOnClose = jest.fn();
var mockTx = jest.fn();

// Mock NFT Details component
const mockNFTDetailsComponent = jest.fn();
jest.mock('components/Wizard/Presets/NFTDetails', () => (props: any) => {
	mockNFTDetailsComponent(props);
	return <>NFT Details</>;
});

jest.mock('@web3-react/core', () => ({
	useWeb3React: () => ({
		library: {
			getSigner: () => {},
		},
	}),
}));

jest.mock('lib/metadata', () => ({
	getMetadata: () => Promise.resolve(mock.mockMetadata),
}));

jest.mock('lib/providers/ZnsSdkProvider', () => ({
	useZnsSdk: () => ({
		instance: {
			getDomainById: mockGetDomainById,
			zauction: {
				listBids: mockListBids,
				cancelBid: mockCancelBid,
			},
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

const renderComponent = () =>
	render(
		<CancelBid
			{...mock.mockContainerProps}
			onClose={mockOnClose}
			onSuccess={mockOnSuccess}
		/>,
	);

const standardSetup = () => {
	mockGetDomainById.mockResolvedValue(mock.mockDomainData);
	mockListBids.mockResolvedValue(mock.mockBids);
	renderComponent();
};

///////////
// Tests //
///////////

test('should retrieve correct data from sources', async () => {
	standardSetup();

	// Loading
	await screen.findByText(constants.MESSAGES.TEXT_LOADING);

	await screen.findByText(/confirm/i); // confirm button

	expect(mockNFTDetailsComponent).toBeCalledWith(
		expect.objectContaining({
			assetUrl: mock.mockMetadata.image,
			creator: mock.mockDomainData.minter,
			domain: mock.mockDomainData.name,
			title: mock.mockMetadata.title,
			otherDetails: [
				{
					name: 'Highest Bid',
					value:
						ethers.utils.formatEther(mock.mockHighestBid.amount).toString() +
						' WILD',
				},
				{
					name: 'Your Bid',
					value:
						ethers.utils.formatEther(mock.mockBidBeingCancelled.amount) +
						' WILD',
				},
			],
		}),
	);
});

test('handles failed getDomainById request', async () => {
	mockGetDomainById.mockRejectedValue(undefined);
	renderComponent();

	await screen.findByText(constants.MESSAGES.TEXT_LOADING);
	await screen.findByText(constants.MESSAGES.TEXT_FAILED_TO_LOAD);

	expect(console.error).toHaveBeenCalled();
});

test('handles failed listBids request', async () => {
	mockGetDomainById.mockResolvedValue(mock.mockDomainData);
	mockListBids.mockRejectedValue(undefined);
	renderComponent();

	await screen.findByText(constants.MESSAGES.TEXT_LOADING);
	await screen.findByText(constants.MESSAGES.TEXT_FAILED_TO_LOAD);

	expect(console.error).toHaveBeenCalled();
});

test('buttons on failed to load screen should work', async () => {
	mockGetDomainById.mockRejectedValue(undefined);
	renderComponent();

	await screen.findByText(constants.MESSAGES.TEXT_LOADING);
	await screen.findByText(constants.MESSAGES.TEXT_FAILED_TO_LOAD);

	const closeButton = screen.getByText(/close/i);
	fireEvent.mouseUp(closeButton);
	expect(mockOnClose).toHaveBeenCalled();

	const retryButton = screen.getByText(/retry/i);
	fireEvent.mouseUp(retryButton);

	await screen.findByText(constants.MESSAGES.TEXT_LOADING);
});

test('back button should navigate back from confirmation screen', async () => {
	mockCancelBid.mockResolvedValue(mockTx);
	standardSetup();

	await screen.findByText(constants.MESSAGES.TEXT_LOADING);

	var confirmButton = screen.getByText(/confirm/i);
	expect(confirmButton).toBeInTheDocument();
	fireEvent.mouseUp(confirmButton);

	const backButton = screen.getByText(/back/i);
	fireEvent.mouseUp(backButton);

	confirmButton = screen.getByText(/confirm/i);
	expect(confirmButton).toBeInTheDocument();
});

test('should handle successful cancel bid request', async () => {
	mockCancelBid.mockResolvedValue({ wait: mockTx });
	mockTx.mockResolvedValue(undefined);

	standardSetup();

	await screen.findByText(constants.MESSAGES.TEXT_LOADING);

	var confirmButton = await screen.findByText(/confirm/i);
	fireEvent.mouseUp(confirmButton);

	const cancelBidButton = await screen.findByRole('button', {
		name: /cancel bid/i,
	});
	fireEvent.mouseUp(cancelBidButton);

	expect(
		screen.getByText(constants.MESSAGES.TEXT_WAITING_FOR_WALLET_V2),
	).toBeInTheDocument();

	await screen.findByText(constants.MESSAGES.TEXT_CANCELLING_BID);
	await screen.findByText(constants.MESSAGES.TEXT_SUCCESS);

	const finishButton = await screen.findByText('Finish');
	fireEvent.mouseUp(finishButton);

	expect(mockOnClose).toBeCalledTimes(1);
	expect(mockOnSuccess).toBeCalledTimes(1);
});

test('should handle rejected/failed signature request', async () => {
	mockCancelBid.mockRejectedValue(undefined);

	standardSetup();

	await screen.findByText(constants.MESSAGES.TEXT_LOADING);

	var confirmButton = await screen.findByText(/confirm/i);
	fireEvent.mouseUp(confirmButton);

	const cancelBidButton = await screen.findByRole('button', {
		name: /cancel bid/i,
	});
	fireEvent.mouseUp(cancelBidButton);

	screen.getByText(constants.MESSAGES.TEXT_WAITING_FOR_WALLET_V2);

	await screen.findByText(constants.ERRORS.SIGNATURE);

	expect(console.error).toHaveBeenCalled();
});

test('should handle rejected/failed transaction', async () => {
	mockCancelBid.mockResolvedValue({ wait: mockTx });
	mockTx.mockRejectedValue(undefined);

	standardSetup();

	await screen.findByText(constants.MESSAGES.TEXT_LOADING);

	var confirmButton = await screen.findByText(/confirm/i);
	fireEvent.mouseUp(confirmButton);

	const cancelBidButton = await screen.findByRole('button', {
		name: /cancel bid/i,
	});
	fireEvent.mouseUp(cancelBidButton);

	screen.getByText(constants.MESSAGES.TEXT_WAITING_FOR_WALLET_V2);
	await screen.findByText(constants.MESSAGES.TEXT_CANCELLING_BID);

	await screen.findByText(constants.ERRORS.TRANSACTION);

	expect(console.error).toHaveBeenCalled();
});
