import { ethers } from 'ethers';
import { createTimeCache } from './utils/timeCache';
import { Mutex } from 'async-mutex';
import { Maybe } from './types';

export interface BidDto {
	account: string;
	signedMessage: string;
	auctionId: string;
	bidAmount: string;
	minimumBid: string;
	startBlock: string;
	expireBlock: string;
	date: number;
	tokenId: string;
	contractAddress: string;
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
	const encodeBidEndpoint = `${baseApiUri}/bid`;
	const bidsEndpoint = `${baseApiUri}/bids`;
	const bidListEndpoint = `${bidsEndpoint}/list`;
	const accountBidsEndpoint = `${bidsEndpoint}/accounts/`;

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

const getBidsForNftCache = createTimeCache<BidDto[]>(cacheExpiration);

const cacheKeyForNftBids = (baseApiUri: string, nftId: string) => {
	return `${baseApiUri}|${nftId}`;
};

interface ApiCallObserver<T> {
	resolve: (result: T) => void;
	reject: (reason?: string) => void;
}

interface ApiCall<T> {
	nftId: string;
	observers: ApiCallObserver<T>[];
	lock: Mutex;
}

interface ApiCalls<T> {
	[key: string]: ApiCall<T> | undefined;
}

const getBidsForNftApiCalls: ApiCalls<BidDto[]> = {};
const getBidsForNftApiCallsLock: Mutex = new Mutex();

const removeGetBidsForNftApiCalls = (key: string) => {
	getBidsForNftApiCalls[key] = undefined;
};

export async function getBidsForNft(
	baseApiUri: string,
	contract: string,
	tokenId: string,
): Promise<BidDto[]> {
	const nftId = getNftId(contract, tokenId);
	const cacheKey = cacheKeyForNftBids(baseApiUri, nftId);

	if (getBidsForNftCache.exists(cacheKey)) {
		return getBidsForNftCache.get(cacheKey);
	}

	// Check if there's a pending API call for this NFT's bid data
	let releaseApiCallsLock = await getBidsForNftApiCallsLock.acquire();
	const pendingResponse = getBidsForNftApiCalls[cacheKey];

	if (pendingResponse) {
		const releaseObserversLock = await pendingResponse.lock.acquire();
		releaseApiCallsLock();

		// Subscribe to the resolve of the outstanding API call
		const bids = await new Promise<BidDto[]>(async (resolve, reject) => {
			pendingResponse.observers.push({ resolve, reject });
			releaseObserversLock();
		});

		return bids;
	}

	// Add API call to pending calls,
	const apiCall = { nftId, observers: [], lock: new Mutex() } as ApiCall<
		BidDto[]
	>;
	getBidsForNftApiCalls[cacheKey] = apiCall;
	releaseApiCallsLock();

	let bids: BidDto[] | undefined;
	let error: Maybe<string>;

	try {
		// Make the API call
		const endpoints = getApiEndpoints(baseApiUri);
		const response = await fetch(`${endpoints.bidsEndpoint}/${nftId}`, {
			method: 'GET',
		});
		const data = await response.json();
		bids = data !== undefined ? (data as BidDto[]) : [];
		getBidsForNftCache.put(cacheKey, bids);
	} catch (e: any) {
		error = `Failed to fetch bids for nft: ${e}`;
	}

	releaseApiCallsLock = await getBidsForNftApiCallsLock.acquire();
	removeGetBidsForNftApiCalls(cacheKey);
	releaseApiCallsLock();

	const releaseApiCallInstanceLock = await apiCall.lock.acquire();
	apiCall.observers.forEach((observer) => {
		if (error) {
			observer.reject(error);
			return;
		}

		if (bids === undefined) {
			observer.reject('undefined bids');
			return;
		}

		observer.resolve(bids);
	});
	releaseApiCallInstanceLock();

	if (error) {
		throw Error(error);
	}

	return bids as BidDto[];
}

const getBidsForAccountCache = createTimeCache<BidDto[]>(cacheExpiration);

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
	const bids = (await response.json()) as BidDto[];

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

async function sendBid(baseApiUri: string, bid: BidPostInterface) {
	if (!ethers.utils.isAddress(bid.contractAddress)) {
		throw Error(`Invalid contract address ${bid.contractAddress}`);
	}
	let endpoints = getApiEndpoints(baseApiUri);
	await fetch(`${endpoints.bidsEndpoint}`, {
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
	onStep: (status: string) => void,
) {
	const signer = provider.getSigner();
	const minimumBid = '0';
	const startBlock = '0';
	const expireBlock = '999999999999';

	onStep('Generating bid...');

	let bidData: Maybe<CreateBidDto>;

	try {
		bidData = await encodeBid(baseApiUri, {
			contractAddress: contract,
			tokenId,
			bidAmount: amount,
			minimumBid,
			startBlock,
			expireBlock,
		});
	} catch (e: any) {
		console.error(e);
		throw Error(`Failed to generate bid.`);
	}

	const account = await provider.getSigner().getAddress();

	onStep('Waiting for bid to be signed by wallet...');

	let signedBid: Maybe<string>;

	try {
		signedBid = await signer.signMessage(
			ethers.utils.arrayify(bidData.payload),
		);
	} catch (e: any) {
		console.error(e);
		throw Error(`Bid was not signed by wallet.`);
	}

	onStep('Submitting bid...');

	let finishedSending = false;

	setTimeout(() => {
		if (finishedSending) {
			return;
		}

		onStep('Validating bid...');
	}, 1500);

	try {
		await sendBid(baseApiUri, {
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
	} catch (e: any) {
		console.error(e);
		throw Error(`Failed to submit bid.`);
	}

	finishedSending = true;

	// clear out cache for that NFT and the user's bids
	{
		const bidsCacheKey = cacheKeyForNftBids(baseApiUri, bidData.nftId);
		getBidsForNftCache.clearKey(bidsCacheKey);

		const accountCacheKey = cacheKeyForAccountBids(baseApiUri, account);
		getBidsForAccountCache.clearKey(accountCacheKey);
	}
}
