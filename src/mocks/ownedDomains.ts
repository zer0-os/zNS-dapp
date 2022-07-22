export enum TEST_NETWORK {
	TEST_NETWORK_ONE = 'test-network-one',
	TEST_NETWORK_TWO = 'test-network-two',
	TEST_NETWORK_THREE = 'test-network-three',
}

export const mockNullOwnedDomains = [];

export const mockOwnedDomains = [
	{
		id: '0x11111',
		name: 'test-network-one.bohdi.utah.tyler',
		parentId: '0x11111',
		owner: '0x11111',
		minter: '0x11111',
		metadataUri: 'https://test-metadatauri.ipfs',
		isLocked: false,
		lockedBy: '0x11111',
		contract: '0x11111',
	},
	{
		id: '0x22222',
		name: 'test-network-one.marty.doc.jen',
		parentId: '0x22222',
		owner: '0x22222',
		minter: '0x22222',
		metadataUri: 'https://test-metadatauri.ipfs',
		isLocked: false,
		lockedBy: '0x22222',
		contract: '0x22222',
	},
	{
		id: '0x33333',
		name: 'test-network-two.anakin.luke.obi-wan',
		parentId: '0x33333',
		owner: '0x33333',
		minter: '0x33333',
		metadataUri: 'https://test-metadatauri.ipfs',
		isLocked: false,
		lockedBy: '0x33333',
		contract: '0x33333',
	},
	{
		id: '0x44444',
		name: 'test-network-three.vincent.marsellus.butch',
		parentId: '0x44444',
		owner: '0x44444',
		minter: '0x44444',
		metadataUri: 'https://test-metadatauri.ipfs',
		isLocked: false,
		lockedBy: '0x44444',
		contract: '0x44444',
	},
	{
		id: '0x55555',
		name: 'test-network-three.master.cortana.spartan',
		parentId: '0x55555',
		owner: '0x55555',
		minter: '0x55555',
		metadataUri: 'https://test-metadatauri.ipfs',
		isLocked: false,
		lockedBy: '0x55555',
		contract: '0x55555',
	},
];

export const mockBids = {
	bids: [
		{
			amount: '010000',
			bidNonce: '654321',
			bidder: '0x22222',
			contract: '0xfedcba',
			expireBlock: '000000',
			signedMessage: '0xd4c3b2a1',
			startBlock: '0',
			timestamp: '00',
			tokenId: '0xdddd',
			version: '2.0',
		},
		{
			amount: '100000',
			bidNonce: '123456',
			bidder: '0x11111',
			contract: '0xabcdef',
			expireBlock: '000000',
			signedMessage: '0x1a2b3c4d',
			startBlock: '0',
			timestamp: '00',
			tokenId: '0xeeee',
			version: '2.0',
		},
	],
	highestBid: {
		amount: '100000',
		bidNonce: '123456',
		bidder: '0x11111',
		contract: '0xabcdef',
		expireBlock: '000000',
		signedMessage: '0x1a2b3c4d',
		startBlock: '0',
		timestamp: '00',
		tokenId: '0xeeee',
		version: '2.0',
	},
};

export const mockNullBids = {
	bids: [],
	highestBid: {},
};
