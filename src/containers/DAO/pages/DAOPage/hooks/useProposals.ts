import { zDAO, Proposal } from '@zero-tech/zdao-sdk';
import { useEffect, useState } from 'react';

type UseProposalsReturn = {
	proposals?: Proposal[];
	isLoading: boolean;
};

const useProposals = (dao?: zDAO): UseProposalsReturn => {
	const [proposals, setProposals] = useState<Proposal[] | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setProposals(undefined);
		setIsLoading(true);
		dao
			?.listProposals()
			.then((p) => {
				setProposals(p);
			})
			.catch((e) => {
				console.error(e);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [dao]);

	return {
		proposals,
		isLoading,
	};
};

export default useProposals;
