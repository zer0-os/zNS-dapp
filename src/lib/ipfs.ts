import { DEFAULT_IPFS_GATEWAY } from 'constants/ipfs';

/**
 * Pulls the IPFS hash from an IPFS url
 * Note: this will currently not handle nested IPFS content, i.e. ipfs.io/ipfs/[hash]/content
 * @param url IPFS url to get hash from
 * @returns IPFS hash from url
 */
export const getHashFromIPFSUrl = (url: string) => {
	const hashIndex = url.lastIndexOf('/') + 1;
	return url.slice(hashIndex);
};

export const getWebIPFSUrlFromHash = (hash: string) => {
	return `${DEFAULT_IPFS_GATEWAY}${hash}`;
};
