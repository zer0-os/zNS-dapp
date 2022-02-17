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
		const metadata = {
			attributes: data.attributes,
			title: data.name || data.title,
			description: data.description,
			image: data.image,
			image_full: data.image_full,
			animation_url: data.animation_url,
		} as Metadata;

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
