//- Library Imports
import { ZAuctionVersionType } from '../CancelBid.types';

export const mockBidV1 = {
	bidNonce: '2',
	bidder: '0x000000000000000000000000',
	signedMessage: 'message',
	tokenId: 'id-2',
	amount: '1000000',
	timestamp: '0',
	contract: '0x000000000000000000000000',
	startBlock: '0',
	expireBlock: '0',
	version: ZAuctionVersionType.V1,
	bidToken: '0x000000000000000000000000',
};

export const mockBidV2 = {
	bidNonce: '1',
	bidder: '0x000000000000000000000000',
	signedMessage: 'message',
	tokenId: 'id-1',
	amount: '1000000',
	timestamp: '0',
	contract: '0x000000000000000000000000',
	startBlock: '0',
	expireBlock: '0',
	version: ZAuctionVersionType.V2,
	bidToken: '0x000000000000000000000000',
};
