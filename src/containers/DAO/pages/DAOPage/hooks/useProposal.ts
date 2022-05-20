import React, { useState } from 'react';
import { zDAO, Proposal, ProposalId, Vote } from '@zero-tech/zdao-sdk';

type UseProposalReturn = {
	proposal?: Proposal;
	isLoading: boolean;
	votes: Vote[];
	isLoadingVotes: boolean;
};

const useProposal = (
	id: ProposalId,
	dao?: zDAO,
	shouldLoadVotes: boolean = true,
): UseProposalReturn => {
	const [proposal, setProposal] = useState<Proposal | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [votes, setVotes] = useState<Vote[]>([]);
	const [isLoadingVotes, setIsLoadingVotes] = useState<boolean>(false);

	const fetchVotes = async (proposal: Proposal) => {
		if (proposal) {
			setIsLoadingVotes(true);
			setVotes([]);

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

	const fetchProposal = async () => {
		if (dao) {
			setProposal(undefined);
			setIsLoading(true);

			try {
				const proposal = await dao.getProposal(id);

				await proposal.getTokenMetadata();

				setProposal(proposal);

				if (shouldLoadVotes) {
					await fetchVotes(proposal);
				}
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		}
	};

	React.useEffect(() => {
		fetchProposal();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dao, id]);

	return {
		proposal,
		isLoading,
		votes,
		isLoadingVotes,
	};
};

export default useProposal;
