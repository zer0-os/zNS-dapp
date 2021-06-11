import { ContractAddresses } from './contracts';
import { NETWORK_TYPES } from './network';
// TODO: remove any, fix network types
const addresses: { [network in NETWORK_TYPES]: ContractAddresses } = {
	[NETWORK_TYPES.MAINNET]: {
		registrar: '0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D',
		basic: '0xa05Ae774Da859943B7B859cd2A6aD9F5f1651d6a',
		staking: '0x79135dd59346BBf06Ccf40978ACaC570d92eefBa',
	},
	[NETWORK_TYPES.KOVAN]: {
		registrar: '0x7293c267cA90FEdD32c67AEf52fB3416903A24B3',
		basic: '0x7EB6D0E8c91F6e88bf029138FDf0d04Fb78E43a4',
		staking: '0xC6E3a8eD83eFdA986Eab9EfA4286fb031333448f',
	},
} as any;

export default addresses;
