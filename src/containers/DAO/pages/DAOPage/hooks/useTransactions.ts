import { zDAO } from '@zero-tech/zdao-sdk';
import { Transaction } from '@zero-tech/zdao-sdk/lib/types';
import { useEffect, useState } from 'react';

type UseTransactionsReturn = {
	transactions?: Transaction[];
	isLoading: boolean;
};

type TransactionCache = {
	[zna: string]: {
		transactions?: Transaction[];
	};
};

const cache: TransactionCache = {};

const cacheKey = 'safeAddress';

const useTransactions = (dao?: zDAO): UseTransactionsReturn => {
	const [transactions, setTransactions] = useState<Transaction[] | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		let isMounted = true;
		if (!dao) {
			return;
		}
		setIsLoading(true);
		setTransactions(undefined);
		try {
			if (cache[dao[cacheKey]]) {
				setTransactions(cache[dao[cacheKey]].transactions);
				setIsLoading(false);
			}
			dao?.listTransactions().then((t) => {
				cache[dao[cacheKey]] = {
					transactions: t,
				};
				if (isMounted) {
					setTransactions(t);
					setIsLoading(false);
				}
			});
		} catch (e) {
			if (isMounted) {
				console.error(e);
				setIsLoading(false);
			}
		}
		return () => {
			isMounted = false;
		};
	}, [dao]);

	return {
		transactions,
		isLoading,
	};
};

export default useTransactions;
