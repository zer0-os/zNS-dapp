//- Constants Imports
import { MESSAGES, ERRORS } from 'constants/errors';

export const getDisplayErrorMessage = (message: string) => {
	if (message.includes(MESSAGES.TRANSACTION_DENIED)) {
		return ERRORS.REJECTED_WALLET;
	} else if (message.includes(MESSAGES.MESSAGE_DENIED)) {
		return ERRORS.REJECTED_WALLET;
	} else if (message.includes(MESSAGES.DATA_CONSUMED)) {
		return ERRORS.DATA_CONSUMED;
	} else {
		return ERRORS.PROBLEM_OCCURRED;
	}
};
