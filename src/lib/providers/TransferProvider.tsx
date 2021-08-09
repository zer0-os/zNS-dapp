//- React Imports
import React, { useState } from 'react';

//- Type Imports
import useNotification from 'lib/hooks/useNotification';

//- Lib
import { useZnsContracts } from 'lib/contracts';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

export interface TransferSubmitParams {
	name: string;
	domainId: string;
	domainName: string;
	ownerId: string;
	image: string;
	creatorId: string;
	walletAddress: string;
}

export const TransferContext = React.createContext({
	transferring: [{}],
	transferred: [{}],
	transferRequest: (params: TransferSubmitParams) => {},
});

type TransferProviderType = {
	children: React.ReactNode;
};

const TransferProvider: React.FC<TransferProviderType> = ({ children }) => {
	const { addNotification } = useNotification();
	const [transferring, setTransferring] = useState<TransferSubmitParams[]>([]);
	const [transferred, setTransferred] = useState<TransferSubmitParams[]>([]);

	const registryContract = useZnsContracts()!.registry;
	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;

	const transferRequest = async (params: TransferSubmitParams) => {
		if (!account) {
			console.error('No wallet detected');
			return;
		}
		if (account.toLowerCase() !== params.ownerId.toLowerCase()) {
			console.error('You are not the owner');
			return;
		}

		try {
			const tx = await registryContract.transferFrom(
				account,
				params.walletAddress,
				params.domainId,
			);

			addNotification(`Started transfer`);
			setTransferring([...transferring, params]);

			const finishTransfer = async () => {
				await tx.wait();
				addNotification(`Ownership of "${params.name}" has been transferred`);
				setTransferring(transferring.filter((n) => n !== params));
				setTransferred([...transferred, params]);
			};

			finishTransfer();

			return tx;
		} catch (err) {
			addNotification('Encountered an error while attempting to transfer.');
			throw err;
		}
	};

	const contextValue = {
		transferring,
		transferred,
		transferRequest
	};

	return (
		<TransferContext.Provider value={contextValue}>
			{children}
		</TransferContext.Provider>
	);
};

export default TransferProvider;

export function useTransferProvider() {
	const { transferring, transferRequest, transferred } = React.useContext(TransferContext);
	return { transferring, transferRequest, transferred };
}
