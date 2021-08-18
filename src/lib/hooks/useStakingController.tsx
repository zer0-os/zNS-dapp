import { useZnsContracts } from 'lib/contracts';
import { createDomainMetadata, tryFunction, uploadToIPFS } from 'lib/utils';
import { DomainRequestContents, Maybe, NftParams } from 'lib/types';
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
		setStatus: (status: string) => void,
	) => Promise<ethers.ContractTransaction>;
	approveRequest: (requestId: string) => Promise<ethers.ContractTransaction>;
	fulfillRequest: (
		params: FulfillRequestParams,
	) => Promise<ethers.ContractTransaction>;
}

export function useStakingController(): StakingControllerHooks {
	const stakingController = useZnsContracts()?.stakingController;

	const placeRequest = async (
		params: DomainRequestParams,
		setStatus: (status: string) => void,
	) => {
		if (!stakingController) {
			throw Error(`no controller`);
		}

		setStatus(`Uploading metadata`);

		let domainMetadataUri: Maybe<string>;

		// Create the intended metadata
		try {
			domainMetadataUri = await createDomainMetadata({
				previewImage: params.nft.previewImage,
				image: params.nft.image,
				name: params.nft.name,
				story: params.nft.story,
			});
		} catch (e) {
			console.error(e);
			throw Error(`Failed to upload metadata`);
		}

		// Upload the request data to IPFS
		const fullRequestData: DomainRequestContents = {
			parent: params.nft.parent,
			domain: params.nft.domain,
			requestor: params.requestor,
			stakeAmount: params.stakeAmount,
			stakeCurrency: params.stakeCurrency,
			metadata: domainMetadataUri,
			locked: params.nft.locked,
		};
		setStatus(`Uploading domain request`);

		let domainRequestUri: Maybe<string>;

		try {
			domainRequestUri = await uploadToIPFS(JSON.stringify(fullRequestData));
		} catch (e) {
			console.error(e);
			throw Error(`Failed to upload domain request`);
		}

		// Convert to wei (assumes 18 decimals places on token)
		const offeredAmountInWei = ethers.utils.parseEther(params.stakeAmount);

		setStatus(`Waiting for transaction to be approved by wallet`);
		// Place the request for the domain
		let tx: Maybe<ethers.ContractTransaction>;
		try {
			tx = await stakingController.placeDomainRequest(
				params.nft.parent,
				offeredAmountInWei,
				params.nft.domain,
				domainRequestUri,
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
