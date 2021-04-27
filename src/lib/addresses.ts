import { ContractAddresses } from './contracts';
import { NETWORK_TYPES } from './network';
// TODO: remove any, fix network types
const addresses: { [network in NETWORK_TYPES]: ContractAddresses } = {
  [NETWORK_TYPES.KOVAN]: {
    registrar: '0x7293c267cA90FEdD32c67AEf52fB3416903A24B3',
    basic: '0x682ac9f7BA50A2713510598bF2b7901E2AC0B096',
  },
} as any;

export default addresses;
