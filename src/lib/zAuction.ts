import { ethers } from 'ethers';

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

export interface NftBidDto {
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

interface TokenBids {
	[tokenId: string]: NftBidDto[] | undefined
   }

interface BidsListResponseDto {
	bids: NftBidDto[];
	contractAddress: string;
	tokenId: string;
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
	const bidListEndpoint = `${baseApiUri}/bids/list`;
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

export async function getBidsForNft(
	baseApiUri: string,
	contract: string,
	tokenId: string,
) {
	const nftId = getNftId(contract, tokenId);
	const endpoints = getApiEndpoints(baseApiUri);
	const response = await fetch(`${endpoints.bidsEndpoint}${nftId}`, {
		method: 'GET',
	});

	const bids = (await response.json()).bids as NftIdBidsDto[];

	return bids;
}

export async function getBidsListForNfts(
	baseApiUri: string,
	contract: string,
	tokenIds: string[],
) {

	const nftIds: string[] = tokenIds.map(function (id: any) {
		return getNftId(contract, id);
	})

	console.log(nftIds)

	const requestBody = { nftIds: nftIds }; //builds the correct body to send

	const endpoints = getApiEndpoints(baseApiUri);

	const response = await fetch(endpoints.bidListEndpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(requestBody),
	});

	const jsonResponse = (await response.json()) as BidsListResponseDto[]; //awaits the json of the response

	 const bidsMap = {} as TokenBids; //mapping of tokenId as key and returned bids as value

	jsonResponse.map(function (dto: any) {
		console.log("1")
		bidsMap[dto.tokenId] = dto.bids
	})
	console.log(bidsMap)
	return bidsMap;
}

export async function getBidsForAccount(baseApiUri: string, id: string) {
	const endpoints = getApiEndpoints(baseApiUri);
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
	const endpoints = getApiEndpoints(baseApiUri);
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
	const endpoints = getApiEndpoints(baseApiUri);
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
