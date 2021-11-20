import { AppState } from 'store';
import { REDUCER_NAME } from './reducer';
import { getCurrency } from './selectors';
import { currencyReady } from './currency.mockData';

describe('currency.selectors', () => {
	it('should return currency from state', () => {
		const currency = getCurrency({
			[REDUCER_NAME]: currencyReady,
		} as AppState);
		expect(currency).toEqual(currencyReady);
	});
});
