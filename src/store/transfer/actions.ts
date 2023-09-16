import {
	SET_TRANSFERRED_REQUEST,
	SET_TRANSFERRING_REQUEST,
} from './actionTypes';
import {
	SetTransferredRequest,
	SetTransferringRequest,
	TransferRequestPayload,
} from './types';

/**
 *  SET_TRANSFERRING_REQUEST actions
 */
export const setTransferringRequest = (
	payload: TransferRequestPayload,
): SetTransferringRequest => ({
	type: SET_TRANSFERRING_REQUEST,
	payload,
});

/**
 *  SET_TRANSFERRED_REQUEST actions
 */
export const setTransferredRequest = (
	payload: TransferRequestPayload,
): SetTransferredRequest => ({
	type: SET_TRANSFERRED_REQUEST,
	payload,
});
