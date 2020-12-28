export enum NETWORK_TYPES {
  MAINNET = "MAINNET",
  RINKEBY = "RINKEBY",
  ROPSTEN = "ROPSTEN",
  LOCAL = "LOCAL",
}

export const chainIdToNetworkType = (chainId: number): NETWORK_TYPES => {
  switch (chainId) {
    case 1:
      return NETWORK_TYPES.MAINNET;
    case 3:
      return NETWORK_TYPES.ROPSTEN;
    case 4:
      return NETWORK_TYPES.RINKEBY;
    default:
      return NETWORK_TYPES.LOCAL;
  }
};
