const bidEndpoint = 'https://zproxy.ilios.dev/api/bid/';
const bidsEndpoint = 'https://zproxy.ilios.dev/api/bids/';

export const getBidsForNft = (nftId: string) => {
	return new Promise((resolve, reject) => {
		if (!nftId.length) reject('Did not provide NFT address');
		// @todo
		return;
	});
};

export const placeBid = (nftId: string, amount: number) => {
	return new Promise((resolve, reject) => {
		if (!nftId.length || amount <= 0) return reject('Invalid values');
		// @todo
		return;
	});
};

export const encodeBid = (contractAddress: string, tokenId: string) => {
	return new Promise((resolve, reject) => {
		if (!contractAddress.length || !tokenId.length)
			return reject('Invalid values');

		const body = stringify({
			bidAmt: 100,
			contractAddress: contractAddress,
			tokenId: BigInt(tokenId),
			minBid: 0,
			startBlock: 0,
			expireBlock: 99999999999,
		});

		console.log(body);

		fetch(bidEndpoint, {
			method: 'POST',
			body: body,
		}).then((response) => console.log(response));
	});
};

// @todo rewrite this - it's a very quick hack
function stringify(obj: any) {
	var stringified = '{';
	const keys = Object.keys(obj);
	const lastKey = keys[keys.length - 1];
	keys.forEach((key: any) => {
		if (typeof obj[key] === 'bigint') stringified += `"${key}": ${obj[key]}`;
		else if (typeof obj[key] === 'string')
			stringified += `"${key}": "${obj[key]}"`;
		else stringified += `"${key}": ${obj[key]}`;
		if (key !== lastKey) stringified += ',';
	});
	stringified += '}';
	return stringified;
}
