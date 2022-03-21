//- Lib Imports
import { ethers } from 'ethers';

//- Contants Imports
import { CURRENCY } from 'constants/currency';

// Truncated NFT domain
export const truncatedDomain = (domainName: string) => {
	let domainText;
	if (('wilder.' + domainName).length > 45) {
		domainText = `wilder...${
			domainName.split('.')[domainName.split('.').length - 1]
		}`;
		return domainText;
	} else {
		domainText = `${domainName}`;
		return domainText;
	}
};

// Truncated wallet address
export const truncatedAddress = (walletAddress: string) => {
	const truncatedWalletAddress = `${walletAddress.substring(
		0,
		4,
	)}...${walletAddress.substring(walletAddress.length - 4)}`;
	return truncatedWalletAddress;
};

// Formatted highest bid
export const getFormattedHighestBidAmount = (highestBid?: string) =>
	highestBid
		? ethers.utils.formatEther(highestBid).toString() + ` ${CURRENCY.WILD}`
		: '';

// Formatted bid amount
export const getFormattedBidAmount = (bidAmount?: string) =>
	bidAmount
		? ethers.utils.formatEther(bidAmount).toString() + ` ${CURRENCY.WILD}`
		: '';
