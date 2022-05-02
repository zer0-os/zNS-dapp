import { DomainMetadata } from '@zero-tech/zns-sdk/lib/types';
import { getHashFromIPFSUrl } from './ipfs';
import { Metadata } from './types';

import { DEFAULT_IPFS_GATEWAY } from 'constants/ipfs';

interface MetadataCache {
	[url: string]: Metadata | undefined;
}

const memoryCache: MetadataCache = {};

export async function getMetadata(
	metadataUrl: string,
): Promise<Metadata | undefined> {
	try {
		if (memoryCache[metadataUrl]) {
			return memoryCache[metadataUrl];
		}

		let requestUrl = metadataUrl;
		const hash = getHashFromIPFSUrl(metadataUrl);
		requestUrl = DEFAULT_IPFS_GATEWAY + hash;

		const response = await fetch(requestUrl);
		const data = await response.json();
		const metadata = parseDomainMetadata(data);

		if (!metadata.title || !metadata.description || !metadata.image) {
			throw Error();
		}

		memoryCache[metadataUrl] = metadata;

		return metadata;
	} catch (e) {
		console.error('Failed to retrieve metadata from ' + metadataUrl);
		return;
	}
}

export const parseDomainMetadata = (
	domainMetadata: DomainMetadata,
): Metadata => {
	return {
		attributes: domainMetadata.attributes,
		title: domainMetadata.name || domainMetadata.title,
		description: domainMetadata.description,
		image: domainMetadata.image,
		image_full: domainMetadata.image_full,
		previewImage: domainMetadata.previewImage,
		animation_url: domainMetadata.animation_url,
		stakingRequests:
			domainMetadata.stakingRequests || domainMetadata.stakingrequests,
		isBiddable:
			domainMetadata.isBiddable === undefined ||
			Boolean(domainMetadata.isBiddable),
		isMintable: Boolean(domainMetadata.isMintable),
		gridViewByDefault:
			domainMetadata.gridViewByDefault === undefined ||
			Boolean(domainMetadata.gridViewByDefault),
		customDomainHeader: Boolean(domainMetadata.customDomainHeader),
		customDomainHeaderValue: domainMetadata.customDomainHeaderValue,
	} as Metadata;
};
