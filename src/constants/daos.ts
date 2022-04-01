import { CreateZDAOParams } from '@zero-tech/zdao-sdk/lib/types';
import { NETWORK_TYPES } from 'lib/network';

export const DAOS: { [network in NETWORK_TYPES]: CreateZDAOParams[] } = {
	[NETWORK_TYPES.MAINNET]: [
		{
			zNA: 'adao',
			title: 'Mainnet Test DAO 1',
			creator: '0x22C38E74B8C0D1AAB147550BcFfcC8AC544E0D8C',
			network: 1, // for Mainnet
			safeAddress: '0x9CA53E3E249Abe500bEbA7aC8BDC8476bfc06bC6',
			votingToken: '0x10F6A2795B14f13771d885D72e5925Aff647B565',
		},
		{
			zNA: 'samedao',
			title: 'Mainnet Test DAO 1',
			creator: '0x22C38E74B8C0D1AAB147550BcFfcC8AC544E0D8C',
			network: 1, // for Mainnet
			safeAddress: '0x9CA53E3E249Abe500bEbA7aC8BDC8476bfc06bC6',
			votingToken: '0x10F6A2795B14f13771d885D72e5925Aff647B565',
		},
	],
	[NETWORK_TYPES.RINKEBY]: [
		{
			zNA: 'one',
			title: 'zDAO Testing 1',
			creator: '0x22C38E74B8C0D1AAB147550BcFfcC8AC544E0D8C',
			network: 4, // for Rinkeby
			safeAddress: '0x7a935d07d097146f143A45aA79FD8624353abD5D',
			votingToken: '0x10F6A2795B14f13771d885D72e5925Aff647B565',
		},
		{
			zNA: 'two',
			title: 'zDAO Testing 2',
			creator: '0x22C38E74B8C0D1AAB147550BcFfcC8AC544E0D8C',
			network: 4, // for Rinkeby
			safeAddress: '0x7a935d07d097146f143A45aA79FD8624353abD5D',
			votingToken: '0x10F6A2795B14f13771d885D72e5925Aff647B565',
		},
		{
			zNA: 'three',
			title: 'zDAO Testing 3',
			creator: '0x22C38E74B8C0D1AAB147550BcFfcC8AC544E0D8C',
			network: 4, // for Rinkeby
			safeAddress: '0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A',
			votingToken: '0xD53C3bddf27b32ad204e859EB677f709c80E6840',
		},
	],
} as any;
