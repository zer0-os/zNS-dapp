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

		const response = await fetch(metadataUrl);
		const data = await response.json();
		const metadata = {
			title: data.name || data.title,
			description: data.description,
			image: data.image,
		} as Metadata;

		memoryCache[metadataUrl] = metadata;

		return metadata;
	} catch (e) {
		console.error('Failed to retrieve metadata from ' + metadataUrl);
		return;
	}
}
