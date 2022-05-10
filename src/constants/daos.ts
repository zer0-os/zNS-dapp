import { CreateZDAOParams } from '@zero-tech/zdao-sdk/lib/types';
import { NETWORK_TYPES } from 'lib/network';

export const DAOS: { [network in NETWORK_TYPES]: CreateZDAOParams[] } = {
	[NETWORK_TYPES.MAINNET]: [
		{
			zNA: 'wilder.beasts',
			title: 'Beasts DAO',
			creator: '0x22C38E74B8C0D1AAB147550BcFfcC8AC544E0D8C',
			network: 1, // for Mainnet
			safeAddress: '0x766a9b866930d0c7f673eb8fc9655d5f782b2b21',
			votingToken: '0x2a3bFF78B79A009976EeA096a51A948a3dC00e34',
		},
		{
			zNA: 'wilder.kicks',
			title: 'Kicks DAO',
			creator: '0x22C38E74B8C0D1AAB147550BcFfcC8AC544E0D8C',
			network: 1, // for Mainnet
			safeAddress: '0x2A83Aaf231644Fa328aE25394b0bEB17eBd12150',
			votingToken: '0x2a3bFF78B79A009976EeA096a51A948a3dC00e34',
		},
		{
			zNA: 'wilder.wheels',
			title: 'Wheels DAO',
			creator: '0x22C38E74B8C0D1AAB147550BcFfcC8AC544E0D8C',
			network: 1, // for Mainnet
			safeAddress: '0xEe7Ad892Fdf8d95223d7E94E4fF42E9d0cfeCAFA',
			votingToken: '0x2a3bFF78B79A009976EeA096a51A948a3dC00e34',
		},
	],
	[NETWORK_TYPES.RINKEBY]: [
		{
			id: 'joshupgig.eth',
			ens: 'joshupgig.eth',
			zNA: 'one',
			title: 'zDAO Testing 1',
			creator: '0x22C38E74B8C0D1AAB147550BcFfcC8AC544E0D8C',
			network: 4, // for Rinkeby
			safeAddress: '0x7a935d07d097146f143A45aA79FD8624353abD5D',
			votingToken: '0xD53C3bddf27b32ad204e859EB677f709c80E6840',
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
