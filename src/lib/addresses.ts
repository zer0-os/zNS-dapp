import { ContractAddresses } from './contracts';
import { NETWORK_TYPES } from './network';
// TODO: remove any, fix network types
const addresses: { [network in NETWORK_TYPES]: ContractAddresses } = {
  [NETWORK_TYPES.KOVAN]: {
    registrar: '0x7293c267cA90FEdD32c67AEf52fB3416903A24B3',
    basic: '0x7EB6D0E8c91F6e88bf029138FDf0d04Fb78E43a4',
  },
} as any;

export default addresses;
