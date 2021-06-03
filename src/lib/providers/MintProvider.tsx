//- React Imports
import React, { useState, useEffect } from 'react';

//- Hook Imports
import useNotification from 'lib/hooks/useNotification';
import { useZnsContracts } from 'lib/contracts';
import ipfsClient from 'lib/ipfs-client';

export const MintContext = React.createContext({
	minting: [{}],
	minted: [{}],
	mint: (nft: NFT) => {},
});

type MintProviderType = {
	children: React.ReactNode;
};

type NFT = {
	owner: string;
	parent: string;
	zna: string;
	name: string;
	domain: string; // domain label
	ticker: string;
	story: string;
	image: Buffer;
	dynamic: boolean;
	locked: boolean;
};

const MintProvider: React.FC<MintProviderType> = ({ children }) => {
	const { addNotification } = useNotification();
	const [minting, setMinting] = useState<NFT[]>([]);
	const [minted, setMinted] = useState<NFT[]>([]);
	const [finishedMinting, setFinishedMinting] = useState<NFT | null>(null);
	const basicController = useZnsContracts()?.basicController;

	const mint = (nft: NFT) => {
		if (!basicController) {
			console.error('no controller');
			return;
		}

		const userHasSubmitted = new Promise<void>((resolve, reject) => {
			const doMint = async () => {
				try {
					// upload image to IPFS
					const { path: imageCid } = await ipfsClient.add(nft.image);

					// upload metadata to IPFS
					const metadataObject = {
						name: nft.name,
						description: nft.story,
						image: `https://ipfs.io/ipfs/${imageCid}`,
					};
					const metadataAsString = JSON.stringify(metadataObject);
					const { path: metadataCid } = await ipfsClient.add(metadataAsString);

					// register subdomain
					const tx = await basicController.registerSubdomainExtended(
						nft.parent,
						nft.domain,
						nft.owner,
						`https://ipfs.io/ipfs/${metadataCid}`,
						0,
						nft.locked,
					);

					resolve();

					setMinting([...minting, nft]);
					addNotification(`Started minting ${nft.name}`);

					await tx.wait();
					setFinishedMinting(nft);
				} catch (e) {
					if (e.message || e.data) {
						console.error(`failed to mint: ${e.data} : ${e.message}`);
					}
					console.error(e);

					reject();
					addNotification('Encountered an error while attempting to mint.');
				}
			};

			doMint();
		});

		return userHasSubmitted;
	};

	// TODO: Change this hook to run when minting finishes
	useEffect(() => {
		if (finishedMinting) {
			addNotification(`Finished minting ${finishedMinting.name}`);
			setMinting(minting.filter((n) => n !== finishedMinting));
			setMinted([...minted, finishedMinting]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [finishedMinting]);

	const contextValue = {
		minting,
		minted,
		mint: (nft: NFT) => mint(nft),
	};

	return (
		<MintContext.Provider value={contextValue}>{children}</MintContext.Provider>
	);
};

export default MintProvider;
