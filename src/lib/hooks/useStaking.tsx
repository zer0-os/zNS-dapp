import { useMemo, useCallback } from 'react';
import { ethers } from 'ethers';
import {
	DomainRequestAndContents,
	DomainRequestContents,
	Maybe,
	NftStatusCard,
	StakingRequest,
} from 'lib/types';
import {
	createDomainMetadata,
	UploadedDomainMetadata,
	uploadToIPFS,
} from 'lib/utils';
import useNotification from 'lib/hooks/useNotification';
import { useStakingController } from 'lib/hooks/useStakingController';
import { useStakingRedux } from 'store/staking/hooks';

export type UseStakingReturn = {
	requesting: NftStatusCard[];
	requested: NftStatusCard[];
	approving: DomainRequestAndContents[];
	approved: DomainRequestAndContents[];
	fulfilling: DomainRequestAndContents[];
	fulfilled: DomainRequestAndContents[];
	placeRequest: (
		params: StakingRequest,
		setStatus: (status: string) => void,
	) => Promise<ethers.ContractTransaction | void>;
	approveRequest: (
		params: DomainRequestAndContents,
	) => Promise<ethers.ContractTransaction | void>;
	fulfillRequest: (
		params: DomainRequestAndContents,
	) => Promise<ethers.ContractTransaction | void>;
};

export const useStaking = (): UseStakingReturn => {
	const { addNotification } = useNotification();

	const stakingController = useStakingController();

	const { reduxState, reduxActions } = useStakingRedux();

	const placeRequest = useCallback(
		async (params: StakingRequest, setStatus: (status: string) => void) => {
			// @todo better validation
			if (/[A-Z]/.test(params.nft.domain)) {
				throw Error(
					`Invalid domain name: ${params.nft.domain} (Uppercase characters)`,
				);
			}

			setStatus(`Uploading metadata`);

			let metadata: Maybe<UploadedDomainMetadata>;

			// Create the intended metadata
			try {
				metadata = await createDomainMetadata({
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
				metadata: metadata.url,
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

			setStatus(`Waiting for transaction to be approved by wallet`);
			const tx = await stakingController.placeRequest({
				requestor: params.requestor,
				stakeAmount: params.stakeAmount,
				stakeCurrency: params.stakeCurrency,
				parentId: params.nft.parent,
				domain: params.nft.domain,
				domainRequestUri,
			});

			if (!tx) {
				addNotification(
					'Encountered an error while attempting to place request.',
				);

				throw Error(`Failed to submit transaction`);
			}

			const domainStatusCard: NftStatusCard = {
				zNA: params.nft.zna,
				title: params.nft.name,
				imageUri: metadata.contents.image,
				story: params.nft.story,
				stakeAmount: params.stakeAmount,
				transactionHash: tx.hash,
			};

			// start requesting
			addNotification(`Placing request to mint ${params.nft.name}`);
			reduxActions.setRequesting(domainStatusCard);

			// in requesting
			await tx.wait();

			// completed requesting => requested
			addNotification(
				`Successfully placed request to mint ${domainStatusCard.title}.`,
			);
			reduxActions.setRequested(domainStatusCard);

			return tx;
		},
		[stakingController, reduxActions, addNotification],
	);

	const approveRequest = useCallback(
		async (params: DomainRequestAndContents) => {
			const tx = await stakingController.approveRequest(params.request.id);
			if (!tx) {
				addNotification(
					'Encountered an error while attempting to approve request.',
				);
				return;
			}

			// start approving
			addNotification(`Approving request to mint ${params.contents.domain}`);
			reduxActions.setApproving(params);

			// in approving
			await tx.wait();

			// completed approving => approved
			addNotification(
				`Successfully approved request to mint ${params.contents.domain}.`,
			);
			reduxActions.setApproved(params);

			return tx;
		},
		[stakingController, reduxActions, addNotification],
	);

	const fulfillRequest = useCallback(
		async (params: DomainRequestAndContents) => {
			const tx = await stakingController.fulfillRequest({
				requestId: params.request.id,
				metadataUri: params.contents.metadata,
				locked: true,
			});

			if (!tx) {
				addNotification(
					'Encountered an error while attempting to fulfill request.',
				);
				return;
			}

			// start fulfilling
			addNotification(`Minting ${params.contents.domain}`);
			reduxActions.setFulfilling(params);

			// in fulfilling
			await tx.wait();

			// completed fulfilling => fulfilled
			addNotification(`Successfully minted ${params.contents.domain}.`);
			reduxActions.setFulfilled(params);

			return tx;
		},
		[stakingController, reduxActions, addNotification],
	);

	return useMemo(
		() => ({
			requesting: reduxState.requesting,
			requested: reduxState.requested,
			approving: reduxState.approving,
			approved: reduxState.approved,
			fulfilling: reduxState.fulfilling,
			fulfilled: reduxState.fulfilled,
			placeRequest,
			approveRequest,
			fulfillRequest,
		}),
		[reduxState, placeRequest, approveRequest, fulfillRequest],
	);
};
