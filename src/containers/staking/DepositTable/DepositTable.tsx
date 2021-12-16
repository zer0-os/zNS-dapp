import { GenericTable } from 'components';
import DepositTableRow from './DepositTableRow';

import { useStaking } from 'lib/providers/staking/StakingSDKProvider';

import styles from './DepositTable.module.scss';

import { TABLE_HEADERS } from './DepositTable.helpers';
import { useWeb3React } from '@web3-react/core';
import { ConnectWalletButton } from 'containers';
import { Link } from 'react-router-dom';
import React from 'react';

import * as zfi from '@zero-tech/zfi-sdk';
import { WrappedStakingPool } from 'lib/providers/staking/StakingProviderTypes';
import { MaybeUndefined } from 'lib/types';

export interface WrappedDeposit extends zfi.Deposit {
	pool: WrappedStakingPool;
}

const DepositTable = () => {
	const staking = useStaking();
	const { account } = useWeb3React();

	const [deposits, setDeposits] =
		React.useState<MaybeUndefined<WrappedDeposit[]>>();

	React.useEffect(() => {
		let isMounted = true;

		const fetchDeposits = async () => {
			if (!staking.pools || !account) {
				return;
			}

			let deposits: WrappedDeposit[] = [];

			for (const pool of Object.values(staking.pools) as WrappedStakingPool[]) {
				const wrappedDeposits = (
					await pool.instance.getAllDeposits(account)
				).map((e) => {
					return {
						pool,
						...e,
					} as WrappedDeposit;
				});

				deposits = deposits.concat(wrappedDeposits);
			}

			if (isMounted) {
				setDeposits(deposits);
			}
		};

		fetchDeposits();

		return () => {
			isMounted = false;
		};
	}, [staking.pools, account]);

	const { active } = useWeb3React();

	if (!active) {
		return (
			<div className={styles.Container}>
				<p>Connect a Web3 wallet to see your Staking data</p>
				<ConnectWalletButton>Connect Wallet</ConnectWalletButton>
			</div>
		);
	} else if (!deposits || (deposits && deposits.length)) {
		return (
			<GenericTable
				alignments={[0, 0, 1, 1, 1, 1, 1]}
				data={deposits}
				isLoading={deposits === undefined}
				loadingText={'Loading Deposits'}
				itemKey={'id'}
				headers={TABLE_HEADERS}
				empty={deposits?.length === 0}
				rowComponent={DepositTableRow}
			/>
		);
	}

	return (
		<div className={styles.Container}>
			<p>
				You have not staked in any pools. Get started on the{' '}
				<Link to={'/pools'}>Pools Page</Link>
			</p>
		</div>
	);
};

export default DepositTable;
