//- Type Imports
import { Step } from './TransferOwnership.types';

const TITLES = {
	[Step.Details]: { PRIMARY: 'Transfer Ownership' },
	[Step.Confirmation]: { PRIMARY: 'Are you sure?' },
};

const BUTTONS = {
	[Step.Details]: { PRIMARY: 'Transfer' },
	[Step.Confirmation]: {
		PRIMARY: 'Confirm',
		SECONDARY: 'Cancel',
	},
};

const CURRENCY = {
	WILD: ' WILD',
};

const MESSAGES = {
	ENTER_ADDRESS: 'Enter recipient address:',
	TEXT_ACCEPT_PROMPT: 'Please accept wallet transaction...',
	TRANSACTION_ERROR: 'Transaction denied by wallet',
	TEXT_INPUT_PLACEHOLDER: 'Ethereum Wallet',
	TEXT_FAILED_TO_LOAD: 'Failed to load bid data. Please try again.',
	TEXT_CONFIRMATION:
		'This transaction is about to be seared upon the blockchain. There’s no going back.',
	REQUEST_NO_WALLET: 'No wallet detected',
	REQUEST_NOT_OWNER: 'You are not the owner',
	REQUEST_TRANSFER_STARTED: 'Transfer of ownership has started',
	REQUEST_ERROR: 'Encountered an error while attempting to transfer.',
};

const INPUT = {
	TEXT_INPUT_PLACEHOLDER: 'Ethereum Wallet',
	TYPE: 'text',
};

export const getTransferSuccessMessage = (name: string) =>
	`Transfer of ownership for ${name} has completed successfully`;

const exports = {
	TITLES,
	BUTTONS,
	CURRENCY,
	MESSAGES,
	INPUT,
};
export default exports;
