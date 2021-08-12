import { ethers } from 'ethers';
import { createTimeCache } from './utils/timeCache';
import { Mutex } from 'async-mutex';

export interface NftIdBidsDto {
	account: string;
	signedMessage: string;
	auctionId: string;
	bidAmount: string;
	minimumBid: string;
	startBlock: string;
	expireBlock: string;
	date: string;
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
	date: string;
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
	const bidListEndpoint = `${baseApiUri}/lists?`;
	const accountBidsEndpoint = `${bidsEndpoint}accounts/`;

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

const cacheExpiration = 60 * 1000; // 60 seconds

const getBidsForNftCache = createTimeCache<NftIdBidsDto[]>(cacheExpiration);

const cacheKeyForNftBids = (baseApiUri: string, nftId: string) => {
	return `${baseApiUri}|${nftId}`;
};
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
): Promise<NftIdBidsDto[] | undefined> {
	const nftId = getNftId(contract, tokenId);
	const cacheKey = cacheKeyForNftBids(baseApiUri, nftId);

	if (getBidsForNftCache.exists(cacheKey)) {
		return getBidsForNftCache.get(cacheKey);
	}

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
		return bids as NftIdBidsDto[];
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

			return bids as NftIdBidsDto[];
		} catch {
			// Clean up the array if anything failed
			let release = await pendingApiCallsLock.acquire();
			apiCall.observers.forEach((observer: any) => observer(undefined));
			removeApiCallFromPending(apiCall);
			release();
			return;
		}
	}
}

const getBidsForAccountCache =
	createTimeCache<AccountBidsDto[]>(cacheExpiration);

const cacheKeyForAccountBids = (baseApiUri: string, account: string) => {
	return `${baseApiUri}|${account}`;
};

export async function getBidsForAccount(baseApiUri: string, id: string) {
	const cacheKey = cacheKeyForAccountBids(baseApiUri, id);

	if (getBidsForAccountCache.exists(cacheKey)) {
		return getBidsForAccountCache.get(cacheKey);
	}

	const endpoints = getApiEndpoints(baseApiUri);
	const response = await fetch(`${endpoints.accountBidsEndpoint}${id}`);
	const bids = (await response.json()) as AccountBidsDto[];

	getBidsForAccountCache.put(cacheKey, bids);

	return bids;
}

export function clearCache() {
	getBidsForNftCache.clear();
	getBidsForAccountCache.clear();
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
): Promise<boolean> {
	if (!ethers.utils.isAddress(bid.contractAddress)) {
		throw Error(`Invalid contract address ${bid.contractAddress}`);
	}
	let endpoints = getApiEndpoints(baseApiUri);
	try {
		const response = await fetch(`${endpoints.bidsEndpoint}${nftId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(bid),
		});
		if (response.status === 200) return true;
		else return false;
	} catch {
		return false;
	}
}

export async function placeBid(
	baseApiUri: string,
	provider: ethers.providers.Web3Provider,
	contract: string,
	tokenId: string,
	amount: string,
): Promise<boolean | undefined> {
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

	const account = await provider.getSigner().getAddress();

	const signedBid = await signer.signMessage(
		ethers.utils.arrayify(bidData.payload),
	);

	const success = await sendBid(baseApiUri, bidData.nftId, {
		account,
		auctionId: bidData.auctionId.toString(),
		tokenId,
		contractAddress: contract,
		bidAmount: amount,
		minimumBid,
		startBlock,
		expireBlock,
		signedMessage: signedBid,
	});

	// clear out cache for that NFT and the user's bids
	{
		const bidsCacheKey = cacheKeyForNftBids(baseApiUri, bidData.nftId);
		getBidsForNftCache.clearKey(bidsCacheKey);

		const accountCacheKey = cacheKeyForAccountBids(baseApiUri, account);
		getBidsForAccountCache.clearKey(accountCacheKey);
	}
	return success;
}
