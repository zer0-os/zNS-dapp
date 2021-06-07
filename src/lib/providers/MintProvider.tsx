//- React Imports
import React, { useState, useEffect } from 'react';

//- Hook Imports
import useNotification from 'lib/hooks/useNotification';
import { useZnsContracts } from 'lib/contracts';
import { createDomainMetadata } from 'lib/utils';
import { NftParams } from 'lib/types';

export const MintContext = React.createContext({
	minting: [{}],
	minted: [{}],
	mint: (nft: NftParams) => {},
});

type MintProviderType = {
	children: React.ReactNode;
};

const MintProvider: React.FC<MintProviderType> = ({ children }) => {
	const { addNotification } = useNotification();
	const [minting, setMinting] = useState<NftParams[]>([]);
	const [minted, setMinted] = useState<NftParams[]>([]);
	const [finishedMinting, setFinishedMinting] = useState<NftParams | null>(
		null,
	);
	const basicController = useZnsContracts()?.basicController;

	const mint = (nft: NftParams) => {
		if (!basicController) {
			console.error('no controller');
			return;
		}

		const userHasSubmitted = new Promise<void>((resolve, reject) => {
			const doMint = async () => {
				try {
					// get metadata uri
					const metadataUri = await createDomainMetadata({
						image: nft.image,
						name: nft.name,
						story: nft.story,
					});

					// register subdomain
					const tx = await basicController.registerSubdomainExtended(
						nft.parent,
						nft.domain,
						nft.owner,
						metadataUri,
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
		mint: (nft: NftParams) => mint(nft),
	};

	return (
		<MintContext.Provider value={contextValue}>{children}</MintContext.Provider>
	);
};

export default MintProvider;
