//- React Imports
import React, { useState } from 'react';

//- Hook Imports
import useNotification from 'lib/hooks/useNotification';
import { useStakingController } from 'lib/hooks/useStakingController';
import {
	DomainRequestAndContents,
	DomainRequestContents,
	Maybe,
	NftParams,
	NftStatusCard,
} from 'lib/types';
import { ethers } from 'ethers';
import {
	createDomainMetadata,
	UploadedDomainMetadata,
	uploadToIPFS,
} from 'lib/utils';

export interface StakingRequest {
	requestor: string;
	stakeAmount: string;
	stakeCurrency: string;
	nft: NftParams;
}

interface StakingRequestProviderContext {
	requesting: NftStatusCard[];
	requested: NftStatusCard[];
	placeRequest: (
		params: StakingRequest,
		setStatus: (status: string) => void,
	) => Promise<ethers.ContractTransaction | void>;
	approving: DomainRequestAndContents[];
	approved: DomainRequestAndContents[];
	approveRequest: (
		params: DomainRequestAndContents,
	) => Promise<ethers.ContractTransaction | void>;
	fulfilling: DomainRequestAndContents[];
	fulfilled: DomainRequestAndContents[];
	fulfillRequest: (
		params: DomainRequestAndContents,
	) => Promise<ethers.ContractTransaction | void>;
}

export const StakingRequestContext =
	React.createContext<StakingRequestProviderContext>({
		requesting: [],
		requested: [],
		placeRequest: async (
			params: StakingRequest,
			setStatus: (status: string) => void,
		) => {},
		approving: [],
		approved: [],
		approveRequest: async (params: DomainRequestAndContents) => {},
		fulfilling: [],
		fulfilled: [],
		fulfillRequest: async (params: DomainRequestAndContents) => {},
	});

type StakingRequestProviderType = {
	children: React.ReactNode;
};

const StakingRequestProvider: React.FC<StakingRequestProviderType> = ({
	children,
}) => {
	const { addNotification } = useNotification();

	const [requesting, setRequesting] = useState<NftStatusCard[]>([]);
	const [requested, setRequested] = useState<NftStatusCard[]>([]);

	const [approving, setApproving] = useState<DomainRequestAndContents[]>([]);
	const [approved, setApproved] = useState<DomainRequestAndContents[]>([]);

	const [fulfilling, setFulfilling] = useState<DomainRequestAndContents[]>([]);
	const [fulfilled, setFulfilled] = useState<DomainRequestAndContents[]>([]);

	const stakingController = useStakingController();

	// uncomment for dev/test
	// React.useEffect(() => {
	// 	setRequesting([
	// 		...requesting,
	// 		{
	// 			zNA: '0://wilder.zachary.vacation.pudding',
	// 			title: 'Title 123',
	// 			imageUri:
	// 				'https://ipfs.fleek.co/ipfs/QmWaJntCvxLsGqWfzzRz88ctYSDKnbJXaUAYsm7jQ1GUs8',
	// 			story: 'this is a story',
	// 			stakeAmount: '300',
	// 			transactionHash:
	// 				'0x28ec32c109f01ef48eff7b4943989cde274633e6a037686609f80892a83bb83e',
	// 		} as NftStatusCard,
	// 	]);

	// 	setRequested([
	// 		...requested,
	// 		{
	// 			zNA: '0://wilder.zachary.vacation.pudding',
	// 			title: 'Title 123',
	// 			imageUri:
	// 				'https://ipfs.fleek.co/ipfs/QmWaJntCvxLsGqWfzzRz88ctYSDKnbJXaUAYsm7jQ1GUs8',
	// 			story: 'this is a story',
	// 			stakeAmount: '300',
	// 			transactionHash:
	// 				'0x28ec32c109f01ef48eff7b4943989cde274633e6a037686609f80892a83bb83e',
	// 		} as NftStatusCard,
	// 	]);
	// }, []);

	const placeRequest = async (
		params: StakingRequest,
		setStatus: (status: string) => void,
	) => {
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

		addNotification(`Placing request to mint ${params.nft.name}`);

		const domainStatusCard: NftStatusCard = {
			zNA: params.nft.zna,
			title: params.nft.name,
			imageUri: metadata.contents.image,
			story: params.nft.story,
			stakeAmount: params.stakeAmount,
			transactionHash: tx.hash,
		};

		setRequesting([...requesting, domainStatusCard]);

		const finishStakingRequesting = async () => {
			await tx.wait();

			addNotification(
				`Successfully placed request to mint ${domainStatusCard.title}.`,
			);
			setRequesting(requesting.filter((n) => n !== domainStatusCard));
			requested.push(domainStatusCard);
			setRequested(requested);
		};

		finishStakingRequesting();

		return tx;
	};

	const approveRequest = async (params: DomainRequestAndContents) => {
		const tx = await stakingController.approveRequest(params.request.id);
		if (!tx) {
			addNotification(
				'Encountered an error while attempting to approve request.',
			);
			return;
		}

		addNotification(`Approving request to mint ${params.contents.domain}`);
		setApproved([...approving, params]);

		const waitForTx = async () => {
			await tx.wait();

			addNotification(
				`Successfully approved request to mint ${params.contents.domain}.`,
			);
			setApproving(approving.filter((n) => n !== params));
			approved.push(params);
			setApproved(approved);
		};

		waitForTx();

		return tx;
	};

	const fulfillRequest = async (params: DomainRequestAndContents) => {
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

		addNotification(`Minting ${params.contents.domain}`);
		setFulfilling([...fulfilling, params]);

		const waitForTx = async () => {
			await tx.wait();

			addNotification(`Successfully minted ${params.contents.domain}.`);
			setFulfilling(fulfilling.filter((n) => n !== params));
			fulfilled.push(params);
			setFulfilled(fulfilled);
		};

		waitForTx();

		return tx;
	};

	const contextValue = {
		requesting,
		requested,
		placeRequest,
		approving,
		approved,
		approveRequest,
		fulfilling,
		fulfilled,
		fulfillRequest,
	};

	return (
		<StakingRequestContext.Provider value={contextValue}>
			{children}
		</StakingRequestContext.Provider>
	);
};

export default StakingRequestProvider;

export const useStakingProvider = () => {
	const context = React.useContext(StakingRequestContext);
	return context;
};
