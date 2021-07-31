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

		await new Promise((r) => setTimeout(r, 1500));
		return {
			title: 'mock title',
			description: 'mock description',
			image: `https://picsum.photos/seed/${metadataUrl.substring(
				21,
			)}/${Math.floor(Math.random() * 1000)}/${Math.floor(
				Math.random() * 1000,
			)}`,
		};

		// const response = await fetch(metadataUrl);
		// const data = await response.json();
		// const metadata = {
		// 	title: data.name || data.title,
		// 	description: data.description,
		// 	image: data.image,
		// } as Metadata;

		// if (!metadata.title || !metadata.description || !metadata.image) {
		// 	throw Error();
		// }

		// memoryCache[metadataUrl] = metadata;

		// return metadata;
	} catch (e) {
		console.error('Failed to retrieve metadata from ' + metadataUrl);
		return;
	}
}
