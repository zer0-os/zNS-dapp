import { zDAO, Proposal } from '@zero-tech/zdao-sdk';
import { useEffect, useState } from 'react';

type UseAssetsReturn = {
	proposals?: Proposal[];
	isLoading: boolean;
};

const useProposals = (dao?: zDAO): UseAssetsReturn => {
	const [proposals, setProposals] = useState<Proposal[] | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setProposals(undefined);
		setIsLoading(true);
		dao
			?.listProposals()
			.then((p) => {
				setProposals(p);
				console.log('found proposals:', p);
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
