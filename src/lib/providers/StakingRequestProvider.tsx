//- React Imports
import React, { useState, useEffect } from 'react';

//- Hook Imports
import useNotification from 'lib/hooks/useNotification';
import {
	DomainRequestParams,
	useStakingController,
} from 'lib/hooks/useStakingController';
import { DomainRequestAndContents } from 'lib/types';
import { ethers } from 'ethers';

interface StakingRequestProviderContext {
	requesting: DomainRequestParams[];
	requested: DomainRequestParams[];
	placeRequest: (
		params: DomainRequestParams,
	) => Promise<ethers.ContractTransaction | void>;
	approving: DomainRequestAndContents[];
	approved: DomainRequestAndContents[];
	approveRequest: (
		params: DomainRequestAndContents,
	) => Promise<ethers.ContractTransaction | void>;
}

export const StakingRequestContext = React.createContext<StakingRequestProviderContext>(
	{
		requesting: [],
		requested: [],
		placeRequest: async (params: DomainRequestParams) => {},
		approving: [],
		approved: [],
		approveRequest: async (params: DomainRequestAndContents) => {},
	},
);

type StakingRequestProviderType = {
	children: React.ReactNode;
};

const StakingRequestProvider: React.FC<StakingRequestProviderType> = ({
	children,
}) => {
	const { addNotification } = useNotification();

	const [requesting, setRequesting] = useState<DomainRequestParams[]>([]);
	const [requested, setRequested] = useState<DomainRequestParams[]>([]);

	const [approving, setApproving] = useState<DomainRequestAndContents[]>([]);
	const [approved, setApproved] = useState<DomainRequestAndContents[]>([]);

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

			addNotification(
				`Successfully placed request to mint ${params.nft.name}.`,
			);
			setRequesting(requesting.filter((n) => n !== params));
			requested.push(params);
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

	const contextValue = {
		requesting,
		requested,
		placeRequest,
		approving,
		approved,
		approveRequest,
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
