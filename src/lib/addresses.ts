import { ContractAddresses } from "./contracts";
import { NETWORK_TYPES } from "./network";
// TODO: remove any, fix network types
const addresses: { [network in NETWORK_TYPES]: ContractAddresses } = {
  [NETWORK_TYPES.RINKEBY]: {
    registrar: "0xaa12b1fb88ad3223D717217FdB4AdA5F91a8f67D",
  },
} as any

export default addresses;
