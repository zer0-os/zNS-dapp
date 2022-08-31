import { BigNumber } from 'ethers';

export enum ZAuctionVersionType {
	V1 = '1.0',
	V2 = '2.0',
}

export type BidData = {
	assetUrl: string;
	creator: string;
	domainName: string;
	highestBid: BigNumber;
	title: string;
	yourBid: BigNumber;
};

export enum Step {
	LoadingData,
	Details,
	Confirmation,
	Cancelling,
	Success,
}
