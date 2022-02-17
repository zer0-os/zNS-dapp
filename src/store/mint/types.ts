import { NftStatusCard } from 'lib/types';
import { SET_MINTING_REQUEST, SET_MINTED_REQUEST } from './actionTypes';

/**
 * Mint state definition
 */
export type MintState = {
	minting: NftStatusCard[];
	minted: NftStatusCard[];
};

/**
 * Mint Payloads definition
 */
export type MintRequestPayload = NftStatusCard;

/**
 * Mint actions definition
 */
export type SetMintingRequest = {
	type: typeof SET_MINTING_REQUEST;
	payload: MintRequestPayload;
};

export type SetMintedRequest = {
	type: typeof SET_MINTED_REQUEST;
	payload: MintRequestPayload;
};

/**
 * Union Mint actions definition
 *
 * To be used in Reducer
 */
export type MintActions = SetMintingRequest | SetMintedRequest;
