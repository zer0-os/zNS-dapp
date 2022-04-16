import { getHashFromIPFSUrl, getWebIPFSUrlFromHash } from './ipfs';
import { DEFAULT_IPFS_GATEWAY } from 'constants/ipfs';

////////////////////////////
// f:: getHashFromIPFSUrl //
////////////////////////////

// Hashes all follow the format Qm
const HASH = 'QmXuTHUeqMqABWTcX8mYVMtH4sG3nuTxTzZL8t6zSLZVxN';

const nesting = [...Array(10)]
	.map(() => (Math.random() + 1).toString(36).substring(7))
	.join('/');

describe('getHashFromIPFSUrl', () => {
	it('should handle ipfs:// URLs', () => {
		expect(getHashFromIPFSUrl('ipfs://' + HASH)).toBe(HASH);
	});

	it('should handle arbitrary web URLs', () => {
		expect(getHashFromIPFSUrl('https://ipfs.fleek.co/ipfs/' + HASH)).toBe(HASH);
		expect(getHashFromIPFSUrl('https://ipfs.io/ipfs/' + HASH)).toBe(HASH);
		expect(getHashFromIPFSUrl('test.com/' + HASH)).toBe(HASH);
		expect(getHashFromIPFSUrl('192.168.1.1/' + HASH)).toBe(HASH);
	});

	it('should handle deeply nested URLs', () => {
		const url = `https://test.com/${nesting}/${HASH}`;
		expect(getHashFromIPFSUrl(url)).toBe(HASH);
	});

	it('should handle URLs with no IPFS hash', () => {
		expect(getHashFromIPFSUrl('https://ipfs.fleek.co/')).toBe('');
	});

	it('should handle nested IPFS content', () => {
		const WEB_URL = `https://test.com/`;
		expect(getHashFromIPFSUrl(`${WEB_URL}/${HASH}/${nesting}`)).toBe(
			`${HASH}/${nesting}`,
		);
		expect(getHashFromIPFSUrl(`${`${WEB_URL}/${HASH}/4`}`)).toBe(`${HASH}/4`);
	});

	it('should handle URLs containing Qm', () => {
		expect(getHashFromIPFSUrl('test.com/Qm/' + HASH)).toBe(HASH);
		expect(getHashFromIPFSUrl('Qm.com/' + HASH)).toBe(HASH);
		expect(getHashFromIPFSUrl('test.com/' + HASH + '/Qm')).toBe(HASH + '/Qm');
		expect(getHashFromIPFSUrl('ipfs.com/Qmg/' + HASH + '/test')).toBe(
			HASH + '/test',
		);
	});
});

describe('getWebIPFSUrlFromHash', () => {
	it('should append hash to default IPFS gateway URL', () => {
		expect(getWebIPFSUrlFromHash(HASH)).toBe(DEFAULT_IPFS_GATEWAY + HASH);
	});
});
