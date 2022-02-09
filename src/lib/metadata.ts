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
		let data = await response.json();

		if (data.title) {
			data.name = data.title;
			delete data.title;
		}

		memoryCache[metadataUrl] = data;

		return data as Metadata;
	} catch (e) {
		console.error('Failed to retrieve metadata from ' + metadataUrl);
		return;
	}
}
