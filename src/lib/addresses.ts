import { ContractAddresses } from './contracts';
import { NETWORK_TYPES } from './network';
// TODO: remove any, fix network types
const addresses: { [network in NETWORK_TYPES]: ContractAddresses } = {
  [NETWORK_TYPES.KOVAN]: {
    registrar: '0x74299b367E199a3f9a37fdFDb1f9dE85b1224A13',
  },
} as any;

export default addresses;
