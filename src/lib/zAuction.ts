import { useZnsContracts } from 'lib/contracts';

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

export async function encodeBid(
	contractAddress: string,
	tokenId: string,
): Promise<any | undefined> {
	try {
		if (!contractAddress.length || !tokenId.length) return;
		const response = await fetch(bidEndpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				bidAmount: '100',
				contractAddress: contractAddress,
				tokenId: tokenId,
				minimumBid: '0',
				startBlock: '0',
				expireBlock: '99999999999',
			}),
		});
		const data = await response.json();
		return data;
	} catch (e) {
		console.error('Failed to retrieve data for ' + tokenId);
		return;
	}
}
