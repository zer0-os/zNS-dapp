export * from './domains';

interface DomainMetadataParams {
	image: Buffer;
	name: string;
	story: string;
}

interface UploadResponseInterface {
	fleekHash: string;
	hash: string;
	url: string;
}

const apiEndpoint = `https://zns-backend.netlify.app/.netlify/functions/upload`;

/**
 * Creates and uploads a domains metadata to IPFS
 * @param params Metadata parameters
 * @returns URI to the created Metadata
 */

export const createDomainMetadata = async (params: DomainMetadataParams) => {
	// upload image to http backend

	const imageResponse = await fetch(apiEndpoint, {
		method: 'POST',
		body: JSON.stringify(params),
	});
	const image = (await imageResponse.json()) as UploadResponseInterface;

	// upload metadata to IPFS
	const metadataObject = {
		name: params.name,
		description: params.story,
		image: image.url,
	};
	const metadataAsString = JSON.stringify(metadataObject);

	const metadataResponse = await fetch(apiEndpoint, {
		method: 'POST',
		body: metadataAsString,
	});
	const metadata = (await metadataResponse.json()) as UploadResponseInterface;

	return metadata.url;
};

/**
 * Uploads some data to IPFS.
 * @param data Data to upload
 * @returns Uri to uploaded data
 */
export const uploadToIPFS = async (data: string | Buffer) => {
	const uploadedResponse = await fetch(apiEndpoint, {
		method: 'POST',
		body: data,
	});
	const uploaded = (await uploadedResponse.json()) as UploadResponseInterface;
	return uploaded.url;
};

export async function tryFunction<T>(func: () => Promise<T>, msg: string) {
	try {
		return await func();
	} catch (e) {
		if (e.message || e.data) {
			throw Error(`Failed to ${msg}: ${e.data} ${e.message}`);
		}
		throw Error(`Failed to ${msg}: ${e}`);
	}
}
