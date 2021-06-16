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
