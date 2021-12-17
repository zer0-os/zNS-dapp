import { GenericTable } from 'components';
import StakePoolTableRow from './StakePoolTableRow';

import { useStaking } from 'lib/providers/staking/StakingSDKProvider';

import styles from './StakePoolTable.module.scss';

import { TABLE_HEADERS } from './StakePoolTable.helpers';
import { useWeb3React } from '@web3-react/core';
import { ConnectWalletButton } from 'containers';

const StakePoolTable = () => {
	const staking = useStaking();
	const { active } = useWeb3React();

	const pools = staking.pools ? Object.values(staking.pools) : undefined;

	if (!active) {
		return (
			<div className={styles.Container}>
				<p>Connect a Web3 wallet to view Stake pools</p>
				<ConnectWalletButton>Connect Wallet</ConnectWalletButton>
			</div>
		);
	} else {
		return (
			<GenericTable
				alignments={[0, 0, 1, 1, 1, 1, 1]}
				className={styles.Table}
				data={pools}
				headers={TABLE_HEADERS}
				isLoading={pools === undefined}
				itemKey={'id'}
				loadingText={'Loading Stake Pools'}
				rowComponent={StakePoolTableRow}
			/>
		);
	}
};

export default StakePoolTable;
