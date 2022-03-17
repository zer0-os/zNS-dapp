import { Step } from './AcceptBid.types';

const STATUS_TEXT = {
	CHECK_GAS_STATUS: 'Ensuring you have enough gas to approve zAuction...',
	ACCEPT_ZAUCTION_PROMPT: `Before you can accept a bid, your wallet needs to approve zAuction. You will only need to do this once. This will cost gas. 
	\nPlease accept in your wallet...`,
	APPROVING_ZAUCTION:
		'Approving zAuction. Do not close this window or refresh your browser as this may incur additional gas fees.',
	ACCEPTING_BID:
		'Accepting Bid, do not close this window or refresh your browser...',
	CHECKING_ZAUCTION_STATUS: 'Checking status of zAuction Approval...',
	AWAITING_APPROVAL: 'Waiting for approval from your wallet...',
};

const ERROR_TEXT = {
	NO_ERROR: '',
	LOW_BALANCE: "You don't have enough Ether to use as gas",
	FAIL_TO_CALCULATE_GAS:
		'Failed to calculate gas costs. Please try again later.',
	APPROVAL_REJECTED: 'Approval rejected by wallet',
	FAILED_TRANSACTION: 'Failed to submit transaction.',
};

const MESSAGES = {
	[Step.ZAuction]: {
		ZAUCTION_PROMPT:
			'Before you can accept a bid, your wallet needs to approve zAuction. You will only need to do this once. This will cost gas.',
	},
	[Step.Confirmation]: {
		CONFIRM_BID_AMOUNT: 'Are you sure you want to accept a bid of',
	},
	[Step.Success]: {
		SUCCESS_CONFIRMATION: 'Success! Bid accepted and ownership transferred',
	},
};

const BUTTONS = {
	[Step.ZAuction]: { PRIMARY: 'Continue', SECONDARY: 'Close' },
	[Step.Confirmation]: { PRIMARY: 'Confirm', SECONDARY: 'Cancel' },
	[Step.Success]: { PRIMARY: 'Finish' },
};

const LABELS = {
	WILD_CURRENCY_CODE: 'WILD',
	USD_CURRENCY_CODE: 'USD',
	LOADING_BIDS: 'Loading bids...',
	CREATOR_LABEL: 'Creator',
	HIGHEST_BID_LABEL: 'Highest Bid',
	SELECTED_BID_LABEL: 'Bid You’re Accepting',
	ROOT: '0://',
};

const exports = {
	STATUS_TEXT,
	ERROR_TEXT,
	MESSAGES,
	BUTTONS,
	LABELS,
};
export default exports;
