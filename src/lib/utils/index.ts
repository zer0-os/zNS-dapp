import ipfsClient from 'lib/ipfs-client';

interface DomainMetadataParams {
	image: Buffer;
	name: string;
	story: string;
}

/**
 * Creates and uploads a domains metadata to IPFS
 * @param params Metadata parameters
 * @returns URI to the created Metadata
 */
export const createDomainMetadata = async (params: DomainMetadataParams) => {
	// upload image to IPFS
	const { path: imageCid } = await ipfsClient.add(params.image);

	// upload metadata to IPFS
	const metadataObject = {
		name: params.name,
		description: params.story,
		image: `https://ipfs.io/ipfs/${imageCid}`,
	};
	const metadataAsString = JSON.stringify(metadataObject);
	const { path: metadataCid } = await ipfsClient.add(metadataAsString);

	return `https://ipfs.io/ipfs/${metadataCid}`;
};

/**
 * Uploads some data to IPFS.
 * @param data Data to upload
 * @returns Uri to uploaded data
 */
export const uploadToIPFS = async (data: string | Buffer) => {
	const { path } = await ipfsClient.add(data);
	const uri = `https://ipfs.io/ipfs/${path}`;
	return uri;
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
