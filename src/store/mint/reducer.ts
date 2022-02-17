import { SET_MINTING_REQUEST, SET_MINTED_REQUEST } from './actionTypes';
import { NftStatusCard } from 'lib/types';
import { MintState, MintActions } from './types';

export const REDUCER_NAME = 'mint';

export const INITIAL_STATE: MintState = {
	minting: [],
	minted: [],
};

const reducer = (state = INITIAL_STATE, action: MintActions) => {
	switch (action.type) {
		case SET_MINTING_REQUEST:
			return {
				...state,
				minting: [...state.minting, action.payload],
			};
		case SET_MINTED_REQUEST:
			return {
				...state,
				minting: [
					...state.minting.filter((n: NftStatusCard) => n !== action.payload),
				],
				minted: [...state.minted, action.payload],
			};
		default:
			return {
				...state,
			};
	}
};

export default reducer;
