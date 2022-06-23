//- Library Imports
import { Bid } from '@zero-tech/zauction-sdk';

export const yourBidTemplate: Bid = {
	bidNonce: '',
	bidder: '',
	contract: '',
	tokenId: '',
	startBlock: '',
	amount: '',
	expireBlock: '',
	signedMessage: '',
	timestamp: '',
	version: '2.0',
	bidToken: '',
};

export enum ZAuctionVersionType {
	V1 = '1.0',
	V2 = '2.0',
}

export const mockPaymentTokenInfo = {
	id: '0x3Ae5d499cfb8FB645708CC6DA599C90e64b33A79',
	name: 'WILD',
	price: 2,
};

export const mockBidData = [
	{
		bidNonce: '2',
		bidder: '0x000000000000000000000000',
		signedMessage: 'message',
		tokenId: 'id-2',
		amount: '1000000',
		timestamp: '0',
		contract: '0x000000000000000000000000',
		startBlock: '0',
		expireBlock: '0',
		version: ZAuctionVersionType.V2,
		bidToken: '0x000000000000000000000000',
	},
];

// Expected Labels as per Figma
export const EXPECTED_LABELS = {
	HIGHEST_BID: 'Highest Bid (WILD)',
	YOUR_BID: 'Your Bid (WILD)',
	BUY_NOW: 'Buy Now (WILD)',
	NO_BIDS: 'No bids placed',

	PLACE_BID_BUTTON: 'Place A Bid',
	REBID_BUTTON: 'Rebid',
	BUY_NOW_BUTTON: 'Buy Now',
	EDIT_BUY_NOW_BUTTON: 'Edit Buy Now',
	SET_BUY_NOW_BUTTON: 'Set Buy Now',
	CANCEL_BID_BUTTON: 'Cancel Bid',
	VIEW_BIDS_BUTTON: 'View Bids',
};
