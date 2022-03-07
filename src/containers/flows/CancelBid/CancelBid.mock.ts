/////////////////
// Domain Data //
/////////////////

const mockDomainData = {
	id: 'domainId',
	metadataUri: 'ipfs://Qmb8E577qp62QcyQk3eLrsUcao8Ww5FbpMHZZjY2STVGpa',
	minter: '0x7829afa127494ca8b4ceef4fb81b78fee9d0e471',
	name: 'wilder.candy',
	owner: '0xbb6a3a7ea2bc5cf840016843fa01d799be975320',
};

const mockMetadata = {
	description: 'Description',
	image:
		'https://ipfs.fleek.co/ipfs/QmVZ3PNJ2dh7nEh6hdDb2TdPKAoT3Rk7DVhSXqLcYfUhKG',
	title: 'Test Title',
};

//////////
// Bids //
//////////

const highBidAmount = '300000000000000000000000';
const mediumBidAmount = '200000000000000000000000';
const lowBidAmount = '100000000000000000000000';

const mockBid = {
	auctionId: '2',
	bidder: '0x000000000000000000000000',
	signedMessage: 'message',
	tokenId: mockDomainData.id,
};

const mockBidBeingCancelled = {
	auctionId: '1',
	bidder: '0x000000000000000000000000',
	signedMessage: 'message',
	tokenId: mockDomainData.id,
	amount: mediumBidAmount,
};

const mockHighestBid = {
	...mockBid,
	amount: highBidAmount,
};

const mockBids = [
	mockBidBeingCancelled,
	mockHighestBid,
	{ ...mockBid, amount: lowBidAmount },
];

const mockContainerProps = {
	auctionId: mockBidBeingCancelled.auctionId,
	domainId: mockDomainData.id,
};

const exports = {
	mockDomainData,
	mockMetadata,
	mockBidBeingCancelled,
	mockHighestBid,
	mockBids,
	mockContainerProps,
};
export default exports;
