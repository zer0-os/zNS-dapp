import { DEFAULT_IPFS_GATEWAY } from 'constants/ipfs';

/**
 * Pulls the IPFS hash from an IPFS url
 * @param url IPFS url to get hash from
 * @returns IPFS hash from url
 */
export const getHashFromIPFSUrl = (url: string) => {
	const regex = /Qm(\w{44})[/\w]*/;

	if (regex.test(url)) {
		const matches = url.match(regex) as string[];
		return matches[0];
	}

	return '';
};

/**
 * Appends an IPFS hash to the default IPFS gateway URL
 * @param hash of IPFS content
 * @returns web URL -> default IPFS gateway + hash
 */
export const getWebIPFSUrlFromHash = (hash: string) => {
	return `${DEFAULT_IPFS_GATEWAY}${hash}`;
};
