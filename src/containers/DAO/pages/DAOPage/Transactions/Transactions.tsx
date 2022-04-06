import React from 'react';
// Components
import History from './components/History/History';
import { LoadingIndicator } from 'components';

// Lib
import { Transaction } from '@zero-tech/zdao-sdk/lib/types';
import { toHistoryItem } from './Transactions.helpers';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';

// Styles
import styles from './Transactions.module.scss';
import classNames from 'classnames';
import { useWeb3React } from '@web3-react/core';

type TransactionsProps = {
	isLoading: boolean;
	transactions?: Transaction[];
};

const Transactions: React.FC<TransactionsProps> = ({
	isLoading,
	transactions,
}) => {
	const { chainId } = useWeb3React();
	const networkType = chainIdToNetworkType(chainId);
	const etherscanUri = getEtherscanUri(networkType);

	if (isLoading) {
		return (
			<LoadingIndicator
				className={styles.Loading}
				text="Loading Transactions"
				spinnerPosition="left"
			/>
		);
	}

	if (!transactions?.length) {
		return (
			<p className={classNames(styles.Empty, 'text-center')}>No activity yet</p>
		);
	}

	return (
		<History
			items={transactions?.map((tx) => toHistoryItem(tx, etherscanUri))}
		/>
	);
};

export default Transactions;
