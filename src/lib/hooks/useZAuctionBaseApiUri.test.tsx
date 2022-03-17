import {
	ZAUCTION_BASE_URL,
	useZAuctionBaseApiUri,
} from './useZAuctionBaseApiUri';

describe('useZAuctionBaseApiUri', () => {
	it('should return correct auction base api url', () => {
		expect(useZAuctionBaseApiUri(1)).toBe(ZAUCTION_BASE_URL[1]);
		expect(useZAuctionBaseApiUri(42)).toBe(ZAUCTION_BASE_URL[42]);
		expect(useZAuctionBaseApiUri(2022)).toBe(undefined);
		expect(useZAuctionBaseApiUri(10000)).toBe(undefined);
		expect(useZAuctionBaseApiUri(99999999)).toBe(undefined);
	});
});
