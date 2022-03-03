import { BigNumber } from 'ethers';

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
