//- React Imports
import React, { useState, useEffect } from 'react';

//- Hook Imports
import useNotification from 'lib/hooks/useNotification';
import { Maybe, NftParams, NftStatusCard } from 'lib/types';
import { useBasicController } from '../hooks/useBasicController';
import { ethers } from 'ethers';
import { createDomainMetadata, UploadedDomainMetadata } from 'lib/utils';

export const MintContext = React.createContext({
	minting: [] as NftStatusCard[],
	minted: [] as NftStatusCard[],
	mint: async (nft: NftParams, setStatus: (status: string) => void) => {},
});

type MintProviderType = {
	children: React.ReactNode;
};

const MintProvider: React.FC<MintProviderType> = ({ children }) => {
	const { addNotification } = useNotification();
	const [minting, setMinting] = useState<NftStatusCard[]>([]);
	const [minted, setMinted] = useState<NftStatusCard[]>([]);
	const [finishedMinting, setFinishedMinting] =
		useState<Maybe<NftStatusCard>>(null);
	const basicController = useBasicController();

	// Uncomment to test/dev
	// React.useEffect(() => {
	// 	setMinting([
	// 		...minting,
	// 		{
	// 			zNA: '0://wilder.zachary.vacation.pudding',
	// 			title: 'Title 123',
	// 			imageUri:
	// 				'https://ipfs.fleek.co/ipfs/QmWaJntCvxLsGqWfzzRz88ctYSDKnbJXaUAYsm7jQ1GUs8',
	// 			story: 'this is a story',
	// 			transactionHash:
	// 				'0x28ec32c109f01ef48eff7b4943989cde274633e6a037686609f80892a83bb83e',
	// 		} as NftStatusCard,
	// 	]);

	// 	setMinted([
	// 		...minted,
	// 		{
	// 			zNA: '0://wilder.zachary.vacation.pudding',
	// 			title: 'Title 123',
	// 			imageUri:
	// 				'https://ipfs.fleek.co/ipfs/QmWaJntCvxLsGqWfzzRz88ctYSDKnbJXaUAYsm7jQ1GUs8',
	// 			story: 'this is a story',
	// 			transactionHash:
	// 				'0x28ec32c109f01ef48eff7b4943989cde274633e6a037686609f80892a83bb83e',
	// 		} as NftStatusCard,
	// 	]);
	// }, []);

	const mint = async (nft: NftParams, setStatus: (status: string) => void) => {
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
	};

	return (
		<MintContext.Provider value={contextValue}>{children}</MintContext.Provider>
	);
};

export default MintProvider;

export function useMintProvider() {
	const { minting, mint, minted } = React.useContext(MintContext);
	return { minting, mint, minted };
}
