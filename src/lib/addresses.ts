import { ContractAddresses } from './contracts';
import { NETWORK_TYPES } from './network';
// TODO: remove any, fix network types
const addresses: { [network in NETWORK_TYPES]: ContractAddresses } = {
	[NETWORK_TYPES.MAINNET]: {
		registrar: '0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D',
		basic: '0xa05Ae774Da859943B7B859cd2A6aD9F5f1651d6a',
		staking: '0x79135dd59346BBf06Ccf40978ACaC570d92eefBa',
		wildToken: '0x2a3bFF78B79A009976EeA096a51A948a3dC00e34',
		zAuction: '0x8d63253c54B7D4Ac44A93636B7F5f94Ab63E6e39',
	},
	[NETWORK_TYPES.KOVAN]: {
		registrar: '0xC613fCc3f81cC2888C5Cccc1620212420FFe4931',
		basic: '0x2EF34C52138781C901Fe9e50B64d80aA9903f730',
		staking: '0xC07D934D3641BB560db2ad63D0F143B7625ceB92',
		wildToken: '0x50A0A3E9873D7e7d306299a75Dc05bd3Ab2d251F',
		zAuction: '0x18A804a028aAf1F30082E91d2947734961Dd7f89',
	},
} as any;

export default addresses;
