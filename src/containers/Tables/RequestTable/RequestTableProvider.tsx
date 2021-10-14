// React Imports
import React, { createRef, useState } from 'react';
//- Type Imports
import { DomainRequestAndContents } from '../../../lib/types';

import { useStakingProvider } from 'lib/providers/StakingRequestProvider';

type BidProviderType = {
	children: React.ReactNode;
}; // The request we're viewing in the request modal

export const RequestTableContext = React.createContext({
	view: (domain: string) => {
		return;
	},
	onApprove: (request: DomainRequestAndContents) => {
		return;
	},
	viewing: undefined as any,
	loadedRequests: undefined as any,
	setView: (domain: DomainRequestAndContents | undefined): void => {
		return;
	},
	setLoadRequest: (domain: DomainRequestAndContents[]): void => {
		return;
	},
});

const RequestTableProvider: React.FC<BidProviderType> = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	const [loadedRequests, setLoadedRequests] = useState<
		DomainRequestAndContents[]
	>([]);

	// The request we're viewing in the request modal
	const [viewing, setViewing] = useState<
		DomainRequestAndContents | undefined
	>();

	const setView = (domain: DomainRequestAndContents | undefined) => {
		setViewing(domain);
	};

	const setLoadRequest = (domain: DomainRequestAndContents[]) => {
		setLoadedRequests(domain);
	};

	//////////////////
	// Custom Hooks //
	//////////////////

	const staking = useStakingProvider();

	const view = (domainName: string) => {
		if (loadedRequests) {
			const r = loadedRequests?.filter(
				(d: any) => d.request.domain === domainName,
			)[0];
			setViewing(r);
		}
	};

	/* Calls the middleware for approving a request
		 This is passed to the Request modal */
	const onApprove = async (request: DomainRequestAndContents) => {
		try {
			await staking.approveRequest(request);
			setViewing(undefined);
		} catch (e) {
			// Catch thrown when user rejects transaction
			console.error(e);
		}
	};

	const contextValue = {
		view,
		onApprove,
		viewing,
		setView,
		setLoadRequest,
		loadedRequests,
	};

	return (
		<RequestTableContext.Provider value={contextValue}>
			{children}
		</RequestTableContext.Provider>
	);
};

export default RequestTableProvider;

export function useTableProvider() {
	const { view, onApprove, setView, viewing, setLoadRequest, loadedRequests } =
		React.useContext(RequestTableContext);
	return { view, onApprove, setView, viewing, setLoadRequest, loadedRequests };
}
