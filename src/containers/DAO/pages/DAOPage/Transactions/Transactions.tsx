// Components
import History from './components/History/History';
import { LoadingIndicator } from 'components';

// Lib
import { Transaction } from '@zero-tech/zdao-sdk/lib/types';
import { toHistoryItem } from './Transactions.helpers';

// Styles
import styles from './Transactions.module.scss';
import classNames from 'classnames';

type TransactionsProps = {
	isLoading: boolean;
	transactions?: Transaction[];
};

const Transactions = ({ isLoading, transactions }: TransactionsProps) => {
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

	return <History items={transactions?.map(toHistoryItem)} />;
};

export default Transactions;
