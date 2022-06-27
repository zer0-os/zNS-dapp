//- Constants Imports
import { MESSAGES, ERRORS } from 'constants/errors';

export const getError = (err: any) => {
	if (err.message.includes(MESSAGES.TRANSACTION_DENIED)) {
		throw new Error(ERRORS.REJECTED_WALLET);
	} else if (err.message.includes(MESSAGES.DATA_CONSUMED)) {
		throw new Error(ERRORS.DATA_CONSUMED);
	} else {
		throw new Error(ERRORS.PROBLEM_OCCURRED);
	}
};
