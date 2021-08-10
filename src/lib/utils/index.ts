import { Metadata } from 'lib/types';

export * from './domains';

interface DomainMetadataParams {
	previewImage?: Buffer;
	image: Buffer;
	name: string;
	story: string;
}

interface UploadResponseDTO {
	fleekHash: string;
	hash: string;
	url: string;
}

const uploadApiEndpoint = `https://zns-backend.netlify.app/.netlify/functions/upload`;

/**
 * Creates and uploads a domains metadata to IPFS
 * @param params Metadata parameters
 * @returns URI to the created Metadata
 */

const uploadImage = async (image: Buffer) => {
	const imageResponse = await fetch(uploadApiEndpoint, {
		method: 'POST',
		body: JSON.stringify(image),
	});
	const imageUploaded = (await imageResponse.json()) as UploadResponseDTO;
	return imageUploaded;
};

const uploadMetadata = async (params: DomainMetadataParams) => {
	// upload images to http backend
	const image = await uploadImage(params.image);

	let metadataObject: Metadata = {
		title: params.name,
		description: params.story,
		image: image.url,
	};

	if (params.previewImage) {
		//if params has the optional preview image it builds metadata with it
		const previewImage = await uploadImage(params.previewImage);
		metadataObject.previewImage = previewImage.url;
	}

	return metadataObject;
};

export const createDomainMetadata = async (params: DomainMetadataParams) => {
	// upload metadata to IPFS
	const metadataObject = await uploadMetadata(params);
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
