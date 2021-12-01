import { ContractAddresses } from './contracts';
import { NETWORK_TYPES } from './network';
// TODO: remove any, fix network types
const addresses: { [network in NETWORK_TYPES]: ContractAddresses } = {
	[NETWORK_TYPES.MAINNET]: {
		registrar: '0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D',
		basic: '0xa05Ae774Da859943B7B859cd2A6aD9F5f1651d6a',
		staking: '0x45b13d8e6579d5C3FeC14bB9998A3640CD4F008D',
		wildToken: '0x2a3bFF78B79A009976EeA096a51A948a3dC00e34',
		lootToken: '0x43b8219aC1883373C0428688eE1a76e19E6B6D9d',
		zAuction: '0x05cBD37cA528B7ea50800aA80ddD0F9F30C952F0',
		wheelSale: '0xA2E4a7678C30C061B26e2F38737C025Ffc6C22B5', //  cribs
	},
	[NETWORK_TYPES.KOVAN]: {
		registrar: '0xC613fCc3f81cC2888C5Cccc1620212420FFe4931',
		basic: '0x2EF34C52138781C901Fe9e50B64d80aA9903f730',
		staking: '0x1E3F8B31b24EC0E938BE45ecF6971584F90A1602', //$LOOT staking controller
		wildToken: '0x50A0A3E9873D7e7d306299a75Dc05bd3Ab2d251F',
		lootToken: '0xD364C50c33902110230255FE1D730D84FA23e48e',
		zAuction: '0x18A804a028aAf1F30082E91d2947734961Dd7f89',
		wheelSale: '0xd1a13c28CaAc090b51Db2ab99Ef3F1a54eDF0Fb7', // cribs sale
	},
} as any;

export default addresses;
