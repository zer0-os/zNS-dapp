import { ContractAddresses } from "./contracts";
import { NETWORK_TYPES } from "./network";
// TODO: remove any, fix network types
const addresses: { [network in NETWORK_TYPES]: ContractAddresses } = {
  [NETWORK_TYPES.RINKEBY]: {
    registrar: "0xff3ff705D9906fE78a1434540812081A1ad827D8",
  },
} as any

export default addresses;
