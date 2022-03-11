import useDaoTransactions from './hooks/useDaoTransactions';
import { Transaction } from './hooks/useDaoTransaction.types';
import History from './components/History/History';
import { truncateAddress } from 'lib/utils';
import { ethers } from 'ethers';
import styles from './Transactions.module.scss';
import { LoadingIndicator } from 'components';
import { useState } from 'react';

const toHistoryItem = (transaction: Transaction) => {
	const asset = transaction.amount
		? ethers.utils.formatEther(transaction.amount) + ' ' + transaction.asset
		: transaction.asset;

	return {
		event: (
			<span className={styles.Transaction}>
				<div className={styles.Icon}></div>
				<span>
					{transaction.action} <b>{asset}</b> to{' '}
					<b>{truncateAddress(transaction.address)}</b>
				</span>
			</span>
		),
		date: transaction.date,
	};
};

const Transactions = () => {
	const { transactions, isLoading, refetch } = useDaoTransactions('test');

	if (isLoading) {
		return (
			<LoadingIndicator
				className={styles.Loading}
				text="Loading Transactions"
			/>
		);
	}

	if (!transactions) {
		return <p>Nothing to show</p>;
	}

	return <History items={transactions?.map(toHistoryItem)} />;
};

export default Transactions;
