import { GenericTable } from 'components';
import DepositTableRow from './DepositTableRow';

import { useStaking } from 'lib/providers/staking/StakingProvider';

import styles from './DepositTable.module.scss';

import { TABLE_HEADERS } from './DepositTable.helpers';

const DepositTable = () => {
	const { deposits } = useStaking();

	return (
		<GenericTable
			alignments={[0, 0, 1, 1, 1, 1, 1]}
			className={styles.Table}
			data={deposits}
			isLoading={deposits === undefined}
			itemKey={'id'}
			headers={TABLE_HEADERS}
			rowComponent={DepositTableRow}
		/>
	);
};

export default DepositTable;
