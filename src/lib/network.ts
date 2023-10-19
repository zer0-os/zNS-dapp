export enum NETWORK_TYPES {
	MAINNET = 'MAINNET',
	RINKEBY = 'RINKEBY',
	ROPSTEN = 'ROPSTEN',
	LOCAL = 'LOCAL',
	KOVAN = 'KOVAN',
	GOERLI = 'GOERLI',
}

export const defaultNetworkId: number = Number(
	import.meta.env.VITE_DEFAULT_NETWORK ?? 1,
);

export const getEtherscanUri = (networkType: NETWORK_TYPES): string => {
	let prefix = '';
	switch (networkType) {
		case NETWORK_TYPES.ROPSTEN:
			prefix = 'ropsten.';
			break;
		case NETWORK_TYPES.RINKEBY:
			prefix = 'rinkeby.';
			break;
		case NETWORK_TYPES.KOVAN:
			prefix = 'kovan.';
			break;
		case NETWORK_TYPES.GOERLI:
			prefix = 'goerli.';
	}
	const uri = `https://${prefix}etherscan.io/`;

	return uri;
};

export const chainIdToNetworkType = (
	chainId: number | undefined,
): NETWORK_TYPES => {
	if (!chainId) {
		chainId = defaultNetworkId;
	}
	switch (chainId) {
		case 1:
			return NETWORK_TYPES.MAINNET;
		case 3:
			return NETWORK_TYPES.ROPSTEN;
		case 4:
			return NETWORK_TYPES.RINKEBY;
		case 42:
			return NETWORK_TYPES.KOVAN;
		case 5:
			return NETWORK_TYPES.GOERLI;
		default:
			return NETWORK_TYPES.LOCAL;
	}
};

/**
 * Returns a network name for a given chain ID
 * @param chainId to get network name from
 * @returns network name
 */
export const chainIdToNetworkName = (chainId: number): string => {
	switch (chainId) {
		case 1:
			return 'Ethereum Mainnet';
		case 3:
			return 'Ropsten Testnet';
		case 4:
			return 'Rinkeby Testnet';
		case 42:
			return 'Kovan Testnet';
		case 5:
			return 'Goerli Testnet';
		default:
			return 'Unknown Network';
	}
};
