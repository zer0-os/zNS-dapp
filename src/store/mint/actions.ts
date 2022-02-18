import { SET_MINTING_REQUEST, SET_MINTED_REQUEST } from './actionTypes';
import {
	MintRequestPayload,
	SetMintingRequest,
	SetMintedRequest,
} from './types';

/**
 *  SET_MINTING_REQUEST actions
 */
export const setMintingRequest = (
	payload: MintRequestPayload,
): SetMintingRequest => ({
	type: SET_MINTING_REQUEST,
	payload,
});

/**
 *  SET_MINTED_REQUEST actions
 */
export const setMintedRequest = (
	payload: MintRequestPayload,
): SetMintedRequest => ({
	type: SET_MINTED_REQUEST,
	payload,
});
