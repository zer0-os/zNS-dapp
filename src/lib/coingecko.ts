const tokenToUsdCache: { [token: string]: any | undefined } = {};

export const tokenToUsd = async (token: string) => {
	if (tokenToUsdCache[token]) {
		return tokenToUsdCache[token];
	}

	return new Promise((resolve, reject) => {
		fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`,
		)
			.then((d) => d.json())
			.then((d) => {
				if (!d) return reject(d);
				tokenToUsdCache[token] = d[token].usd;
				resolve(d[token].usd);
			});
	});
};

let wildTokenPriceCache: number | undefined;

// @todo caching
// @todo regularly poll for USD price
export const wildToUsd = async (amount: number) => {
	try {
		let price = wildTokenPriceCache;

		if (!price) {
			const response = await fetch(
				`https://api.coingecko.com/api/v3/simple/price?ids=wilder-world&vs_currencies=usd`,
			);
			price = (await response.json())['wilder-world'].usd as number;
			wildTokenPriceCache = price;
		}

		return amount * price;
	} catch (e) {
		console.error('Failed to retrieve price data for WILD token');
		return;
	}
};
