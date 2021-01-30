import { ContractAddresses } from './contracts';
import { NETWORK_TYPES } from './network';
// TODO: remove any, fix network types
const addresses: { [network in NETWORK_TYPES]: ContractAddresses } = {
  [NETWORK_TYPES.RINKEBY]: {
    registry: '0x798190f0640E6089b481298FbAc7EAEC0CFFBEFb',
  },
} as any;

export default addresses;
