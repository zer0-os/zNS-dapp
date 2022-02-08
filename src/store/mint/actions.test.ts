import { SET_MINTING_REQUEST, SET_MINTED_REQUEST } from './actionTypes';
import { SetMintingRequest, SetMintedRequest } from './types';
import { setMintingRequest, setMintedRequest } from './actions';
import { mintReady } from './mint.mockData';

describe('mint.actions', () => {
	it('setMintingRequest', () => {
		const mockMintingPayload = mintReady.minting[0];
		const expectedAction: SetMintingRequest = {
			type: SET_MINTING_REQUEST,
			payload: mockMintingPayload,
		};

		expect(setMintingRequest(mockMintingPayload)).toEqual(expectedAction);
	});

	it('setMintedRequest', () => {
		const mockMintedPayload = mintReady.minted[0];
		const expectedAction: SetMintedRequest = {
			type: SET_MINTED_REQUEST,
			payload: mockMintedPayload,
		};

		expect(setMintedRequest(mockMintedPayload)).toEqual(expectedAction);
	});
});
