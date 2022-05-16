import { getAspectRatioForZna, getParentZna, parseZNA } from './domains';
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
// f:: parseZNA //
//////////////////////

describe('parseZNA', () => {
	it('when .env network variable is not set - Default Network - two subdomains', () => {
		expect(parseZNA('', 'wilder.dogs.beast')).toBe('wilder.dogs.beast');
	});

	it('when .env network variable is not set - Default Network - one subdomain', () => {
		expect(parseZNA('', 'wilder.cats')).toBe('wilder.cats');
	});

	it('when .env network variable is not set - Default Network - no subdomains', () => {
		expect(parseZNA('', 'wilder')).toBe('wilder');
	});

	it('when .env network variable is set - Network variable - two subdomains', () => {
		expect(parseZNA('testNetwork', 'wilder.dogs.beast')).toBe('dogs.beast');
	});

	it('when .env network variable is set - Network variable - one subdomain', () => {
		expect(parseZNA('testNetwork', 'wilder.dogs')).toBe('dogs');
	});

	it('when .env network variable is set - Network variable - no subdomains', () => {
		expect(parseZNA('testNetwork', 'wilder')).toBe('');
	});
});
