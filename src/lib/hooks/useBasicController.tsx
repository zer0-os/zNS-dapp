import { useZnsContracts } from 'lib/contracts';
import { createDomainMetadata } from 'lib/utils';
import { NftParams } from 'lib/types';

export function useBasicController() {
	const basicController = useZnsContracts()?.basicController;

	const registerSubdomain = async (params: NftParams) => {
		if (!basicController) {
			console.error(`no controller`);
			return;
		}

		try {
			// get metadata uri
			const metadataUri = await createDomainMetadata({
				previewImage: params.previewImage,
				image: params.image,
				name: params.name,
				story: params.story,
			});

			// register subdomain
			const tx = await basicController.registerSubdomainExtended(
				params.parent,
				params.domain,
				params.owner,
				metadataUri,
				0,
				params.locked,
			);

			return tx;
		} catch (e) {
			if (e.message || e.data) {
				console.error(`failed to mint: ${e.data} : ${e.message}`);
			}
			console.error(e);
		}
	};

	return { registerSubdomain };
}
