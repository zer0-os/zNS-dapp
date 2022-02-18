import { TransferSubmitParams } from 'lib/types';
import { TransferState } from './types';

export const TRANSFER_SUBMIT_PARAMS_1: TransferSubmitParams = {
	name: 'Table 27',
	domainId:
		'0x0271da00da9ad3bbddd1f6c62f7abfdbb0c4e05f4a8d4d6ff2516d0b7816793a',
	domainName: 'wheelstest1.27.table',
	ownerId: '0x13fc7bcca25bc0bab1c9cbec2ea2a254f4357f6e',
	image:
		'https://ipfs.fleek.co/ipfs/QmRNdt2JbEhjVKecPtmDfkgA7Yi4vrAA3KevBJeaSs43oP',
	creatorId: '0x13fc7bcca25bc0bab1c9cbec2ea2a254f4357f6e',
	walletAddress:
		'0x034cc407339c063b85fcbae3ca0b2cc247f36019117dc48421426c2f979409e0',
};

export const TRANSFER_SUBMIT_PARAMS_2: TransferSubmitParams = {
	name: 'Table 28',
	domainId:
		'0x034cc407339c063b85fcbae3ca0b2cc247f36019117dc48421426c2f979409e0',
	domainName: 'rational.brett.beetle.thebackground',
	ownerId: '0x13fc7bcca25bc0bab1c9cbec2ea2a254f4357f6e',
	image:
		'https://ipfs.fleek.co/ipfs/QmYoFGst6WDTwMBWHb3JEQABHdKM6WdBsbk8wjQYMN3Vvy',
	creatorId:
		'0x034cc407339c063b85fcbae3ca0b2cc247f36019117dc48421426c2f979409e0',
	walletAddress:
		'0x034cc407339c063b85fcbae3ca0b2cc247f36019117dc48421426c2f979409e0',
};

export const transferReady: TransferState = {
	transferring: [TRANSFER_SUBMIT_PARAMS_1],
	transferred: [TRANSFER_SUBMIT_PARAMS_2],
};
