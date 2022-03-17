// Global Utils Imports
import { formatByDecimalPlace } from '.';

describe('number', () => {
	describe('formatByDecimalPlace', () => {
		const { language } = navigator;

		afterEach(() => {
			Object.defineProperty(navigator, 'language', {
				value: language,
				writable: true,
			});
			Object.defineProperty(navigator, 'userLanguage', {
				value: language,
				writable: true,
			});
		});

		it('should correctly add two decimal places to an integer when passed two places', () => {
			expect(formatByDecimalPlace(10, 2)).toEqual('10.00');
			expect(formatByDecimalPlace('10', 2)).toEqual('10.00');
		});

		it('should correctly add one decimal places to an integer when passed one place', () => {
			expect(formatByDecimalPlace(10, 1)).toEqual('10.0');
			expect(formatByDecimalPlace('10', 1)).toEqual('10.0');
		});

		it('should correctly add three decimal places to an integer when passed three places', () => {
			expect(formatByDecimalPlace(10, 3)).toEqual('10.000');
			expect(formatByDecimalPlace('10', 3)).toEqual('10.000');
		});

		it('should correctly add thousand separators', () => {
			expect(formatByDecimalPlace(1000000, 1)).toEqual('1,000,000.0');
			expect(formatByDecimalPlace('1000000', 1)).toEqual('1,000,000.0');
			expect(formatByDecimalPlace(10000, 1)).toEqual('10,000.0');
			expect(formatByDecimalPlace('10000', 1)).toEqual('10,000.0');
			expect(formatByDecimalPlace(1000, 1)).toEqual('1,000.0');
			expect(formatByDecimalPlace('1000', 1)).toEqual('1,000.0');
		});

		it('should not add thousand separators to numbers lower than 1000', () => {
			expect(formatByDecimalPlace(9, 2)).toEqual('9.00');
			expect(formatByDecimalPlace('9', 2)).toEqual('9.00');
			expect(formatByDecimalPlace(99, 2)).toEqual('99.00');
			expect(formatByDecimalPlace('99', 2)).toEqual('99.00');
			expect(formatByDecimalPlace(999, 2)).toEqual('999.00');
			expect(formatByDecimalPlace('999', 2)).toEqual('999.00');
		});

		it('should correctly add thousand separators and one decimal place for floating point numbers', () => {
			expect(formatByDecimalPlace(99999.9, 1)).toEqual('99,999.9');
			expect(formatByDecimalPlace('99999.9', 1)).toEqual('99,999.9');
			expect(formatByDecimalPlace(99999.1, 1)).toEqual('99,999.1');
			expect(formatByDecimalPlace('99999.1', 1)).toEqual('99,999.1');
		});

		it('should not add thousand separators to floating point numbers lower than 1000', () => {
			expect(formatByDecimalPlace(5.5, 2)).toEqual('5.50');
			expect(formatByDecimalPlace('5.5', 2)).toEqual('5.50');
			expect(formatByDecimalPlace(55.532222222, 2)).toEqual('55.53');
			expect(formatByDecimalPlace('55.532222222', 2)).toEqual('55.53');
			expect(formatByDecimalPlace(999.681, 2)).toEqual('999.68');
			expect(formatByDecimalPlace('999.681', 2)).toEqual('999.68');
		});

		it('should apply standard rounding to floating point numbers', () => {
			expect(formatByDecimalPlace(9999.00001, 1)).toEqual('9,999.0');
			expect(formatByDecimalPlace(9999.99, 1)).toEqual('10,000.0');
		});

		it('should return 0.00 if zero values are supplied', () => {
			expect(formatByDecimalPlace(0, 2)).toEqual('0.00');
			expect(formatByDecimalPlace(0.0, 2)).toEqual('0.00');
			expect(formatByDecimalPlace('0', 2)).toEqual('0.00');
			expect(formatByDecimalPlace('0.0', 2)).toEqual('0.00');
		});

		it('should return 0.0 if zero values are supplied', () => {
			expect(formatByDecimalPlace(0, 1)).toEqual('0.0');
			expect(formatByDecimalPlace(0.0, 1)).toEqual('0.0');
			expect(formatByDecimalPlace('0', 1)).toEqual('0.0');
			expect(formatByDecimalPlace('0.0', 1)).toEqual('0.0');
		});

		it('should support different user locales - English', () => {
			expect(formatByDecimalPlace(12345.67, 2, 'en')).toEqual('12,345.67');
		});

		it('should support different user locales - French', () => {
			expect(formatByDecimalPlace(12345.67, 2, 'fr-FR')).toEqual('12 345,67');
		});

		it('should support different user locales - Italian', () => {
			expect(formatByDecimalPlace(12345.67, 2, 'it-IT')).toEqual('12.345,67');
		});

		it('should fallback to the browser locale if no locale code is specified', () => {
			Object.defineProperty(navigator, 'language', {
				value: 'de',
				writable: true,
			});
			Object.defineProperty(navigator, 'userLanguage', {
				value: 'de',
				writable: true,
			});

			const actual = formatByDecimalPlace(12345.67, 2);
			expect(actual).toEqual('12,345.67');
		});
	});
});
