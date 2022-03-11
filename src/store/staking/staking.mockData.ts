import { DomainRequestAndContents, NftStatusCard } from 'lib/types';
import { StakingState } from './types';

export const NFT_STATUS_CARD_1: NftStatusCard = {
	zNA: '0://wilder.rational.emoji.worldoriginwildertest.wolf2.minttest19',
	title: 'Staking Card 1',
	imageUri:
		'https://ipfs.fleek.co/ipfs/QmeKEGp2Cr9Jn4sGHG6vNr6EaU1TzrHFh3GYhU2Zw8aYhH',
	story: 'Staking Card 1',
	transactionHash:
		'0xc322cf8d3076fc382083c45adf13ceabd435e28603280d9559eae535d2969c5c',
};

export const NFT_STATUS_CARD_2: NftStatusCard = {
	zNA: '0://wilder.rational.emoji.worldoriginwildertest.wolf2.minttest20',
	title: 'Staking Card 2',
	imageUri:
		'https://ipfs.fleek.co/ipfs/QmVXKVoamhqydDXX98kVkp3tVM4Fkh4XX3W2rg7RCMbP1k',
	story: 'Staking Card 2',
	transactionHash:
		'0x8cefe2a3eadaa966b4996fb4a1e2ccfcda0f33839b4853b30478985c391ba302',
};

export const DOMAIN_REQUEST_AND_CONTENTS_1: DomainRequestAndContents = {
	request: {
		id: '0x39563c54c1df487c085c2829c09a47063506ab3edebd0c35f0283cef24d9y857',
		parent: {
			id: '0x810270aba21bdfd45e997cb16823a017be76daf4822529dce30ee7ea03d58e1c',
			name: 'parent domain name 1',
			parent: '0x8123a9b1bdfd45e997cb16823a017be76daf4822529dce30ee7ea03d928d',
			owner: {
				id: '0x0ddda1dd73c063af0a8d4df0cdd2a6818685f9ce',
			},
			minter: {
				id: '0x0ddda1dd73c063af0a8d4df0cdd2a6818685f9ce',
			},
			metadata:
				'https://ipfs.fleek.co/ipfs/QmevCu3hPcBB3XydNm5Msc7k1PVQiCqfk2g26h5Msvy59x',
		},
		offeredAmount: '500',
		requestUri:
			'https://ipfs.fleek.co/ipfs/QmTyiVoamhqydDXX98kVkp3tVM4Fkh4XX3W2rg7RUDS19',
		label: 'domain request label',
		domain:
			'0x24153c54c1df487c085c2829c09a47063506ab3edebd0c35f0283cef24d9d106',
		requestor: {
			id: '0x0ddda1dd73c063af0a8d4df0cdd2a6818685f9ce',
		},
		nonce: 'nonce',
		approved: false,
		fulfilled: false,
		timestamp: '1234567890',
	},
	contents: {
		parent:
			'0x810270aba21bdfd45e997cb16823a017be76daf4822529dce30ee7ea03d58e1c',
		domain: 'my domain 1',
		requestor: '0x0ddda1dd73c063af0a8d4df0cdd2a6818685f9ce',
		stakeAmount: '500',
		stakeCurrency: 'WILD',
		metadata:
			'https://ipfs.fleek.co/ipfs/QmevCu3hPcBB3XydNm5Msc7k1PVQiCqfk2g26h5Msvy59x',
		locked: false,
	},
};

export const DOMAIN_REQUEST_AND_CONTENTS_2: DomainRequestAndContents = {
	request: {
		id: '0x39563c54c1df487c085c2829c09a47063506ab3edebd0c35f0283cef24d8u1223',
		parent: {
			id: '0x810270aba21bdfd45e997cb16823a017be76daf4822529dce30ee7ea03d58e1c',
			name: 'parent domain name 2',
			parent: '0x8123a9b1bdfd45e997cb16823a017be76daf4822529dce30ee7ea03d928d',
			owner: {
				id: '0x0ddda1dd73c063af0a8d4df0cdd2a6818685f9ce',
			},
			minter: {
				id: '0x0ddda1dd73c063af0a8d4df0cdd2a6818685f9ce',
			},
			metadata:
				'https://ipfs.fleek.co/ipfs/QmevCu3hPcBB3XydNm5Msc7k1PVQiCqfk2g26h5Msvy59x',
		},
		offeredAmount: '500',
		requestUri:
			'https://ipfs.fleek.co/ipfs/QmTyiVoamhqydDXX98kVkp3tVM4Fkh4XX3W2rg7RUDS19',
		label: 'domain request label',
		domain:
			'0x24153c54c1df487c085c2829c09a47063506ab3edebd0c35f0283cef24d9d106',
		requestor: {
			id: '0x0ddda1dd73c063af0a8d4df0cdd2a6818685f9ce',
		},
		nonce: 'nonce',
		approved: true,
		fulfilled: true,
		timestamp: '1234567890',
	},
	contents: {
		parent:
			'0x810270aba21bdfd45e997cb16823a017be76daf4822529dce30ee7ea03d58e1c',
		domain: 'my domain 1',
		requestor: '0x0ddda1dd73c063af0a8d4df0cdd2a6818685f9ce',
		stakeAmount: '500',
		stakeCurrency: 'WILD',
		metadata:
			'https://ipfs.fleek.co/ipfs/QmevCu3hPcBB3XydNm5Msc7k1PVQiCqfk2g26h5Msvy59x',
		locked: false,
	},
};

export const stakingReady: StakingState = {
	requesting: [NFT_STATUS_CARD_1],
	requested: [NFT_STATUS_CARD_2],
	approving: [DOMAIN_REQUEST_AND_CONTENTS_1],
	approved: [DOMAIN_REQUEST_AND_CONTENTS_2],
	fulfilling: [DOMAIN_REQUEST_AND_CONTENTS_1],
	fulfilled: [DOMAIN_REQUEST_AND_CONTENTS_2],
};
