import { Step } from './AcceptBid.types';

export const TITLES = {
	[Step.Details]: { PRIMARY: 'Accept Bid' },
	[Step.Confirmation]: { PRIMARY: 'Are you sure?' },
	[Step.Accepting]: { PRIMARY: 'Accepting Bid...' },
	[Step.Success]: { PRIMARY: 'Bid Accepted' },
};

export const BUTTONS = {
	[Step.Details]: { PRIMARY: 'Accept', SECONDARY: 'Cancel', TERTIARY: 'Retry' },
	[Step.Confirmation]: { PRIMARY: 'Confirm', SECONDARY: 'Cancel' },
	[Step.Success]: { PRIMARY: 'Finish' },
};

export const STATUS_TEXT = {
	CHECK_ZAUCTION: 'Checking status of zAuction approval...',
	ACCEPT_ZAUCTION_PROMPT:
		'Before you can accept a bid, your wallet needs to approve zAuction. You will only need to do this once. This will cost gas.',
	APPROVING_ZAUCTION:
		'Approving zAuction. This may take up to 20 mins... Please do not close this window or refresh the page.',
	AWAITING_APPROVAL: 'Waiting for approval from your wallet...',
	APPROVED: 'Approved',
};

export const ERRORS = {
	SIGNATURE: 'Failed to generate signature.',
	TRANSACTION: 'Transaction failed.',
	LIBRARY: 'Failed to connect with Web3 wallet.',
	CONSOLE_TEXT: 'Failed to check zAuction approval status',
};

export const MESSAGES = {
	TEXT_LOADING: 'Loading Bid Data...',
	TEXT_FAILED_TO_LOAD: 'Failed to load bid data.',
	TEXT_CONFIRMATION:
		'This transaction is about to be seared upon the blockchain. There’s no going back.',
	TEXT_ACCEPT_PROMPT: 'Please accept wallet transaction...',
	TEXT_ACCEPTING_BID: 'Accepting bid. Please wait - transaction is processing.',
	TEXT_CONFIRM_ACCEPT:
		"Are you sure you want to accept this bid? You can't undo this.",
	TEXT_WAITING_FOR_WALLET:
		'Waiting for signature and transaction approval. You should receive two requests in your wallet.',
	SUCCESS_CONFIRMATION: 'Success! Bid accepted and ownership transferred',
	CONFIRM_BID_AMOUNT: 'Are you sure you want to accept a bid of',
};
