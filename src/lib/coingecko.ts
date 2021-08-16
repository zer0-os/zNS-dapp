const tokenToUsdCache: { [token: string]: number | undefined } = {};

export const tokenToUsd = async (token: string): Promise<number> => {
	if (tokenToUsdCache[token]) {
		return tokenToUsdCache[token]!;
	}

	if (token === 'LOOT') {
		return 0.1;
	}

	return new Promise((resolve, reject) => {
		fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`,
		)
			.then((d) => d.json())
			.then((d) => {
				if (!d) return reject(d);
				tokenToUsdCache[token] = d[token].usd as number;
				resolve(d[token].usd);
			});
	});
};

export const wildToUsd = async (amount: number) => {
	let price = await tokenToUsd('wilder-world');

	return amount * price;
};
