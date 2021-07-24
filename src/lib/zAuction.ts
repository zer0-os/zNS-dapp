import { ethers } from 'ethers';
import { useZnsContracts } from 'lib/contracts';
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';

const apiEndpoint = getApiEndpoint();//'https://zproxy.ilios.dev/api';

const encodeBidEndpoint = `${apiEndpoint}/bid/`;
const bidsEndpoint = `${apiEndpoint}/bids/`;
const accountBidsEndpoint = `${bidsEndpoint}accounts/`;

interface NftIdBidsDto {
	account: string,
	signedMessage: string,
	auctionId: string,
	bidAmount: string,
	minimumBid: string,
	startBlock: string,
	expireBlock: string,
}

interface AccountBidsDto {
	signedMessage: string,
	auctionId: string,
	bidAmount: string,
	contractAddress: string,
	tokenId: string,
	minimumBid: string,
	startBlock: string,
	expireBlock: string,
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

function getApiEndpoint() {
	let chain = useChainSelector().selectedChain;
	switch (chain) {
		case 1: return "https://zproxy.ilios.main/api";
		case 42: return "https://zproxy.ilios.dev/api";
		default: return "Unsupported Chain";
	}
}

function getNftId(contract: string, tokenId: string) {
	const idString = contract + tokenId;
	const idStringBytes = ethers.utils.toUtf8Bytes(idString);
	const nftId = ethers.utils.keccak256(idStringBytes);
	return nftId;
}

export async function getBidsForNft(contract: string, tokenId: string) {
	const nftId = getNftId(contract, tokenId);

	const response = await fetch(`${bidsEndpoint}${nftId}`, {
		method: 'GET',
	});

	const bids = (await response.json()) as NftIdBidsDto[];

	return bids;
}

export async function getBidsForAccount(id: string) {
	const response = await fetch(accountBidsEndpoint + id);
	const bids = (await response.json()) as AccountBidsDto[];
	return bids;
}

async function encodeBid(bid: BidPayloadPostInterface): Promise<CreateBidDto> {
	if (!ethers.utils.isAddress(bid.contractAddress)) {
		throw Error(`Invalid contract address ${bid.contractAddress}`);
	}

	const response = await fetch(encodeBidEndpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(bid),
	});

	const data = (await response.json()) as CreateBidDto;
	return data;
}

async function sendBid(nftId: string, bid: BidPostInterface) {
	if (!ethers.utils.isAddress(bid.contractAddress)) {
		throw Error(`Invalid contract address ${bid.contractAddress}`);
	}

	await fetch(`${bidsEndpoint}${nftId}`, {
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
) {
	const signer = provider.getSigner();
	const minimumBid = '0';
	const startBlock = '0';
	const expireBlock = '999999999999';

	const bidData = await encodeBid({
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

	await sendBid(bidData.nftId, {
		account: await provider.getSigner().getAddress(),
		auctionId: bidData.auctionId.toString(),
		tokenId,
		contractAddress: contract,
		bidAmount: amount,
		bidMessage: bidData.payload,
		minimumBid,
		startBlock,
		expireBlock,
		signedMessage: signedBid,
	});
}
