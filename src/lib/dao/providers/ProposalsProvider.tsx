import React, { useState } from 'react';
import type { Proposal } from '@zero-tech/zdao-sdk';
import { useCurrentDao } from './CurrentDaoProvider';

export const ProposalsContext = React.createContext({
	proposals: undefined as Proposal[] | undefined,
	isInitialFetching: false,
	isRefetching: false,
	fetch: () => {},
});

/**
 * Loads Proposals at current DAO
 */
export const ProposalsProvider: React.FC = ({ children }) => {
	const { dao } = useCurrentDao();

	const [proposals, setProposals] = useState<Proposal[] | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetch = () => {
		if (!isLoading) {
			setIsLoading(true);
			dao
				?.listProposals()
				.then((p) => {
					// Filtering by date for prototype & metadata
					setProposals(
						p.filter(
							(p) => p.created.getTime() > 1653041437000 && Boolean(p.metadata),
						),
					);
				})
				.catch((e) => {
					console.error(e);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	const context = {
		proposals,
		isInitialFetching: !Boolean(proposals) && isLoading,
		isRefetching: Boolean(proposals) && isLoading,
		fetch,
	};

	return (
		<ProposalsContext.Provider value={context}>
			{children}
		</ProposalsContext.Provider>
	);
};

export function useProposals() {
	const context = React.useContext(ProposalsContext);

	return context;
}
