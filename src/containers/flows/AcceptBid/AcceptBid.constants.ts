import { Step } from './AcceptBid.types';

export const STATUS_TEXT = {
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

export const ERROR_TEXT = {
	NO_ERROR: '',
	LOW_BALANCE: "You don't have enough Ether to use as gas",
	FAIL_TO_CALCULATE_GAS:
		'Failed to calculate gas costs. Please try again later.',
	APPROVAL_REJECTED: 'Approval rejected by wallet',
	FAILED_TRANSACTION: 'Failed to submit transaction.',
};

export const ERRORS = {
	SIGNATURE: 'Failed to generate signature.',
	TRANSACTION: 'Transaction failed.',
	LIBRARY: 'Failed to connect with Web3 wallet.',
};

export const MESSAGES = {
	TEXT_ACCEPTING_BID: 'Accepting bid. Please wait - transaction is processing.',
	TEXT_CONFIRM_ACCEPT:
		"Are you sure you want to accept this bid? You can't undo this.",
	TEXT_FAILED_TO_LOAD: 'Failed to load bid data.',
	TEXT_LOADING: 'Loading bid data.',
	TEXT_SUCCESS: 'Success! Bid accepted and ownership transferred.',
	TEXT_WAITING_FOR_WALLET:
		'Waiting for signature and transaction approval. You should receive two requests in your wallet.',
	ZAUCTION_PROMPT:
		'Before you can accept a bid, your wallet needs to approve zAuction. You will only need to do this once. This will cost gas.',
	CONFIRM_BID_AMOUNT: 'Are you sure you want to accept a bid of',
	SUCCESS_CONFIRMATION: 'Success! Bid accepted and ownership transferred',
};

export const BUTTONS = {
	[Step.ZAuction]: { PRIMARY: 'Continue', SECONDARY: 'Close' },
	[Step.DetailsConfirmation]: { PRIMARY: 'Confirm', SECONDARY: 'Cancel' },
	[Step.Success]: { PRIMARY: 'Finish' },
};

export const LABELS = {
	LOADING_BIDS: 'Loading bids...',
};
