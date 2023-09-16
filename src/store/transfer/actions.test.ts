import {
	SET_TRANSFERRED_REQUEST,
	SET_TRANSFERRING_REQUEST,
} from './actionTypes';
import { SetTransferredRequest, SetTransferringRequest } from './types';
import { setTransferredRequest, setTransferringRequest } from './actions';
import {
	TRANSFER_SUBMIT_PARAMS_1,
	TRANSFER_SUBMIT_PARAMS_2,
} from './transfer.mockData';

describe('trasfer.actions', () => {
	it('setTransferringRequest', () => {
		const mockTransferringPayload = TRANSFER_SUBMIT_PARAMS_1;
		const expectedAction: SetTransferringRequest = {
			type: SET_TRANSFERRING_REQUEST,
			payload: mockTransferringPayload,
		};

		expect(setTransferringRequest(mockTransferringPayload)).toEqual(
			expectedAction,
		);
	});

	it('setTransferredRequest', () => {
		const mockTransferredPayload = TRANSFER_SUBMIT_PARAMS_2;
		const expectedAction: SetTransferredRequest = {
			type: SET_TRANSFERRED_REQUEST,
			payload: mockTransferredPayload,
		};

		expect(setTransferredRequest(mockTransferredPayload)).toEqual(
			expectedAction,
		);
	});
});
