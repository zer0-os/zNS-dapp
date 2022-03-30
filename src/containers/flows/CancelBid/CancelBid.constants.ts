import { Step } from './CancelBid.types';

const LABELS = {
	HEADER: 'Cancel Bid',
};

const MESSAGES = {
	TEXT_CANCELLING_BID:
		'Cancelling your bid. Please wait - transaction is processing.',
	TEXT_CONFIRM_CANCEL:
		"Are you sure you want to cancel your bid? You can't undo this.",
	TEXT_FAILED_TO_LOAD: 'Failed to load bid data.',
	TEXT_LOADING: 'Loading bid data.',
	TEXT_SUCCESS: 'Successfully cancelled bid.',
	TEXT_WAITING_FOR_WALLET_V1:
		'Waiting for signature approval. You should receive a request in your wallet.',
	TEXT_WAITING_FOR_WALLET_V2:
		'Waiting for signature and transaction approval. You should receive two requests in your wallet.',
};

const BUTTONS = {
	[Step.Details]: { PRIMARY: 'Retry', SECONDARY: 'Close' },
	[Step.Confirmation]: {
		PRIMARY: 'Cancel Bid',
		SECONDARY: 'Back',
		TERTIARY: 'Retry',
	},
	[Step.Success]: { PRIMARY: 'Finish' },
};

const ERRORS = {
	SIGNATURE: 'Failed to generate signature.',
	TRANSACTION: 'Transaction failed.',
	LIBRARY: 'Failed to connect with Web3 wallet.',
	CONSOLE: 'Could not find web3 library',
};

const exports = {
	MESSAGES,
	BUTTONS,
	ERRORS,
	LABELS,
};
export default exports;
