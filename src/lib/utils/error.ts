//- Constants Imports
import { MESSAGES, ERRORS } from 'constants/errors';

export const getErrorMessage = (err: any) => {
	if (err.message.includes(MESSAGES.TRANSACTION_DENIED)) {
		return ERRORS.REJECTED_WALLET;
	} else if (err.message.includes(MESSAGES.MESSAGE_DENIED)) {
		return ERRORS.REJECTED_WALLET;
	} else if (err.message.includes(MESSAGES.DATA_CONSUMED)) {
		return ERRORS.DATA_CONSUMED;
	} else {
		return ERRORS.PROBLEM_OCCURRED;
	}
};
