import { parseEther } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import { displayEtherToFiat, toFiat, displayEther } from './currency';

//////////////////////
// f:: displayEther //
//////////////////////

describe('displayEther', () => {
	it('should convert to locale string', () => {
		expect(displayEther(BigNumber.from(parseEther('1000')))).toBe('1,000.00');
	});

	it('should apply default 2 dp', () => {
		expect(displayEther(BigNumber.from(parseEther('10')))).toBe('10.00');
	});

	it('should handle specified dp', () => {
		expect(displayEther(BigNumber.from(parseEther('10')), 3)).toBe('10.000');
	});

	it('should handle zero', () => {
		expect(displayEther(BigNumber.from(parseEther('0')))).toBe('0.00');
	});

	it('should handle negative numbers', () => {
		expect(displayEther(BigNumber.from(parseEther('-10')))).toBe('-10.00');
	});
});

////////////////
// f:: toFiat //
////////////////

describe('toFiat', () => {
	it('should convert to locale string', () => {
		expect(toFiat(1000)).toBe('1,000.00');
	});

	it('should handle zero', () => {
		expect(toFiat(0)).toBe('0.00');
	});

	it('should handle negative numbers', () => {
		expect(toFiat(-10)).toBe('-10.00');
	});
});

////////////////////////////
// f:: displayEtherToFiat //
////////////////////////////

describe('displayEtherToFiat', () => {
	const defaultEtherAmount = BigNumber.from(parseEther('100'));

	it('should apply 2dp', () => {
		expect(displayEtherToFiat(defaultEtherAmount, 1)).toBe('100.00');
	});

	it('should multiply number by conversion rate', () => {
		expect(displayEtherToFiat(defaultEtherAmount, 5)).toBe('500.00');
	});

	it('should convert to locale string', () => {
		expect(displayEtherToFiat(defaultEtherAmount, 10)).toBe('1,000.00');
	});

	it('should handle zero', () => {
		expect(displayEtherToFiat(BigNumber.from(0), 10)).toBe('0.00');
	});

	it('should handle negatives', () => {
		const negative = BigNumber.from(parseEther('-1'));
		expect(displayEtherToFiat(negative, 10)).toBe('-10.00');
	});
});
