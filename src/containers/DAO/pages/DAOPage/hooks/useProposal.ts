import { zDAO, Proposal, ProposalId } from '@zero-tech/zdao-sdk';
import { useEffect, useState } from 'react';

type UseProposalReturn = {
	proposal?: Proposal;
	isLoading: boolean;
};

const useProposal = (id: ProposalId, dao?: zDAO): UseProposalReturn => {
	const [proposal, setProposal] = useState<Proposal | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setProposal(undefined);
		setIsLoading(true);
		dao
			?.getProposal(id)
			.then((p) => {
				setProposal(p);
			})
			.catch((e) => {
				console.error(e);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [dao, id]);

	return {
		proposal,
		isLoading,
	};
};

export default useProposal;
