//- Types
import { StepContent } from './MakeABid.types';

export const BUTTONS = {
	[StepContent.FailedToCheckZAuction]: 'Close',
	[StepContent.Details]: {
		PRIMARY: 'Make Bid',
		SECONDARY: 'Cancel',
		TERTIARY: 'Retry',
		VIEW_ALL: 'View all bids',
	},
	[StepContent.Success]: 'Finish',
};

const TITLES = {
	ZAUCTION_APPROVAL: 'Approve zAuction',
	PLACE_BID: 'Place Bid',
	SUCCESS: 'Bid Placed',
};

export const STEP_CONTENT_TITLES = {
	[StepContent.FailedToCheckZAuction]: TITLES.ZAUCTION_APPROVAL,
	[StepContent.CheckingZAuctionApproval]: TITLES.ZAUCTION_APPROVAL,
	[StepContent.ApproveZAuction]: TITLES.ZAUCTION_APPROVAL,
	[StepContent.WaitingForWallet]: TITLES.ZAUCTION_APPROVAL,
	[StepContent.ApprovingZAuction]: TITLES.ZAUCTION_APPROVAL,
	[StepContent.Details]: TITLES.PLACE_BID,
	[StepContent.PlacingBid]: TITLES.PLACE_BID,
	[StepContent.Success]: TITLES.SUCCESS,
};

export const STEP_BAR_HEADING = ['zAuction', 'Confirm', 'Place Bid'];

export const ERRORS = {
	SIGNATURE: 'Failed to generate signature.',
	TRANSACTION: 'Transaction failed. Please try again.',
	LIBRARY: 'Failed to connect with Web3 wallet.',
	CONSOLE_TEXT: 'Failed to check zAuction approval status',
	REJECTED_WALLET: 'Rejected by wallet. Please try again.',
	INSUFFICIENT_FUNDS: 'You don’t have enough WILD to make that large of a bid.',
};

export const STATUS_TEXT = {
	CHECK_ZAUCTION: 'Checking status of zAuction approval...',
	ACCEPT_ZAUCTION_PROMPT:
		'Before you can place a bid, your wallet needs to approve zAuction. You will only need to do this once. This will cost gas.',
	APPROVING_ZAUCTION:
		'Approving zAuction. This may take up to 20 mins... Please do not close this window or refresh the page.',
	AWAITING_APPROVAL: 'Waiting for approval from your wallet...',
};

export const MESSAGES = {
	TEXT_LOADING: 'Loading Domain Data...',
	ENTER_AMOUNT: 'Enter the amount you wish to bid:',
	SUCCESSFUL_BID: `Your bid was successfully placed.`,
};

export const PLACE_BID_LABELS = {
	INPUT_PLACEHOLDER: 'Bid amount (WILD)',
	ZERO_VALUE: '0.00',
	YOUR_BID: 'Your Bid',
};

export const getSuccessNotification = (
	bidAmount: React.ReactNode,
	domainName: React.ReactNode,
) => `Bid of ${bidAmount} for ${domainName} has been placed.`;

export const getWildBalance = (balance: number) =>
	`Your Balance: ${Number(balance).toLocaleString()} WILD`;

export const getUsdEstimation = (bid: string) => `Approx. ${bid} USD`;

export const getBidAmountText = (bid: string) => `${bid} WILD`;
