import { ContractAddresses } from './contracts';
import { NETWORK_TYPES } from './network';
// TODO: remove any, fix network types
const addresses: { [network in NETWORK_TYPES]: ContractAddresses } = {
  [NETWORK_TYPES.KOVAN]: {
    registry: '0x909d371C8898dcA48Ec65c72015388c1Cb11f4A8',
  },
} as any;

export default addresses;
