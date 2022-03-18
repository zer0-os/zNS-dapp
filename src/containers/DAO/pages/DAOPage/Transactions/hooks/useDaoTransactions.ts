import { useEffect, useRef, useState } from 'react';
import mock from './useDaoTransactions.mock';

type UseDaoTransactionsReturn = {
	transactions?: any[];
	isLoading: boolean;
	refetch: () => void;
};

const useDaoTransactions = (daoId: string): UseDaoTransactionsReturn => {
	const isMounted = useRef<boolean>();
	const [transactions, setAssets] = useState<any[] | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const getAssets = async (): Promise<any[] | undefined> => {
		await new Promise((r) => setTimeout(r, 1500));
		return mock.mockTransactions;
	};

	const refetch = () => {
		getAssets()
			.then((d) => {
				if (isMounted.current) {
					setAssets(d);
					setIsLoading(false);
				}
			})
			.catch((e) => {
				console.error(e);
			});
	};

	useEffect(() => {
		isMounted.current = true;
		refetch();
		return () => {
			isMounted.current = false;
		};
	}, [daoId]);

	return {
		transactions,
		isLoading,
		refetch,
	};
};

export default useDaoTransactions;
