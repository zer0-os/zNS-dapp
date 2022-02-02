//- React Imports
import React, { useState, useEffect } from 'react';

//- Hook Imports
import useNotification from 'lib/hooks/useNotification';
import { Maybe, NftParams, NftStatusCard } from 'lib/types';
import * as wheels from 'lib/wheelSale';
import { useZnsContracts } from 'lib/contracts';
import { useBasicController } from '../hooks/useBasicController';
import { ethers } from 'ethers';
import { createDomainMetadata, UploadedDomainMetadata } from 'lib/utils';

export const MintContext = React.createContext({
	minting: [] as NftStatusCard[],
	minted: [] as NftStatusCard[],
	mint: async (nft: NftParams, setStatus: (status: string) => void) => {},
	mintWheels: async (
		numWheels: number,
		setStatus: (status: string) => void,
		onFinish: () => void,
		onError: (error: string) => void,
	) => {},
});

type MintProviderType = {
	children: React.ReactNode;
};

const MintProvider: React.FC<MintProviderType> = ({ children }) => {
	///////////////////////
	// State & Variables //
	///////////////////////

	const { addNotification } = useNotification();
	const [minting, setMinting] = useState<NftStatusCard[]>([]);
	const [minted, setMinted] = useState<NftStatusCard[]>([]);
	const [finishedMinting, setFinishedMinting] =
		useState<Maybe<NftStatusCard>>(null);
	const basicController = useBasicController();

	const contracts = useZnsContracts();
	const saleContract = contracts?.wheelSale;

	///////////////
	// Functions //
	///////////////

	const mintWheels = async (
		numWheels: number,
		setStatus: (status: string) => void,
		onFinish: () => void,
		onError: (error: string) => void,
	) => {
		// Set up default wheel to render
		const wheel = {
			zNA: '',
			title: 'Your Crib',
			imageUri:
				'https://res.cloudinary.com/fact0ry/image/upload/fl_lossy,q_50,c_fill,h_200,w_200/v1632961649/zns/cribs-mint-progress.gif',
			story: '',
			transactionHash: '',
		};

		if (!saleContract) {
			return;
		}

		//////////////////////////////////////
		// Get approval for the transaction //
		//////////////////////////////////////

		let tx: Maybe<ethers.ContractTransaction>;
		setStatus('Confirm wallet transaction to begin minting your Crib');

		const network = await saleContract.provider.getNetwork();

		try {
			tx = await wheels.purchaseWheels(
				numWheels,
				saleContract,
				network.chainId === 1,
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
			'Minting your Crib... this may take up to 20 minutes if the network is busy. You may close this and the transaction will continue in the backround. When minting is complete, your Crib will be in your profile.',
		);
		setMinting([...minting, wheel]);
		await tx.wait();

		//////////////////////////
		// Transaction complete //
		//////////////////////////

		addNotification(`Successfully minted a Crib. Open your Profile to view it`);
		const index = minting.findIndex((d) => d.title === 'Your Wheels');
		setMinting(minting.splice(index, 1));
		setMinted([...minted, wheel]);

		onFinish();
	};

	const mint = async (nft: NftParams, setStatus: (status: string) => void) => {
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
		setMinting([...minting, nftStatusCard]);

		const finishMinting = async () => {
			await tx!.wait();
			setFinishedMinting(nftStatusCard);
		};

		finishMinting();
	};

	// TODO: Change this hook to run when minting finishes
	useEffect(() => {
		if (finishedMinting) {
			addNotification(`Finished minting ${finishedMinting.title}.`);
			setMinting(minting.filter((n) => n !== finishedMinting));
			setMinted([...minted, finishedMinting]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [finishedMinting]);

	const contextValue = {
		minting,
		minted,
		mint,
		mintWheels,
	};

	return (
		<MintContext.Provider value={contextValue}>{children}</MintContext.Provider>
	);
};

export default MintProvider;

export function useMintProvider() {
	const { minting, mint, minted, mintWheels } = React.useContext(MintContext);
	return { minting, mint, minted, mintWheels };
}
