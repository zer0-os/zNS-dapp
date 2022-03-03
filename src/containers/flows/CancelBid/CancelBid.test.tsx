/*
 * Integration test for Cancel Bid flow
 */

// Testing imports
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
// Tests //
///////////

test('should retrieve correct data from sources', async () => {
	mockGetDomainById.mockResolvedValue(mock.mockDomainData);
	mockListBids.mockResolvedValue(mock.mockBids);
	render(<CancelBid {...mock.mockContainerProps} />);

	// Loading
	await screen.findByText(constants.TEXT_LOADING);

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
	render(<CancelBid {...mock.mockContainerProps} />);

	await screen.findByText(constants.TEXT_LOADING);
	await screen.findByText(constants.TEXT_FAILED_TO_LOAD);
});

test('handles failed listBids request', async () => {
	mockGetDomainById.mockResolvedValue(mock.mockDomainData);
	mockListBids.mockRejectedValue(undefined);
	render(<CancelBid {...mock.mockContainerProps} />);

	await screen.findByText(constants.TEXT_LOADING);
	await screen.findByText(constants.TEXT_FAILED_TO_LOAD);
});

test('buttons on failed to load screen should work', async () => {
	const mockOnClose = jest.fn();
	mockGetDomainById.mockRejectedValue(undefined);
	render(<CancelBid {...mock.mockContainerProps} onClose={mockOnClose} />);

	await screen.findByText(constants.TEXT_LOADING);
	await screen.findByText(constants.TEXT_FAILED_TO_LOAD);

	const closeButton = screen.getByText(/close/i);
	fireEvent.mouseUp(closeButton);
	expect(mockOnClose).toHaveBeenCalled();

	const retryButton = screen.getByText(/retry/i);
	fireEvent.mouseUp(retryButton);

	await screen.findByText(constants.TEXT_LOADING);
});

test('navigation buttons should properly navigate', async () => {
	mockGetDomainById.mockResolvedValue(mock.mockDomainData);
	mockListBids.mockResolvedValue(mock.mockBids);
	render(<CancelBid {...mock.mockContainerProps} />);

	await screen.findByText(constants.TEXT_LOADING);

	var confirmButton = await screen.findByText(/confirm/i);
	fireEvent.mouseUp(confirmButton);

	const backButton = await screen.findByText(/back/i);
	fireEvent.mouseUp(backButton);

	confirmButton = await screen.findByText(/confirm/i);
	fireEvent.mouseUp(confirmButton);

	const cancelBidButton = await screen.findByRole('button', {
		name: /cancel bid/i,
	});
	fireEvent.mouseUp(cancelBidButton);

	await screen.findByText(constants.TEXT_CANCELLING_BID);
});

test('should handle successful cancel bid request', async () => {
	const mockOnSuccess = jest.fn();
	const mockOnClose = jest.fn();
	mockCancelBid.mockResolvedValue(undefined);
	mockGetDomainById.mockResolvedValue(mock.mockDomainData);
	mockListBids.mockResolvedValue(mock.mockBids);
	render(
		<CancelBid
			{...mock.mockContainerProps}
			onSuccess={mockOnSuccess}
			onClose={mockOnClose}
		/>,
	);

	await screen.findByText(constants.TEXT_LOADING);

	var confirmButton = await screen.findByText(/confirm/i);
	fireEvent.mouseUp(confirmButton);

	const cancelBidButton = await screen.findByRole('button', {
		name: /cancel bid/i,
	});
	fireEvent.mouseUp(cancelBidButton);

	await screen.findByText(constants.TEXT_CANCELLING_BID);

	const finishButton = await screen.findByText(/finish/i);
	fireEvent.mouseUp(finishButton);

	await waitFor(() => expect(mockOnSuccess).toBeCalled());
	expect(mockOnClose).toBeCalled();
});

test('should handle failed cancel bid request', async () => {
	const mockOnSuccess = jest.fn();
	mockCancelBid.mockRejectedValue(new Error('Error message'));
	mockGetDomainById.mockResolvedValue(mock.mockDomainData);
	mockListBids.mockResolvedValue(mock.mockBids);
	render(<CancelBid {...mock.mockContainerProps} onSuccess={mockOnSuccess} />);

	await screen.findByText(constants.TEXT_LOADING);

	var confirmButton = await screen.findByText(/confirm/i);
	fireEvent.mouseUp(confirmButton);

	const cancelBidButton = await screen.findByRole('button', {
		name: /cancel bid/i,
	});
	fireEvent.mouseUp(cancelBidButton);

	await screen.findByText(constants.TEXT_CANCELLING_BID);

	await screen.findByText('Error message');
});
