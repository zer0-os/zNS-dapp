import { renderHook } from 'lib/testUtils';
import { mintReady } from 'store/mint/mint.mockData';
import useMint, { UseMintReturn } from './useMint';

describe('useMint', () => {
	it('should return an expected mint data', () => {
		const { minting, minted } = renderHook(() => useMint()) as UseMintReturn;

		expect(minting).toEqual(mintReady.minting);
		expect(minted).toEqual(mintReady.minted);
	});
});
