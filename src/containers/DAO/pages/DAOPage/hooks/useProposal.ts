import { useState, useEffect } from 'react';
import type { zDAO, Proposal, ProposalId, Vote } from '@zero-tech/zdao-sdk';
import { DAO_CREATE_PROPOSAL } from '../Proposals/Proposals.constants';

type UseProposalReturn = {
	proposal?: Proposal;
	isLoading: boolean;
	votes: Vote[];
	isLoadingVotes: boolean;
};

const useProposal = (
	id: ProposalId,
	dao?: zDAO,
	triggerRefresh: boolean = false,
	shouldLoadVotes: boolean = true,
): UseProposalReturn => {
	const [proposal, setProposal] = useState<Proposal | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [votes, setVotes] = useState<Vote[]>([]);
	const [isLoadingVotes, setIsLoadingVotes] = useState<boolean>(false);

	const fetchVotes = async (
		proposal: Proposal,
		isBackgroundFetching = false,
	) => {
		if (proposal) {
			if (!isBackgroundFetching) {
				setIsLoadingVotes(true);
				setVotes([]);
			}

			try {
				const votes = await proposal.listVotes();

				setVotes(votes);
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoadingVotes(false);
			}
		}
	};

	const fetchProposal = async (isBackgroundFetching = false) => {
		if (dao) {
			if (!isBackgroundFetching) {
				setProposal(undefined);
				setIsLoading(true);
			}

			try {
				const proposal = await dao.getProposal(id);

				setProposal(proposal);

				if (shouldLoadVotes) {
					await fetchVotes(proposal, isBackgroundFetching);
				}
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		}
	};

	useEffect(() => {
		if (id !== DAO_CREATE_PROPOSAL) {
			fetchProposal();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dao, id]);

	useEffect(() => {
		fetchProposal(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerRefresh]);

	return {
		proposal,
		isLoading,
		votes,
		isLoadingVotes,
	};
};

export default useProposal;
