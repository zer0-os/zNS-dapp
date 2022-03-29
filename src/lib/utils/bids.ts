import { Bid } from '@zero-tech/zauction-sdk';
import { Instance } from '@zero-tech/zns-sdk';
import { BigNumber } from 'ethers';

/**
 * Sorts a list of bids, by amount, from lowest to highest.
 * @param bids list of bids to sort
 */
export const sortBidsByAmount = (bids: Bid[]) => {
	return bids.sort((a, b) =>
		BigNumber.from(a.amount).gte(BigNumber.from(b.amount)) ? -1 : 1,
	);
};

/**
 * Specifically to be used with bids.ts:getBidDataForDomain
 */
export type DomainBidData = {
	highestBid: Bid | undefined;
	bids: Bid[];
};

/**
 * Gets all bids for a domain and the highest bid
 * @param domainId id for domain we want to get bids for
 * @param sdk sdk instance for currently connected chain
 * @returns highest bid and all bids for domain
 */
export const getBidDataForDomain = async (
	domainId: string,
	sdk: Instance,
): Promise<DomainBidData | undefined> => {
	const bids = await sdk.zauction.listBids(domainId);
	if (!bids) {
		return { highestBid: undefined, bids: [] };
	}
	return { highestBid: sortBidsByAmount(bids)[0], bids: bids };
};

/**
 * Sorts a list of bids, by time, from most recent to oldest.
 * @param bids list of bids to sort
 */
export const sortBidsByTime = (bids: Bid[]) => {
	return bids
		.slice()
		.sort((a: Bid, b: Bid) => Number(b.timestamp) - Number(a.timestamp));
};
