import { isWilderWorldAppDomain } from './url';

describe('isWilderWorldAppDomain', () => {
	it.each`
		url                                      | expected
		${'http://app.wilderworld.com'}          | ${true}
		${'https://app.wilderworld.com'}         | ${true}
		${'https://app.wilderworld.com/market'}  | ${true}
		${'https://app.wilderworld.com/staking'} | ${true}
		${'http://wilderworld.com'}              | ${false}
		${'https://wilderworld.co.uk'}           | ${false}
		${'https://willllderworld'}              | ${false}
		${'https://zine.wilderworld.com'}        | ${false}
	`(
		'should return $expected for url $url',
		({ url, expected }: { url: string; expected: boolean }) => {
			expect(isWilderWorldAppDomain(url)).toBe(expected);
		},
	);
});
