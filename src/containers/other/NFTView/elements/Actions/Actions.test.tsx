/*
 * These tests are not complete, they still need to handle:
 * - first action should be FutureButton, all others text button
 * - click handlers
 * - border-right on first action if actions > 2
 */

// Testing imports
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Other library imports
import Actions, { TEST_ID } from './Actions';
import { parseEther } from '@ethersproject/units';
import { Bid } from '@zero-tech/zauction-sdk';

/////////////////////////////
// Mock external functions //
/////////////////////////////

var mockOnMakeBid = jest.fn();
var mockRefetch = jest.fn();

///////////
// Setup //
///////////

// BidButton uses useWeb3React internally
// TODO: refactor this to mock buttons
jest.mock('@web3-react/core', () => ({
	useWeb3React: () => ({
		account: '1',
	}),
}));

// Expected Labels as per Figma
const EXPECTED_LABELS = {
	HIGHEST_BID: 'Highest Bid (WILD)',
	YOUR_BID: 'Your Bid (WILD)',
	BUY_NOW: 'Buy Now (WILD)',
	NO_BIDS: 'No bids placed',

	PLACE_BID_BUTTON: 'Place A Bid',
	REBID_BUTTON: 'Rebid',
	BUY_NOW_BUTTON: 'Buy Now',
	EDIT_BUY_NOW_BUTTON: 'Edit Buy Now',
	SET_BUY_NOW_BUTTON: 'Set Buy Now',
	CANCEL_BID_BUTTON: 'Cancel Bid',
};

type Props = {
	isBiddable?: boolean;
	buyNowPrice?: number;
	highestBid?: number;
	yourBid?: number;
	isOwnedByUser: boolean;
};

const yourBidTemplate: Bid = {
	bidNonce: '',
	bidder: '',
	contract: '',
	tokenId: '',
	startBlock: '',
	amount: '',
	expireBlock: '',
	signedMessage: '',
	timestamp: '',
	version: '2.0',
};

const renderComponent = ({ yourBid, isBiddable = true, ...props }: Props) => {
	let mockYourBid;
	if (yourBid) {
		mockYourBid = {
			...yourBidTemplate,
			amount: parseEther(yourBid.toString()).toString(),
		};
	}

	return render(
		<Actions
			domainId="1"
			onMakeBid={mockOnMakeBid}
			refetch={mockRefetch}
			yourBid={mockYourBid}
			isBiddable={isBiddable}
			wildPriceUsd={2} // Going to use static value here
			{...props}
		/>,
	);
};

///////////
// Tests //
///////////

test('should render container', async () => {
	const { getByTestId } = renderComponent({
		isOwnedByUser: true,
	});
	const container = getByTestId(TEST_ID.CONTAINER);
	expect(container).toBeInTheDocument();
});

/////////////////////////////////////////
// Testing correct values are rendered //
/////////////////////////////////////////

test('should format highest bid (no bids)', async () => {
	const { getByText } = renderComponent({
		highestBid: undefined,
		isOwnedByUser: false,
	});
	expect(getByText('-')).toBeInTheDocument();
	expect(getByText(EXPECTED_LABELS.NO_BIDS)).toBeInTheDocument();
});

test('should format highest bid (has bids)', async () => {
	const { getByText } = renderComponent({
		highestBid: 1000,
		isOwnedByUser: false,
	});
	expect(getByText('1,000')).toBeInTheDocument();
	expect(getByText('$2,000.00')).toBeInTheDocument();
});

test('should format your bid', async () => {
	const { getByText } = renderComponent({
		yourBid: 1000,
		isOwnedByUser: false,
	});
	expect(getByText('1,000')).toBeInTheDocument();
	expect(getByText('$2,000.00')).toBeInTheDocument();
});

test('should format buy now price (no buy now)', async () => {
	const { getByText } = renderComponent({
		isOwnedByUser: true,
		highestBid: 100, // so we dont have two "-" labels
	});
	expect(getByText('-')).toBeInTheDocument();
	expect(getByText('No buy now set')).toBeInTheDocument();
});

test('should format buy now price (has buy now)', async () => {
	const { getByText } = renderComponent({
		isOwnedByUser: false,
		buyNowPrice: 1000,
	});
	expect(getByText('1,000')).toBeInTheDocument();
	expect(getByText('$2,000.00')).toBeInTheDocument();
});

////////////////////////////
// Testing click handlers //
////////////////////////////

test('should fire onMakeBid event', async () => {
	const { getByText } = renderComponent({
		isOwnedByUser: false,
	});
	const placeBid = getByText(EXPECTED_LABELS.PLACE_BID_BUTTON);
	fireEvent.mouseUp(placeBid);
	expect(mockOnMakeBid).toBeCalledTimes(1);
});

//////////////////////////////////////////
// Testing correct actions are rendered //
//////////////////////////////////////////

test('should render correct actions for: not owner, no bids, no buy now', async () => {
	// Should be highest
	const { getByTestId, getByText } = renderComponent({
		isBiddable: true,
		isOwnedByUser: false,
	});
	expect(getByTestId(TEST_ID.CONTAINER).childElementCount).toBe(1);
	expect(getByTestId(TEST_ID.PLACE_BID)).toBeInTheDocument();
	expect(getByText(EXPECTED_LABELS.PLACE_BID_BUTTON)).toBeInTheDocument();
});

test('should render correct actions for: not owner, bids, buy now, no user bid', async () => {
	const { getByTestId, getByText } = renderComponent({
		isOwnedByUser: false,
		highestBid: 5000,
	});

	expect(getByTestId(TEST_ID.CONTAINER).childElementCount).toBe(1);
	expect(getByTestId(TEST_ID.PLACE_BID)).toBeInTheDocument();
	expect(getByText(EXPECTED_LABELS.PLACE_BID_BUTTON)).toBeInTheDocument();
});

test('should render correct actions for: owner, no bids, no buy now', async () => {
	const { getByTestId, queryByText, getByText } = renderComponent({
		isOwnedByUser: true,
	});

	expect(getByTestId(TEST_ID.CONTAINER).childElementCount).toBe(2);
	expect(getByTestId(TEST_ID.PLACE_BID)).toBeInTheDocument();
	expect(queryByText(EXPECTED_LABELS.PLACE_BID_BUTTON)).toBeNull();
	expect(getByText(EXPECTED_LABELS.SET_BUY_NOW_BUTTON)).toBeInTheDocument();
});

test('should render correct actions for: owner, bids, buy now', async () => {
	const { getByTestId, getByText, queryByText } = renderComponent({
		isOwnedByUser: true,
		highestBid: 500,
		buyNowPrice: 500,
	});

	expect(getByTestId(TEST_ID.CONTAINER).childElementCount).toBe(2);
	expect(queryByText(EXPECTED_LABELS.PLACE_BID_BUTTON)).toBeNull();
	expect(getByText(EXPECTED_LABELS.EDIT_BUY_NOW_BUTTON)).toBeInTheDocument();
});

test('should render correct actions for: not owner, bids, outbid, no buy now', async () => {
	const { getByTestId, getByText } = renderComponent({
		isOwnedByUser: false,
		yourBid: 100,
		highestBid: 500,
	});

	expect(getByTestId(TEST_ID.CONTAINER).childElementCount).toBe(2);
	expect(getByText(EXPECTED_LABELS.REBID_BUTTON)).toBeInTheDocument();
	expect(getByText(EXPECTED_LABELS.CANCEL_BID_BUTTON)).toBeInTheDocument();
});

test('should render correct actions for: not owner, bids, no user bid, buy now', async () => {
	const { getByTestId, getByText } = renderComponent({
		isOwnedByUser: false,
		highestBid: 500,
		buyNowPrice: 500,
	});

	expect(getByTestId(TEST_ID.CONTAINER).childElementCount).toBe(2);
	expect(getByText(EXPECTED_LABELS.BUY_NOW_BUTTON)).toBeInTheDocument();
	expect(getByText(EXPECTED_LABELS.PLACE_BID_BUTTON)).toBeInTheDocument();
});

test('should render correct actions for: owner, bids, no buy now', async () => {
	const { getByTestId, getByText, queryByText } = renderComponent({
		isOwnedByUser: true,
		highestBid: 500,
	});

	expect(getByTestId(TEST_ID.CONTAINER).childElementCount).toBe(2);
	expect(getByTestId(TEST_ID.PLACE_BID)).toBeInTheDocument();
	expect(queryByText(EXPECTED_LABELS.PLACE_BID_BUTTON)).toBeNull();
	expect(getByText(EXPECTED_LABELS.SET_BUY_NOW_BUTTON)).toBeInTheDocument();
});

test('should render correct actions for: owner, no bids, buy now', async () => {
	const { getByTestId, getByText, queryByText } = renderComponent({
		isOwnedByUser: true,
		buyNowPrice: 500,
	});

	expect(getByTestId(TEST_ID.CONTAINER).childElementCount).toBe(2);
	expect(getByTestId(TEST_ID.PLACE_BID)).toBeInTheDocument();
	expect(queryByText(EXPECTED_LABELS.PLACE_BID_BUTTON)).toBeNull();
	expect(getByText(EXPECTED_LABELS.EDIT_BUY_NOW_BUTTON)).toBeInTheDocument();
});

test('should render correct actions for: not owner, bids, leading, no buy now', async () => {
	const { getByTestId, getByText } = renderComponent({
		isOwnedByUser: false,
		yourBid: 600,
		highestBid: 600,
	});

	expect(getByTestId(TEST_ID.CONTAINER).childElementCount).toBe(2);
	expect(getByText(EXPECTED_LABELS.PLACE_BID_BUTTON)).toBeInTheDocument();
	expect(getByText(EXPECTED_LABELS.CANCEL_BID_BUTTON)).toBeInTheDocument();
});

test('should render correct actions for: not owner, bids, outbid, buy now', async () => {
	const { getByTestId, getByText } = renderComponent({
		isOwnedByUser: false,
		yourBid: 500,
		highestBid: 600,
		buyNowPrice: 1000,
	});

	expect(getByTestId(TEST_ID.CONTAINER).childElementCount).toBe(3);
	expect(getByText(EXPECTED_LABELS.BUY_NOW_BUTTON)).toBeInTheDocument();
	expect(getByText(EXPECTED_LABELS.REBID_BUTTON)).toBeInTheDocument();
	expect(getByText(EXPECTED_LABELS.CANCEL_BID_BUTTON)).toBeInTheDocument();
});

test('should render correct actions for: not owner, bids, leading, buy now', async () => {
	const { getByTestId, getByText } = renderComponent({
		isOwnedByUser: false,
		yourBid: 500,
		highestBid: 600,
		buyNowPrice: 1000,
	});

	expect(getByTestId(TEST_ID.CONTAINER).childElementCount).toBe(3);
	expect(getByText(EXPECTED_LABELS.BUY_NOW_BUTTON)).toBeInTheDocument();
	expect(getByText(EXPECTED_LABELS.REBID_BUTTON)).toBeInTheDocument();
	expect(getByText(EXPECTED_LABELS.CANCEL_BID_BUTTON)).toBeInTheDocument();
});
