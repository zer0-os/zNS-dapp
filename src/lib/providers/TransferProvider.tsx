//- React Imports
import React, { useEffect, useState } from 'react';

//- Type Imports
import useNotification from 'lib/hooks/useNotification';

export interface TransferSubmitParams {
	name: string;
	domain: string; // domain label
	image: string;
	creatorId: string;
	walletAddress: string;
}

export const TransferContext = React.createContext({
	transferring: [{}],
	transferred: [{}],
	submit: (params: TransferSubmitParams) => {},
});

type TransferProviderType = {
	children: React.ReactNode;
};

const TransferProvider: React.FC<TransferProviderType> = ({ children }) => {
	const { addNotification } = useNotification();
	const [transferring, setTransferring] = useState<TransferSubmitParams[]>([]);
	const [transferred, setTransferred] = useState<TransferSubmitParams[]>([]);
	const [
		finishedTransferring,
		setFinishedTransferring,
	] = useState<TransferSubmitParams | null>(null);

	const submit = async (params: TransferSubmitParams) => {
		console.log(params);
		addNotification(`Started transfer`);
		setTransferring([...transferring, params]);
		// todo: close modal

		const finishTransferring = async () => {
			setFinishedTransferring(params);
		};

		// TODO
		setTimeout(() => {
			finishTransferring();
		}, 20 * 1000);
	};

	/* todo: Taken from MintProvider*/
	useEffect(() => {
		if (finishedTransferring) {
			addNotification(`Ownership of "${finishedTransferring.name}" has been transferred`);
			setTransferring(transferring.filter((n) => n !== finishedTransferring));
			setTransferred([...transferred, finishedTransferring]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [finishedTransferring]);

	const contextValue = {
		transferring,
		transferred,
		submit
	};

	return (
		<TransferContext.Provider value={contextValue}>
			{children}
		</TransferContext.Provider>
	);
};

export default TransferProvider;

export function useTransferProvider() {
	const { transferring, submit, transferred } = React.useContext(TransferContext);
	return { transferring, submit, transferred };
}
