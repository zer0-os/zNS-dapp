import { useZnsContracts } from 'lib/contracts';
import { createDomainMetadata } from 'lib/utils';
import { Maybe, NftParams } from 'lib/types';
import { ethers } from 'ethers';

export function useBasicController() {
	const basicController = useZnsContracts()?.basicController;

	const registerSubdomain = async (
		params: NftParams,
		setStatus: (status: string) => void,
	): Promise<ethers.ContractTransaction> => {
		if (!basicController) {
			throw Error(`No basic controller.`);
		}

		// get metadata uri
		let metadataUri: Maybe<string>;
		setStatus(`Uploading metadata`);

		try {
			metadataUri = await createDomainMetadata({
				previewImage: params.previewImage,
				image: params.image,
				name: params.name,
				story: params.story,
			});
		} catch (e) {
			console.error(e);
			throw Error(`Failed to upload metadata.`);
		}

		setStatus(`Waiting for transaction to be approved by wallet`);
		// register subdomain
		let tx: Maybe<ethers.ContractTransaction>;
		try {
			tx = await basicController.registerSubdomainExtended(
				params.parent,
				params.domain,
				params.owner,
				metadataUri,
				0,
				params.locked,
			);
		} catch (e) {
			console.error(e);
			if (e.code === 4001) {
				throw Error(`Transaction rejected by wallet.`);
			}
			throw Error(`Failed to submit transaction.`);
		}

		return tx;
	};

	return { registerSubdomain };
}
