import type { Proposal, Vote } from '@zero-tech/zdao-sdk';
import { useEffect, useState } from 'react';

type UseProposalVotesReturn = {
	votes: Vote[];
	isLoading: boolean;
};

const useProposalVotes = (proposal?: Proposal): UseProposalVotesReturn => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [votes, setVotes] = useState<Vote[]>([]);

	useEffect(() => {
		setVotes([]);
		setIsLoading(true);
		proposal
			?.listVotes()
			.then((votes: Vote[]) => {
				setVotes(votes);
			})
			.catch((e) => {
				console.error(e);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [proposal]);

	return {
		votes,
		isLoading,
	};
};

export default useProposalVotes;
