import { renderHook } from 'lib/testUtils';
import {
	getWildPriceUsdRequest as reduxGetWildPriceUsdRequest,
	getLootPriceUsdRequest as reduxGetLootPriceUsdRequest,
} from 'store/currency/actions';
import { currencyReady } from 'store/currency/currency.mockData';
import useCurrency, { CurrencyHook } from './useCurrency';

jest.mock('store/currency/actions', () => ({
	getWildPriceUsdRequest: jest.fn(),
	getLootPriceUsdRequest: jest.fn(),
}));

describe('useCurrency', () => {
	beforeEach(() => {
		const mockAction1 = {
			type: 'getWildPriceUsdRequest',
		};
		const mockAction2 = {
			type: 'getLootPriceUsdRequest',
		};

		(reduxGetWildPriceUsdRequest as jest.Mock).mockReturnValueOnce(mockAction1);
		(reduxGetLootPriceUsdRequest as jest.Mock).mockReturnValueOnce(mockAction2);
	});

	it('should return an expected currency data', () => {
		const { wildPriceUsd, lootPriceUsd } = renderHook(() =>
			useCurrency(),
		) as CurrencyHook;

		expect(wildPriceUsd).toEqual(currencyReady.wildPriceUsd);
		expect(lootPriceUsd).toEqual(currencyReady.lootPriceUsd);
	});

	it('should dispatch getWildPriceUsdRequest and getLootPriceUsdRequest actions', () => {
		renderHook(() => useCurrency());

		expect(reduxGetWildPriceUsdRequest).toHaveBeenCalledTimes(1);
		expect(reduxGetLootPriceUsdRequest).toHaveBeenCalledTimes(1);
	});
});
