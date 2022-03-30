import { TransferSubmitParams } from 'lib/types';
import {
	SET_TRANSFERRING_REQUEST,
	SET_TRANSFERRED_REQUEST,
} from './actionTypes';

/**
 * Transfer state definition
 */
export type TransferState = {
	transferring: TransferSubmitParams[];
	transferred: TransferSubmitParams[];
};

/**
 * Transfer Payloads definition
 */
export type TransferRequestPayload = TransferSubmitParams;

/**
 * Transfer actions definition
 */
export type SetTransferringRequest = {
	type: typeof SET_TRANSFERRING_REQUEST;
	payload: TransferRequestPayload;
};

export type SetTransferredRequest = {
	type: typeof SET_TRANSFERRED_REQUEST;
	payload: TransferRequestPayload;
};

/**
 * Union Transfer actions definition
 *
 * To be used in Reducer
 */
export type TransferActions = SetTransferringRequest | SetTransferredRequest;
