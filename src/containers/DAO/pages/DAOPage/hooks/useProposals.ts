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
				// Filtering by date for prototype
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
	}, [dao]);

	return {
		proposals,
		isLoading,
	};
};

export default useProposals;
