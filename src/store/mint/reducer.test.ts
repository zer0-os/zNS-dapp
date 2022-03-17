import { SET_MINTING_REQUEST, SET_MINTED_REQUEST } from './actionTypes';
import { SetMintingRequest, SetMintedRequest } from './types';
import reducer, { INITIAL_STATE } from './reducer';
import { mintReady } from './mint.mockData';

describe('mint.reducer', () => {
	it('should be able to set minting request', () => {
		const mockMintingPayload = mintReady.minting[0];
		const setMintingRequest: SetMintingRequest = {
			type: SET_MINTING_REQUEST,
			payload: mockMintingPayload,
		};
		const expected = {
			...INITIAL_STATE,
			minting: [mockMintingPayload],
		};

		expect(reducer(INITIAL_STATE, setMintingRequest)).toEqual(expected);
	});

	it('should be able to set minted request', () => {
		const mockMintedPayload = mintReady.minting[0];
		const setMintedRequest: SetMintedRequest = {
			type: SET_MINTED_REQUEST,
			payload: mockMintedPayload,
		};
		const expected = {
			...INITIAL_STATE,
			minting: [],
			minted: [mockMintedPayload],
		};

		expect(reducer(INITIAL_STATE, setMintedRequest)).toEqual(expected);
	});
});
