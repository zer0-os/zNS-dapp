import {
	SET_TRANSFERRING_REQUEST,
	SET_TRANSFERRED_REQUEST,
} from './actionTypes';
import { SetTransferringRequest, SetTransferredRequest } from './types';
import reducer, { INITIAL_STATE } from './reducer';
import {
	TRANSFER_SUBMIT_PARAMS_1,
	TRANSFER_SUBMIT_PARAMS_2,
} from './transfer.mockData';

describe('transfer.reducer', () => {
	it('should be able to set transferring request', () => {
		const mockTransferringPayload = TRANSFER_SUBMIT_PARAMS_1;
		const setTransferringRequest: SetTransferringRequest = {
			type: SET_TRANSFERRING_REQUEST,
			payload: mockTransferringPayload,
		};
		const expected = {
			...INITIAL_STATE,
			transferring: [mockTransferringPayload],
		};

		expect(reducer(INITIAL_STATE, setTransferringRequest)).toEqual(expected);
	});

	it('should be able to set transferred request', () => {
		const mockTransferredPayload = TRANSFER_SUBMIT_PARAMS_2;
		const setTransferredRequest: SetTransferredRequest = {
			type: SET_TRANSFERRED_REQUEST,
			payload: mockTransferredPayload,
		};
		const expected = {
			...INITIAL_STATE,
			transferring: [],
			transferred: [mockTransferredPayload],
		};

		expect(reducer(INITIAL_STATE, setTransferredRequest)).toEqual(expected);
	});
});
