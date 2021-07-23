import { ContractAddresses } from './contracts';
import { NETWORK_TYPES } from './network';
// TODO: remove any, fix network types
const addresses: { [network in NETWORK_TYPES]: ContractAddresses } = {
	[NETWORK_TYPES.MAINNET]: {
		registrar: '0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D',
		basic: '0xa05Ae774Da859943B7B859cd2A6aD9F5f1651d6a',
		staking: '0x79135dd59346BBf06Ccf40978ACaC570d92eefBa',
		wildToken: '0x2a3bFF78B79A009976EeA096a51A948a3dC00e34',
		zAuction: '0x4d626cE2e7562a04D83780251B9f8191A123a57e', // fake
	},
	[NETWORK_TYPES.KOVAN]: {
		registrar: '0x7293c267cA90FEdD32c67AEf52fB3416903A24B3',
		basic: '0x7EB6D0E8c91F6e88bf029138FDf0d04Fb78E43a4',
		staking: '0xC6E3a8eD83eFdA986Eab9EfA4286fb031333448f',
		wildToken: '0x279D6D836e75947F2aC9F66f893C4297B6Ba9e44',
		zAuction: '0x4d626cE2e7562a04D83780251B9f8191A123a57e',
	},
} as any;

export default addresses;
