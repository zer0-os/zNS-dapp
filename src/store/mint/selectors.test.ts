import { AppState } from 'store';
import { REDUCER_NAME } from './reducer';
import { getMinting, getMinted } from './selectors';
import { mintReady } from './mint.mockData';

describe('mint.selectors', () => {
	it('should return minting from state', () => {
		const minting = getMinting({
			[REDUCER_NAME]: mintReady,
		} as AppState);
		expect(minting).toEqual(mintReady.minting);
	});

	it('should return minted from state', () => {
		const minted = getMinted({
			[REDUCER_NAME]: mintReady,
		} as AppState);
		expect(minted).toEqual(mintReady.minted);
	});
});
