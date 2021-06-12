//- React Imports
import React, { useState, useEffect } from 'react';

//- Hook Imports
import useNotification from 'lib/hooks/useNotification';
import {
	DomainRequestParams,
	useStakingController,
} from 'lib/hooks/useStakingController';

export const StakingRequestContext = React.createContext({
	requesting: [{}],
	requested: [{}],
	placeRequest: async (params: DomainRequestParams) => {},
});

type StakingRequestProviderType = {
	children: React.ReactNode;
};

const StakingRequestProvider: React.FC<StakingRequestProviderType> = ({
	children,
}) => {
	const { addNotification } = useNotification();
	const [requesting, setRequesting] = useState<DomainRequestParams[]>([]);
	const [requested, setRequested] = useState<DomainRequestParams[]>([]);
	const [
		finishedRequesting,
		setFinishedRequesting,
	] = useState<DomainRequestParams | null>(null);
	const stakingController = useStakingController();

	const placeRequest = async (params: DomainRequestParams) => {
		const tx = await stakingController.placeRequest(params);
		if (!tx) {
			addNotification(
				'Encountered an error while attempting to place request.',
			);
			return;
		}

		addNotification(`Placing request to mint ${params.nft.name}`);
		setRequesting([...requesting, params]);

		const finishStakingRequesting = async () => {
			await tx.wait();
			setFinishedRequesting(params);
		};

		finishStakingRequesting();
	};

	// TODO: Change this hook to run when minting finishes
	useEffect(() => {
		if (finishedRequesting) {
			addNotification(
				`Successfully placed request to mint ${finishedRequesting.nft.name}.`,
			);
			setRequesting(requesting.filter((n) => n !== finishedRequesting));
			setRequested([...requested, finishedRequesting]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [finishedRequesting]);

	const contextValue = {
		requesting,
		requested,
		placeRequest,
	};

	return (
		<StakingRequestContext.Provider value={contextValue}>
			{children}
		</StakingRequestContext.Provider>
	);
};

export default StakingRequestProvider;

export const useStakingProvider = () => {
	const { requesting, requested, placeRequest } = React.useContext(
		StakingRequestContext,
	);
	return { requesting, requested, placeRequest };
};
