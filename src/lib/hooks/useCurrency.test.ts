import { renderHook } from 'lib/testUtils';
import {
	getWildPriceUsdRequest as reduxGetWildPriceUsdRequest,
	getLootPriceUsdRequest as reduxGetLootPriceUsdRequest,
	getWildPricePercentageChangeRequest as reduxGetWildPricePercentageChangeRequest,
} from 'store/currency/actions';
import { currencyReady } from 'store/currency/currency.mockData';
import useCurrency, { CurrencyHook } from './useCurrency';

jest.mock('store/currency/actions', () => ({
	getWildPriceUsdRequest: jest.fn(),
	getLootPriceUsdRequest: jest.fn(),
	getWildPricePercentageChangeRequest: jest.fn(),
}));

describe('useCurrency', () => {
	beforeEach(() => {
		const mockAction1 = {
			type: 'getWildPriceUsdRequest',
		};
		const mockAction2 = {
			type: 'getLootPriceUsdRequest',
		};
		const mockAction3 = {
			type: 'getWildPricePercentageChangeRequest',
		};

		(reduxGetWildPriceUsdRequest as jest.Mock).mockReturnValueOnce(mockAction1);
		(reduxGetLootPriceUsdRequest as jest.Mock).mockReturnValueOnce(mockAction2);
		(reduxGetWildPricePercentageChangeRequest as jest.Mock).mockReturnValueOnce(
			mockAction3,
		);
	});

	it('should return an expected currency data', () => {
		const { wildPriceUsd, lootPriceUsd, wildPercentageChange } = renderHook(
			() => useCurrency(),
		) as CurrencyHook;

		expect(wildPriceUsd).toEqual(currencyReady.wildPriceUsd);
		expect(lootPriceUsd).toEqual(currencyReady.lootPriceUsd);
		expect(wildPercentageChange).toEqual(currencyReady.wildPercentageChange);
	});

	it('should dispatch getWildPriceUsdRequest, getLootPriceUsdRequest and getWildPricePercentageChangeRequest actions', () => {
		renderHook(() => useCurrency());

		expect(reduxGetWildPriceUsdRequest).toHaveBeenCalledTimes(1);
		expect(reduxGetLootPriceUsdRequest).toHaveBeenCalledTimes(1);
		expect(reduxGetWildPricePercentageChangeRequest).toHaveBeenCalledTimes(1);
	});
});
