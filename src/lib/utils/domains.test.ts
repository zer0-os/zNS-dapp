import { getAspectRatioForZna, getNetworkZNA, getParentZna } from './domains';
import { AspectRatio } from 'constants/aspectRatios';

//////////////////////////////
// f:: getAspectRatioForZna //
//////////////////////////////

/**
 * These tests are flaky and could be improved!
 */
describe('getAspectRatioForZna', () => {
	it('should get correct aspect ratio from zNA', () => {
		expect(getAspectRatioForZna('wilder.wheels')).toBe(AspectRatio.LANDSCAPE);
		expect(getAspectRatioForZna('wilder.cribs')).toBe(AspectRatio.LANDSCAPE);
		expect(getAspectRatioForZna('wilder.WoW')).toBe(AspectRatio.PORTRAIT);
	});

	it('should return undefined if no aspect ratio found', () => {
		expect(getAspectRatioForZna('')).toBeUndefined();
	});
});

//////////////////////
// f:: getParentZna //
//////////////////////

describe('getParentZna', () => {
	it('should get parent zNA', () => {
		expect(getParentZna('testparent.testchild')).toBe('testparent');
	});

	it('should get parent zNA from deeply nested zNA', () => {
		const parent = 'one.two.three.four.five.six.seven.eight.nine';
		const zna = parent + '.ten';
		expect(getParentZna(zna)).toBe(parent);
	});

	it('should handle root zNAs', () => {
		expect(getParentZna('test')).toBe('test');
	});
});

//////////////////////
// f:: getNetworkZNA //
//////////////////////

describe('getNetworkZNA', () => {
	describe('Default Network (no network set)', () => {
		const env = import.meta.env;

		beforeEach(() => {
			jest.resetModules();
			import.meta.env = { ...env, VITE_NETWORK: '' };
		});

		afterEach(() => {
			import.meta.env = env;
		});

		it('mock VITE_NETWORK success', () => {
			expect(import.meta.env.VITE_NETWORK).toBe('');
			expect(import.meta.env.VITE_NETWORK).not.toBe('wilder');
		});

		it('when .env network variable is not set - two subdomains', () => {
			expect(getNetworkZNA('wilder.dogs.beast')).toBe('wilder.dogs.beast');
		});

		it('when .env network variable is not set - one subdomain', () => {
			expect(getNetworkZNA('wilder.cats')).toBe('wilder.cats');
		});

		it('when .env network variable is not set - no subdomains', () => {
			expect(getNetworkZNA('wilder')).toBe('wilder');
		});
	});

	describe('Network Variable (network set)', () => {
		const env = import.meta.env;

		beforeEach(() => {
			jest.resetModules();
			import.meta.env = { ...env, VITE_NETWORK: 'wilder' };
		});

		afterEach(() => {
			import.meta.env = env;
		});

		it('mock VITE_NETWORK success', () => {
			expect(import.meta.env.VITE_NETWORK).toBe('wilder');
			expect(import.meta.env.VITE_NETWORK).not.toBe('');
		});

		it('when .env network variable is set - two subdomains', () => {
			expect(getNetworkZNA('wilder.dogs.beast')).toBe('dogs.beast');
		});

		it('when .env network variable is set - one subdomain', () => {
			expect(getNetworkZNA('wilder.dogs')).toBe('dogs');
		});

		it('when .env network variable is set - no subdomains', () => {
			expect(getNetworkZNA('wilder')).toBe('');
		});
	});
});
