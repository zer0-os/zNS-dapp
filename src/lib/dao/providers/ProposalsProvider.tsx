import React, { useState } from 'react';
import type { Proposal } from '@zero-tech/zdao-sdk';
import { useCurrentDao } from './CurrentDaoProvider';
import { sortProposals } from 'containers/DAO/pages/DAOPage/Proposals/Proposals.helpers';

export const ProposalsContext = React.createContext({
	proposals: undefined as Proposal[] | undefined,
	isInitialFetching: false,
	isRefetching: false,
	fetch: () => {},
	updateProposal: (proposal: Proposal) => {},
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
				.then((proposals) => {
					setProposals(sortProposals(proposals));
				})
				.catch((e) => {
					console.error(e);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	const updateProposal = (proposal: Proposal) => {
		const matchingProposal = proposals?.find((p) => p.id === proposal.id);

		if (matchingProposal) {
			const excludedProposals = proposals?.filter(
				(p) => p.id !== matchingProposal.id,
			)!;
			setProposals(sortProposals([...excludedProposals, proposal]));
		}
	};

	const context = {
		proposals,
		isInitialFetching: !Boolean(proposals) && isLoading,
		isRefetching: Boolean(proposals) && isLoading,
		fetch,
		updateProposal,
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
