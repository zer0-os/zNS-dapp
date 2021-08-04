import { ethers } from 'ethers';
import { Mutex } from 'async-mutex';

export interface NftIdBidsDto {
	account: string;
	signedMessage: string;
	auctionId: string;
	bidAmount: string;
	minimumBid: string;
	startBlock: string;
	expireBlock: string;
}

export interface AccountBidsDto {
	signedMessage: string;
	auctionId: string;
	bidAmount: string;
	contractAddress: string;
	tokenId: string;
	minimumBid: string;
	startBlock: string;
	expireBlock: string;
}

interface BidPayloadPostInterface {
	bidAmount: string;
	tokenId: string;
	contractAddress: string;
	minimumBid: string;
	startBlock: string;
	expireBlock: string;
}

interface CreateBidDto {
	payload: string;
	auctionId: number;
	nftId: string;
}

interface BidPostInterface {
	account: string;
	auctionId: string;
	tokenId: string;
	contractAddress: string;
	bidAmount: string;
	minimumBid: string;
	startBlock: string;
	expireBlock: string;
	signedMessage: string;
}

function getApiEndpoints(baseApiUri: string) {
	const encodeBidEndpoint = `${baseApiUri}/bid/`;
	const bidsEndpoint = `${baseApiUri}/bids/`;
	const bidListEndpoint = `${baseApiUri}lists?`;
	const accountBidsEndpoint = `${baseApiUri}accounts/`;

	return {
		encodeBidEndpoint,
		bidsEndpoint,
		bidListEndpoint,
		accountBidsEndpoint,
	};
}

function getNftId(contract: string, tokenId: string) {
	const idString = contract + tokenId;
	const idStringBytes = ethers.utils.toUtf8Bytes(idString);
	const nftId = ethers.utils.keccak256(idStringBytes);
	return nftId;
}

//
// Getting bids for a specified NFT
// @todo this is messy - rewrite
//

type ApiCall = {
	nftId: string;
	observers: any;
};

const pendingApiCalls: ApiCall[] = [];
const pendingApiCallsLock = new Mutex();

const removeApiCallFromPending = (apiCall: ApiCall) =>
	pendingApiCalls.splice(pendingApiCalls.indexOf(apiCall), 1);

export async function getBidsForNft(
	baseApiUri: string,
	contract: string,
	tokenId: string,
) {
	const nftId = getNftId(contract, tokenId);

	// Check if there's a pending API call for this NFT's bid data
	const release = await pendingApiCallsLock.acquire();
	const pendingResponses = pendingApiCalls.filter((x) => x.nftId === nftId);
	const hasPendingResponse = pendingResponses.length > 0;

	if (hasPendingResponse) {
		// Subscribe to the resolve of the outstanding API call
		const pendingResponse = pendingResponses[0];
		const bids = await new Promise(async (resolve, reject) => {
			// let release = await pendingApiCallsLock.acquire();
			pendingResponse.observers.push(resolve);
			release();
		});
		return bids;
	} else {
		// Add API call to pending calls,
		const apiCall = { nftId, observers: [] };
		try {
			// Add the API call to the pending array
			pendingApiCalls.push(apiCall);
			release();

			// Make the API call
			const endpoints = getApiEndpoints(baseApiUri);
			const response = await fetch(`${endpoints.bidsEndpoint}${nftId}`, {
				method: 'GET',
			});
			const data = await response.json();
			const bids = data.bids !== undefined ? (data.bids as NftIdBidsDto[]) : [];

			// Call resolve of all observers, then remove from pending
			apiCall.observers.forEach((observer: any) => observer(bids));
			removeApiCallFromPending(apiCall);

			return bids;
		} catch {
			// Clean up the array if anything failed
			let release = await pendingApiCallsLock.acquire();
			removeApiCallFromPending(apiCall);
			release();
			return;
		}
	}
}

export async function getBidsForAccount(baseApiUri: string, id: string) {
	let endpoints = getApiEndpoints(baseApiUri);
	const response = await fetch(endpoints.accountBidsEndpoint + id);
	const bids = (await response.json()) as AccountBidsDto[];
	return bids;
}

async function encodeBid(
	baseApiUri: string,
	bid: BidPayloadPostInterface,
): Promise<CreateBidDto> {
	if (!ethers.utils.isAddress(bid.contractAddress)) {
		throw Error(`Invalid contract address ${bid.contractAddress}`);
	}
	let endpoints = getApiEndpoints(baseApiUri);
	const response = await fetch(endpoints.encodeBidEndpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(bid),
	});

	const data = (await response.json()) as CreateBidDto;
	return data;
}

async function sendBid(
	baseApiUri: string,
	nftId: string,
	bid: BidPostInterface,
) {
	if (!ethers.utils.isAddress(bid.contractAddress)) {
		throw Error(`Invalid contract address ${bid.contractAddress}`);
	}
	let endpoints = getApiEndpoints(baseApiUri);
	await fetch(`${endpoints.bidsEndpoint}${nftId}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(bid),
	});
}

export async function placeBid(
	baseApiUri: string,
	provider: ethers.providers.Web3Provider,
	contract: string,
	tokenId: string,
	amount: string,
) {
	const signer = provider.getSigner();
	const minimumBid = '0';
	const startBlock = '0';
	const expireBlock = '999999999999';

	const bidData = await encodeBid(baseApiUri, {
		contractAddress: contract,
		tokenId,
		bidAmount: amount,
		minimumBid,
		startBlock,
		expireBlock,
	});

	const signedBid = await signer.signMessage(
		ethers.utils.arrayify(bidData.payload),
	);

	await sendBid(baseApiUri, bidData.nftId, {
		account: await provider.getSigner().getAddress(),
		auctionId: bidData.auctionId.toString(),
		tokenId,
		contractAddress: contract,
		bidAmount: amount,
		minimumBid,
		startBlock,
		expireBlock,
		signedMessage: signedBid,
	});
}
