import { zDAO } from '@zero-tech/zdao-sdk';
import { Transaction } from '@zero-tech/zdao-sdk/lib/types';
import { useEffect, useState } from 'react';

type UseTransactionsReturn = {
	transactions?: Transaction[];
	isLoading: boolean;
};

const useTransactions = (dao?: zDAO): UseTransactionsReturn => {
	const [transactions, setTransactions] = useState<Transaction[] | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (!dao) {
			return;
		}
		setIsLoading(true);
		setTransactions(undefined);
		try {
			dao?.listTransactions().then(setTransactions);
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, [dao]);

	return {
		transactions,
		isLoading,
	};
};

export default useTransactions;
