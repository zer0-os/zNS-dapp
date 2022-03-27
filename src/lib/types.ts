// Types

//- Library Imports
import { ethers } from 'ethers';
import { ZAuctionVersionType } from './zAuction';

export type Maybe<T> = T | undefined | null;
export type MaybeUndefined<T> = T | undefined;

export interface Account {
	id: string;
}

export interface DomainMin {
	id: string;
	name: string;
}

export interface Domain {
	id: string;
	name: string;
	parent: DomainMin;
	owner: Account;
	minter: Account;
	metadata: string;
	isLocked: boolean;
	lockedBy: Account;
}

// We have two different types of Metadata
// because we changed Schema. This needs to be
// handled in a better way
interface Meta {
	[key: string]: any | undefined;
	image: string; // One of: Image, Video, 3d Model
	animation_url?: string;
	stakingRequests?: 'disabled' | 'enabled';
	isBiddable?: boolean;
	gridViewByDefault?: boolean;
	customDomainHeader?: boolean;
	previewImage?: string; // One of: Image, Video
	customDomainHeaderValue?: string;
	image_full?: string;
	attributes?: Attribute[];
}

export interface Attribute {
	trait_type: string;
	value: string | number;
}

export interface Metadata extends Meta {
	title: string;
}

export interface UploadMetadata extends Meta {
	name: string;
}

export interface ParentDomain extends Domain {
	subdomains: SubDomain[];
}

export interface SubDomain extends Domain {}

export interface DomainRequest {
	id: string;
	parent: Domain;
	offeredAmount: string;
	requestUri: string;
	label: string;
	domain: string;
	requestor: Account;
	nonce: string;
	approved: boolean;
	fulfilled: boolean;
	timestamp: string;
}

export type DomainData = {
	domain: Domain;
	bids: Bid[];
};

export interface DisplayDomain extends Domain {
	attributes: Maybe<Attribute[]>;
	image: Maybe<string>;
	description: Maybe<string>;
	title: Maybe<string>;
	image_full?: Maybe<string>;
	animation_url?: Maybe<string>;
}

export interface DisplayParentDomain extends DisplayDomain {
	subdomains: DisplayDomain[];
}

// Parameters to create an NFT
export interface NftParams {
	owner: string;
	parent: string;
	zna: string;
	name: string;
	domain: string; // domain label
	ticker: string;
	story: string;
	image: Buffer;
	previewImage?: Buffer;
	dynamic: boolean;
	locked: boolean;
}

// Interface for an NFT Status Card
export interface NftStatusCard {
	zNA: string;
	title: string;
	imageUri: string;
	story: string;
	stakeAmount?: string;
	transactionHash: string;
}

// The contents of a Domain Request file that has been uploaded to IPFS
export interface DomainRequestContents {
	parent: string;
	domain: string; // domain label
	requestor: string;
	stakeAmount: string;
	stakeCurrency: string;
	metadata: string; // uri to metadata
	locked: boolean;
}

export interface DomainRequestAndContents {
	request: DomainRequest;
	contents: DomainRequestContents;
}

export interface DisplayDomainRequestAndContents
	extends DomainRequestAndContents {
	metadata: Metadata;
}

// Defaults

export const DefaultDomain: Domain = {
	id: '',
	name: '',
	parent: {
		id: '',
		name: '',
	},
	owner: {
		id: '',
	},
	minter: {
		id: '',
	},
	metadata: '',
	isLocked: false,
	lockedBy: {
		id: '',
	},
};

// @zachary change these types
// to reflect real data (its mock at the moment)

export type Bid = {
	amount: number;
	bidderAccount: string;
	date: Date;
	tokenId: string;

	signature: ethers.utils.BytesLike;
	bidNonce: string;
	nftAddress: string;
	minBid: string;
	startBlock: string;
	expireBlock: string;
};

export type DomainHighestBid = {
	domain: Domain;
	bid: Bid;
};

export interface DomainsQueryResult {
	domains: ParentDomain[];
}

export interface DomainQueryResult {
	domain: Maybe<ParentDomain>;
}

interface minterDto {
	id: string;
	domain: string;
	blockNumber: string;
	timestamp: string;
	transactionID: string;
	minter: string;
}

export interface transferDto {
	id: string;
	domain: string;
	blockNumber: string;
	timestamp: string;
	transactionID: string;
	from: Account;
	to: Account;
}

export interface minterData {
	domainMinteds?: minterDto[];
}

export interface transfersData {
	domainTransferreds?: transferDto[];
}

export interface TransferSubmitParams {
	name: string;
	domainId: string;
	domainName: string;
	ownerId: string;
	image: string;
	creatorId: string;
	walletAddress: string;
	onClose: () => void;
}

export interface StakingRequest {
	requestor: string;
	stakeAmount: string;
	stakeCurrency: string;
	nft: NftParams;
}
