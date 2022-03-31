import { DomainMetadata } from '@zero-tech/zns-sdk/lib/types';
import { Metadata } from './types';

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
		if (metadataUrl.startsWith('ipfs://')) {
			requestUrl = 'https://ipfs.fleek.co/ipfs/' + metadataUrl.slice(7);
		}

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
		gridViewByDefault: Boolean(domainMetadata.gridViewByDefault),
		customDomainHeader: Boolean(domainMetadata.customDomainHeader),
		customDomainHeaderValue: domainMetadata.customDomainHeaderValue,
	} as Metadata;
};
