import { ethers } from 'ethers';

const bidEndpoint = 'https://zproxy.ilios.dev/api/bids/';

export const getBidsForNft = (nftId: string) => {
	return new Promise((resolve, reject) => {
		if (!nftId.length) reject('Did not provide NFT address');

		// @durien

		return;

		fetch(bidEndpoint + nftId)
			.then((response) => console.log(response))
			.catch((error) => console.error(error));
	});
};
