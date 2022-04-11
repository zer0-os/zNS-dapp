// Library
import { toFiat } from 'lib/currency';

export const TEST_ID = {
	CONTAINER: 'actions-container',
	BUY_NOW: 'actions-buy-now',
	SET_BUY_NOW: 'actions-set-buy-now',
	BID: 'actions-bid',
	YOUR_BID: 'actions-your-bid',
};

export const wrapFiat = (number: number) => {
	return '$' + toFiat(number);
};
