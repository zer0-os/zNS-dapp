export const tokenToUsd = (token: string) => {
	return new Promise((resolve, reject) => {
		fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`,
		)
			.then((d) => d.json())
			.then((d) => {
				if (!d) return reject(d);
				resolve(d[token].usd);
			});
	});
};

// @todo caching
// @todo regularly poll for USD price
export const wildToUsd = async (amount: number) => {
	try {
		const response = await fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=wilder-world&vs_currencies=usd`,
		);
		const conversion = (await response.json())['wilder-world'].usd;
		return amount * conversion;
	} catch (e) {
		console.error('Failed to retrieve price data for WILD token');
		return;
	}
};
