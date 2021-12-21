import { GenericTable } from 'components';
import StakePoolTableRow from './StakePoolTableRow';

import { useStaking } from 'lib/providers/staking/StakingSDKProvider';

import styles from './StakePoolTable.module.scss';

import {
	TABLE_HEADERS,
	TABLE_HEADERS_DISCONNECTED,
} from './StakePoolTable.helpers';
import { useWeb3React } from '@web3-react/core';

const StakePoolTable = () => {
	const staking = useStaking();
	const { account } = useWeb3React();

	const pools = staking.pools ? Object.values(staking.pools) : undefined;

	return (
		<GenericTable
			alignments={[0, 0, 1, 1, 1, 1, 1]}
			className={styles.Table}
			data={pools}
			headers={account ? TABLE_HEADERS : TABLE_HEADERS_DISCONNECTED}
			isLoading={pools === undefined}
			itemKey={'id'}
			loadingText={'Loading Stake Pools'}
			rowComponent={StakePoolTableRow}
		/>
	);
};

export default StakePoolTable;
