export * from './domains';

interface DomainMetadataParams {
	image: Buffer;
	name: string;
	story: string;
}

interface UploadResponseDTO {
	fleekHash: string;
	hash: string;
	url: string;
}

const uploadApiEndpoint = `https://zns-backend.herokuapp.com/api/upload`;

/**
 * Creates and uploads a domains metadata to IPFS
 * @param params Metadata parameters
 * @returns URI to the created Metadata
 */

export const createDomainMetadata = async (params: DomainMetadataParams) => {
	// upload image to http backend

	const imageResponse = await fetch(uploadApiEndpoint, {
		method: 'POST',
		body: params.image,
	});
	const image = (await imageResponse.json()) as UploadResponseDTO;

	// upload metadata to IPFS
	const metadataObject = {
		name: params.name,
		description: params.story,
		image: image.url,
	};
	const metadataAsString = JSON.stringify(metadataObject);

	const metadataResponse = await fetch(uploadApiEndpoint, {
		method: 'POST',
		body: metadataAsString,
	});
	const metadata = (await metadataResponse.json()) as UploadResponseDTO;

	return metadata.url;
};

/**
 * Uploads some data to IPFS.
 * @param data Data to upload
 * @returns Uri to uploaded data
 */
export const uploadToIPFS = async (data: string | Buffer) => {
	const uploadedResponse = await fetch(uploadApiEndpoint, {
		method: 'POST',
		body: data,
	});
	const uploaded = (await uploadedResponse.json()) as UploadResponseDTO;
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
