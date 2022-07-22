import { Maybe } from './types';

const tokenPriceChangeCache: { [token: string]: number | undefined } = {};

export const tokenPricePercentageChange = async (
	token: string,
): Promise<number> => {
	if (tokenPriceChangeCache[token]) {
		return tokenPriceChangeCache[token]!;
	}

	let pricePercentageChange: Maybe<number>;

	if (token === 'LOOT') {
		pricePercentageChange = 0;
	} else {
		const res = await fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd&include_24hr_change=true`,
		);

		const data = await res.json();

		if (!data[token]) {
			throw Error(`Unable to fetch price percentage change for ${token}`);
		}

		pricePercentageChange = data[token].usd_24h_change as number;
	}

	tokenPriceChangeCache[token] = pricePercentageChange;

	return pricePercentageChange;
};

// Token Price Percentage Changes
export const wildPricePercentageChange = async () => {
	return await tokenPricePercentageChange('wilder-world');
};

export const zeroPricePercentageChange = async () => {
	return await tokenPricePercentageChange('zero-tech');
};
