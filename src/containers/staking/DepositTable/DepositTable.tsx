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
import DepositProvider from './DepositTableProvider';
import { useStakingUserData } from 'lib/providers/staking/StakingUserDataProvider';

type DepositTableProps = {};

export interface WrappedDeposit extends zfi.Deposit {
	pool: WrappedStakingPool;
}

const DepositTable = (props: DepositTableProps) => {
	const { deposits } = useStakingUserData();

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
			<DepositProvider>
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
			</DepositProvider>
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

const WrappedDepositTable = (props: DepositTableProps) => {
	return (
		<DepositProvider>
			<DepositTable {...props} />
		</DepositProvider>
	);
};

export default React.memo(WrappedDepositTable);
