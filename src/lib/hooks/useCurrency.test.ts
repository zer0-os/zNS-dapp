import { renderHook } from 'lib/testUtils';
import {
	getWildPriceUsdRequest as reduxGetWildPriceUsdRequest,
	getLootPriceUsdRequest as reduxGetLootPriceUsdRequest,
	getZeroPriceUsdRequest as reduxGetZeroPriceUsdRequest,
	getWildPricePercentageChangeRequest as reduxGetWildPricePercentageChangeRequest,
	getZeroPricePercentageChangeRequest as reduxGetZeroPricePercentageChangeRequest,
} from 'store/currency/actions';
import { currencyReady } from 'store/currency/currency.mockData';
import useCurrency, { CurrencyHook } from './useCurrency';

jest.mock('store/currency/actions', () => ({
	getWildPriceUsdRequest: jest.fn(),
	getLootPriceUsdRequest: jest.fn(),
	getZeroPriceUsdRequest: jest.fn(),
	getWildPricePercentageChangeRequest: jest.fn(),
	getZeroPricePercentageChangeRequest: jest.fn(),
}));

describe('useCurrency', () => {
	beforeEach(() => {
		const mockWildPriceUsdRequest = {
			type: 'getWildPriceUsdRequest',
		};
		const mockLootPriceUsdRequest = {
			type: 'getLootPriceUsdRequest',
		};
		const mockZeroPriceUsdRequest = {
			type: 'getZeroPriceUsdRequest',
		};
		const mockWildPricePercentageChangeRequest = {
			type: 'getWildPricePercentageChangeRequest',
		};
		const mockZeroPricePercentageChangeRequest = {
			type: 'getZeroPricePercentageChangeRequest',
		};

		(reduxGetWildPriceUsdRequest as jest.Mock).mockReturnValueOnce(
			mockWildPriceUsdRequest,
		);
		(reduxGetLootPriceUsdRequest as jest.Mock).mockReturnValueOnce(
			mockLootPriceUsdRequest,
		);
		(reduxGetZeroPriceUsdRequest as jest.Mock).mockReturnValueOnce(
			mockZeroPriceUsdRequest,
		);
		(reduxGetWildPricePercentageChangeRequest as jest.Mock).mockReturnValueOnce(
			mockWildPricePercentageChangeRequest,
		);
		(reduxGetZeroPricePercentageChangeRequest as jest.Mock).mockReturnValueOnce(
			mockZeroPricePercentageChangeRequest,
		);
	});

	it('should return an expected currency data', () => {
		const {
			wildPriceUsd,
			lootPriceUsd,
			zeroPriceUsd,
			wildPercentageChange,
			zeroPercentageChange,
		} = renderHook(() => useCurrency()) as CurrencyHook;

		expect(wildPriceUsd).toEqual(currencyReady.wildPriceUsd);
		expect(lootPriceUsd).toEqual(currencyReady.lootPriceUsd);
		expect(zeroPriceUsd).toEqual(currencyReady.zeroPriceUsd);
		expect(wildPercentageChange).toEqual(currencyReady.wildPercentageChange);
		expect(zeroPercentageChange).toEqual(currencyReady.zeroPercentageChange);
	});

	it('should dispatch getWildPriceUsdRequest, getLootPriceUsdRequest, getZeroPriceUsdRequest, getWildPricePercentageChangeRequest and getWildPricePercentageChangeRequest actions', () => {
		renderHook(() => useCurrency());

		expect(reduxGetWildPriceUsdRequest).toHaveBeenCalledTimes(1);
		expect(reduxGetLootPriceUsdRequest).toHaveBeenCalledTimes(1);
		expect(reduxGetZeroPriceUsdRequest).toHaveBeenCalledTimes(1);
		expect(reduxGetWildPricePercentageChangeRequest).toHaveBeenCalledTimes(1);
		expect(reduxGetZeroPricePercentageChangeRequest).toHaveBeenCalledTimes(1);
	});
});
