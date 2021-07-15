import { ContractAddresses } from './contracts';
import { NETWORK_TYPES } from './network';
// TODO: remove any, fix network types
const addresses: { [network in NETWORK_TYPES]: ContractAddresses } = {
	[NETWORK_TYPES.MAINNET]: {
		registrar: '0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D',
		basic: '0xa05Ae774Da859943B7B859cd2A6aD9F5f1651d6a',
		staking: '0x79135dd59346BBf06Ccf40978ACaC570d92eefBa',
	},
	// DEMO
	[NETWORK_TYPES.KOVAN]: {
		registrar: '0xC828B82D26314f8c832b0A324bB35B2db072eD63',
		basic: '0xF75EDa288d664707E730ca04Fa168038060D72B1',
		staking: '0x493538F396A4F67eE6326367CBCa877200404DC3',
	},
} as any;

export default addresses;
