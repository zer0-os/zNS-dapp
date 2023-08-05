import { SET_MINTED_REQUEST, SET_MINTING_REQUEST } from './actionTypes';
import { SetMintedRequest, SetMintingRequest } from './types';
import { setMintedRequest, setMintingRequest } from './actions';
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
