import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZSaleSdk } from 'lib/hooks/sdk';
import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'lib/hooks/useNotification';
import { useBasicController } from 'lib/hooks/useBasicController';
import { Maybe, NftParams, NftStatusCard } from 'lib/types';
import { ethers } from 'ethers';
import { createDomainMetadata, UploadedDomainMetadata } from 'lib/utils';
import { AppState } from 'store';
import {
	setMintingRequest as reduxSetMintingRequest,
	setMintedRequest as reduxSetMintedRequest,
} from 'store/mint/actions';
import { getMinting, getMinted } from 'store/mint/selectors';

export type UseMintReturn = {
	minting: NftStatusCard[];
	minted: NftStatusCard[];
	mint: (nft: NftParams, setStatus: (status: string) => void) => Promise<void>;
	mintWheels: (
		numWheels: number,
		setStatus: (status: string) => void,
		onFinish: () => void,
		onError: (error: string) => void,
	) => Promise<void>;
};

const useMintRedux = () => {
	////////////////////////////////
	//   Redux State & Actions    //
	////////////////////////////////
	const dispatch = useDispatch();

	const reduxState = useSelector((state: AppState) => ({
		minting: getMinting(state),
		minted: getMinted(state),
	}));

	const setMinting = useCallback(
		(params: NftStatusCard) => {
			dispatch(reduxSetMintingRequest(params));
		},
		[dispatch],
	);

	const setMinted = useCallback(
		(params: NftStatusCard) => {
			dispatch(reduxSetMintedRequest(params));
		},
		[dispatch],
	);

	const reduxActions = useMemo(
		() => ({
			setMinting,
			setMinted,
		}),
		[setMinting, setMinted],
	);

	return { reduxState, reduxActions };
};

export const useMint = (): UseMintReturn => {
	////////////////////////
	//  Hooks From Out    //
	////////////////////////

	const { addNotification } = useNotification();
	const { instance: zSaleInstance } = useZSaleSdk();
	const { library } = useWeb3React<Web3Provider>();
	const basicController = useBasicController();
	const { reduxState, reduxActions } = useMintRedux();

	////////////////////////////////
	//      Internal Hooks        //
	////////////////////////////////
	const mintWheels = useCallback(
		async (
			numWheels: number,
			setStatus: (status: string) => void,
			onFinish: () => void,
			onError: (error: string) => void,
		) => {
			// Set up default wheel to render
			const wheel = {
				zNA: '',
				title: 'Your Kicks',
				imageUri:
					'https://res.cloudinary.com/fact0ry/image/upload/fl_lossy,q_50,c_fill,h_290,w_542/v1651090354/zns/kicks-s2-mint-progress.gif',
				story: '',
				transactionHash: '',
			};

			if (!zSaleInstance || !library) {
				return;
			}

			//////////////////////////////////////
			// Get approval for the transaction //
			//////////////////////////////////////

			let tx: Maybe<ethers.ContractTransaction>;
			setStatus('Confirm wallet transaction to begin minting your Kicks');

			try {
				tx = await zSaleInstance.purchaseDomains(
					ethers.BigNumber.from(numWheels),
					library.getSigner(),
				);
			} catch (e) {
				console.error(e);
				onError('Failed to submit transaction');
				return;
			}

			//////////////////////////
			// Send the transaction //
			//////////////////////////

			setStatus(
				'Minting your Kicks... this may take up to 20 minutes if the network is busy. You may close this and the transaction will continue in the background. When minting is complete, your Kicks will be in your profile.',
			);

			reduxActions.setMinting(wheel);

			await tx.wait();

			//////////////////////////
			// Transaction complete //
			//////////////////////////

			addNotification(
				'Successfully minted your Kicks. Open your Profile to view it',
			);

			reduxActions.setMinted(wheel);

			onFinish();
		},
		[reduxActions, addNotification, zSaleInstance, library],
	);

	// TODO: Migrate this once zNS SDK supports minting
	const mint = useCallback(
		async (nft: NftParams, setStatus: (status: string) => void) => {
			// @todo better validation
			if (/[A-Z]/.test(nft.zna)) {
				throw Error(`Invalid domain name: ${nft.zna} (Uppercase characters)`);
			}

			let tx: Maybe<ethers.ContractTransaction>;

			// get metadata uri
			let metadata: Maybe<UploadedDomainMetadata>;
			setStatus(`Uploading metadata`);

			try {
				metadata = await createDomainMetadata({
					previewImage: nft.previewImage,
					image: nft.image,
					name: nft.name,
					story: nft.story,
				});
			} catch (e) {
				console.error(e);
				throw Error(`Failed to upload metadata.`);
			}

			setStatus(`Waiting for transaction to be approved by wallet`);

			tx = await basicController.registerSubdomain({
				parentId: nft.parent,
				label: nft.domain,
				owner: nft.owner,
				isLocked: nft.locked,
				metadataUri: metadata.url,
			});

			addNotification(`Started minting ${nft.name}`);

			const nftStatusCard: NftStatusCard = {
				zNA: nft.zna,
				title: nft.name,
				imageUri: metadata.contents.image,
				story: nft.story,
				transactionHash: tx.hash,
			};

			reduxActions.setMinting(nftStatusCard);

			await tx.wait();

			addNotification(`Finished minting ${nftStatusCard.title}.`);

			reduxActions.setMinted(nftStatusCard);
		},
		[reduxActions, addNotification, basicController],
	);

	return useMemo(
		() => ({
			minting: reduxState.minting,
			minted: reduxState.minted,
			mint,
			mintWheels,
		}),
		[reduxState, mint, mintWheels],
	);
};

export default useMint;
