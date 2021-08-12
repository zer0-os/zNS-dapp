import { useZnsContracts } from 'lib/contracts';
import { createDomainMetadata, tryFunction, uploadToIPFS } from 'lib/utils';
import { DomainRequestContents, NftParams } from 'lib/types';
import { ethers } from 'ethers';
export interface DomainRequestParams {
	requestor: string;
	stakeAmount: string;
	stakeCurrency: string;
	nft: NftParams;
}

export interface FulfillRequestParams {
	requestId: string;
	metadataUri: string;
	locked: boolean;
}

export interface FulfillRequestExtendedParams {
	requestId: string;
	nft: NftParams;
}

interface StakingControllerHooks {
	placeRequest: (
		params: DomainRequestParams,
	) => Promise<ethers.ContractTransaction>;
	approveRequest: (requestId: string) => Promise<ethers.ContractTransaction>;
	fulfillRequest: (
		params: FulfillRequestParams,
	) => Promise<ethers.ContractTransaction>;
}

export function useStakingController(): StakingControllerHooks {
	const stakingController = useZnsContracts()?.stakingController;

	const placeRequest = async (params: DomainRequestParams) => {
		const tx = await tryFunction(async () => {
			if (!stakingController) {
				throw Error(`no controller`);
			}

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
				stakeCurrency: params.stakeCurrency,
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
				params.nft.domain,
				domainRequestUri,
			);

			return tx;
		}, `place request`);

		return tx;
	};

	const approveRequest = async (requestId: string) => {
		const tx = await tryFunction(async () => {
			if (!stakingController) {
				throw Error(`no controller`);
			}

			const tx = await stakingController.approveDomainRequest(requestId);

			return tx;
		}, 'approve request');

		return tx;
	};

	const fulfillRequest = async (params: FulfillRequestParams) => {
		const tx = await tryFunction(async () => {
			if (!stakingController) {
				throw Error(`no controller`);
			}

			const tx = await stakingController.fulfillDomainRequest(
				params.requestId,
				0,
				params.metadataUri,
				params.locked,
			);

			return tx;
		}, 'fulfill request');

		return tx;
	};

	return { placeRequest, approveRequest, fulfillRequest };
}
