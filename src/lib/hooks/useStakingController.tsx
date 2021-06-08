import { useZnsContracts } from 'lib/contracts';
import { createDomainMetadata, uploadToIPFS } from 'lib/utils';
import { DomainRequestContents, NftParams } from 'lib/types';
import { ethers } from 'ethers';
export interface DomainRequestParams {
	requestor: string;
	stakeAmount: string;
	nft: NftParams;
}

export function useStakingController() {
	const stakingController = useZnsContracts()?.stakingController;

	const request = async (params: DomainRequestParams) => {
		if (!stakingController) {
			console.error(`no controller`);
			return;
		}

		const doRequest = async () => {
			try {
				// Create the intended metadata
				const intendedMetadata = await createDomainMetadata({
					image: params.nft.image,
					name: params.nft.name,
					story: params.nft.story,
				});

				// Upload the request data to IPFS
				const fullRequestData: DomainRequestContents = {
					parent: params.nft.parent,
					domain: params.nft.domain,
					requestor: params.requestor,
					stakeAmount: params.stakeAmount,
					metadata: intendedMetadata,
					locked: params.nft.locked,
				};

				const domainRequestUri = await uploadToIPFS(
					JSON.stringify(fullRequestData),
				);

				// Convert to wei (assumes 18 decimals places on token)
				const offeredAmountInWei = ethers.utils.parseEther(params.stakeAmount);

				// Place the request for the domain
				const tx = await stakingController.placeDomainRequest(
					params.nft.parent,
					offeredAmountInWei,
					params.nft.name,
					domainRequestUri,
				);

				return tx;
			} catch (e) {
				if (e.message || e.data) {
					console.error(`failed to request: ${e.data} : ${e.message}`);
				}
				console.error(e);
			}
		};

		doRequest();
	};

	return { request };
}
