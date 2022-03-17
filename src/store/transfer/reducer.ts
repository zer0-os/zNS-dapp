import {
	SET_TRANSFERRING_REQUEST,
	SET_TRANSFERRED_REQUEST,
} from './actionTypes';
import { TransferSubmitParams } from 'lib/types';
import { TransferState, TransferActions } from './types';

export const REDUCER_NAME = 'transfer';

export const INITIAL_STATE: TransferState = {
	transferring: [],
	transferred: [],
};

const reducer = (state = INITIAL_STATE, action: TransferActions) => {
	switch (action.type) {
		case SET_TRANSFERRING_REQUEST:
			return {
				...state,
				transferring: [...state.transferring, action.payload],
			};
		case SET_TRANSFERRED_REQUEST:
			return {
				...state,
				transferring: [
					...state.transferring.filter(
						(t: TransferSubmitParams) => t !== action.payload,
					),
				],
				transferred: [...state.transferred, action.payload],
			};
		default:
			return {
				...state,
			};
	}
};

export default reducer;
