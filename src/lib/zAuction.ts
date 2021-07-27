import { ethers } from 'ethers';
import { useZnsContracts } from 'lib/contracts';
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';

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

interface BidAcceptInterface {
	signedMessage: string;
	auctionId: string;
	account: string;
	bidAmount: string;
	contractAddress: string;
	tokenId: string;
	minimumBid: string;
	startBlock: string;
	expireBlock: string;
}

function setApiEndpoints(apiName: string) {
	const encodeBidEndpoint = `${apiName}/bid/`;
	const bidsEndpoint = `${apiName}/bids/`;
	const bidListEndpoint = `${apiName}lists?`;
	const accountBidsEndpoint = `${apiName}accounts/`;

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
	contract: string,
	tokenId: string,
	apiName: string,
) {
	const nftId = getNftId(contract, tokenId);
	let endpoints = setApiEndpoints(apiName);
	const response = await fetch(`${endpoints.bidsEndpoint}${nftId}`, {
		method: 'GET',
	});

	const bids = (await response.json()).bids as NftIdBidsDto[];

	return bids;
}

export async function getBidsForAccount(id: string, apiName: string) {
	let endpoints = setApiEndpoints(apiName);
	const response = await fetch(endpoints.accountBidsEndpoint + id);
	const bids = (await response.json()) as AccountBidsDto[];
	return bids;
}

async function encodeBid(
	bid: BidPayloadPostInterface,
	apiName: string,
): Promise<CreateBidDto> {
	if (!ethers.utils.isAddress(bid.contractAddress)) {
		throw Error(`Invalid contract address ${bid.contractAddress}`);
	}
	let endpoints = setApiEndpoints(apiName);
	const response = await fetch(endpoints.encodeBidEndpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(bid),
	});

	const data = (await response.json()) as CreateBidDto;
	return data;
}

async function sendBid(nftId: string, bid: BidPostInterface, apiName: string) {
	if (!ethers.utils.isAddress(bid.contractAddress)) {
		throw Error(`Invalid contract address ${bid.contractAddress}`);
	}
	let endpoints = setApiEndpoints(apiName);
	await fetch(`${endpoints.bidsEndpoint}${nftId}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(bid),
	});
}

export async function placeBid(
	provider: ethers.providers.Web3Provider,
	contract: string,
	tokenId: string,
	amount: string,
	apiName: string,
) {
	const signer = provider.getSigner();
	const minimumBid = '0';
	const startBlock = '0';
	const expireBlock = '999999999999';

	const bidData = await encodeBid(
		{
			contractAddress: contract,
			tokenId,
			bidAmount: amount,
			minimumBid,
			startBlock,
			expireBlock,
		},
		apiName,
	);

	const signedBid = await signer.signMessage(
		ethers.utils.arrayify(bidData.payload),
	);

	await sendBid(
		bidData.nftId,
		{
			account: await provider.getSigner().getAddress(),
			auctionId: bidData.auctionId.toString(),
			tokenId,
			contractAddress: contract,
			bidAmount: amount,
			minimumBid,
			startBlock,
			expireBlock,
			signedMessage: signedBid,
		},
		apiName,
	);
}
