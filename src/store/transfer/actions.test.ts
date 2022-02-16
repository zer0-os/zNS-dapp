import {
	SET_TRANSFERRING_REQUEST,
	SET_TRANSFERRED_REQUEST,
} from './actionTypes';
import { SetTransferringRequest, SetTransferredRequest } from './types';
import { setTransferringRequest, setTransferredRequest } from './actions';
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
