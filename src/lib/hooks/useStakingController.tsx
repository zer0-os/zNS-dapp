import { useZnsContracts } from 'lib/contracts';
import { createDomainMetadata, tryFunction, uploadToIPFS } from 'lib/utils';
import { DomainRequestContents, Maybe, NftParams } from 'lib/types';
import { ethers } from 'ethers';
export interface DomainRequestParams {
	requestor: string;
	stakeAmount: string;
	stakeCurrency: string;
	parentId: string;
	domain: string;
	domainRequestUri: string;
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
		// Convert to wei (assumes 18 decimals places on token)
		const offeredAmountInWei = ethers.utils.parseEther(params.stakeAmount);

		// Place the request for the domain
		let tx: Maybe<ethers.ContractTransaction>;
		try {
			tx = await stakingController!.placeDomainRequest(
				params.parentId,
				offeredAmountInWei,
				params.domain,
				params.domainRequestUri,
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
