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

const uploadData = async (dataToUpload: string | Buffer | Metadata) => {
	const dataResponse = await fetch(uploadApiEndpoint, {
		method: 'POST',
		body: JSON.stringify(dataToUpload),
	});
	const dataUploaded = (await dataResponse.json()) as UploadResponseDTO;
	return dataUploaded;
};

const uploadMetadata = async (params: DomainMetadataParams) => {
	// upload images to http backend
	const image = await uploadData(params.image);

	let metadataObject: Metadata = {
		title: params.name,
		description: params.story,
		image: image.url,
	};

	if (params.previewImage) {
		//if params has the optional preview image it builds metadata with it
		const previewImage = await uploadData(params.previewImage);
		metadataObject.previewImage = previewImage.url;
	}

	return metadataObject;
};

export const createDomainMetadata = async (params: DomainMetadataParams) => {
	// upload metadata to IPFS
	const metadataObject = await uploadMetadata(params);
	const metadata = await uploadData(metadataObject);

	return metadata.url;
};

/**
 * Uploads some data to IPFS.
 * @param data Data to upload
 * @returns Uri to uploaded data
 */
export const uploadToIPFS = async (data: string | Buffer) => {
	const uploaded = await uploadData(data);
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
