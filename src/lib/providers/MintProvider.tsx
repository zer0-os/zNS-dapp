//- React Imports
import React, { useState, useEffect } from 'react';

//- Hook Imports
import useNotification from 'lib/hooks/useNotification';
import { Maybe, NftParams } from 'lib/types';
import { useBasicController } from '../hooks/useBasicController';
import { ethers } from 'ethers';

export const MintContext = React.createContext({
	minting: [{}],
	minted: [{}],
	mint: async (nft: NftParams) => {},
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
	const { registerSubdomain } = useBasicController();

	const mint = async (nft: NftParams) => {
		let tx: Maybe<ethers.ContractTransaction>;

		try {
			tx = await registerSubdomain(nft);
		} catch (e) {
			addNotification('Encountered an error while attempting to mint.');
			throw e;
		}

		addNotification(`Started minting ${nft.name}`);
		setMinting([...minting, nft]);

		const finishMinting = async () => {
			await tx!.wait();
			setFinishedMinting(nft);
		};

		finishMinting();
	};

	// TODO: Change this hook to run when minting finishes
	useEffect(() => {
		if (finishedMinting) {
			addNotification(`Finished minting ${finishedMinting.name}.`);
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
