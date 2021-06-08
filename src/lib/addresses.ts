import { ContractAddresses } from './contracts';
import { NETWORK_TYPES } from './network';
// TODO: remove any, fix network types
const addresses: { [network in NETWORK_TYPES]: ContractAddresses } = {
	[NETWORK_TYPES.MAINNET]: {
		registrar: '0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D',
		basic: '0xa05Ae774Da859943B7B859cd2A6aD9F5f1651d6a',
		staking: '0x09d36c4e72F740D46C18769d91b446Fdbb71B2B5',
	},
	[NETWORK_TYPES.KOVAN]: {
		registrar: '0x7293c267cA90FEdD32c67AEf52fB3416903A24B3',
		basic: '0x7EB6D0E8c91F6e88bf029138FDf0d04Fb78E43a4',
		staking: '0x09d36c4e72F740D46C18769d91b446Fdbb71B2B5',
	},
} as any;

export default addresses;
