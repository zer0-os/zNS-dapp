import { Bid } from '@zero-tech/zauction-sdk';
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
