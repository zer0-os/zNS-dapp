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
		wheelSale: '0x19a55608f360f6Df69B7932dC2F65EDEFAa88Dc2', //  wheels

		stakeFactory: '0xF133faFd49f4671ac63EE3a3aE7E7C4C9B84cE4a',
		lpToken: '0xcaA004418eB42cdf00cB057b7C9E28f0FfD840a5',
		wildStakingPool: '0x3aC551725ac98C5DCdeA197cEaaE7cDb8a71a2B4',
		lpStakingPool: '0x9E87a268D42B0Aba399C121428fcE2c626Ea01FF',
		// wheelSale: '0x7bA5faff747a3cA7E4ebe65F64e3EDFAEE136846', //  crafts
	},
	[NETWORK_TYPES.KOVAN]: {
		registrar: '0xC613fCc3f81cC2888C5Cccc1620212420FFe4931',
		basic: '0x2EF34C52138781C901Fe9e50B64d80aA9903f730',
		staking: '0x1E3F8B31b24EC0E938BE45ecF6971584F90A1602', //$LOOT staking controller
		wildToken: '0x50A0A3E9873D7e7d306299a75Dc05bd3Ab2d251F',
		lootToken: '0xD364C50c33902110230255FE1D730D84FA23e48e',
		zAuction: '0x18A804a028aAf1F30082E91d2947734961Dd7f89',
		wheelSale: '0xa6A3321b743C31912263090275E24d8b1A50cFE8', // wheelstest2

		// Staking dApp contracts
		stakeFactory: '0x47946797E05A34B47ffE7151D0Fbc15E8297650E',
		lpToken: '0xD364C50c33902110230255FE1D730D84FA23e48e',
		wildStakingPool: '0x4E226a8BbECAa435d2c77D3E4a096F87322Ef1Ae',
		lpStakingPool: '0x9CF0DaD38E4182d944a1A4463c56CFD1e6fa8fE7',
		// wheelSale: '0x946911623663e1526165Cc1eFf37DdE0834e7786', // crafts sale
	},
} as any;

export default addresses;
