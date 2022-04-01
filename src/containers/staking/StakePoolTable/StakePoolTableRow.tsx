/**
 * This component represents a single row rendered by StakePoolTable
 */
import { useState } from 'react';

// Hook imports
import { useWeb3React } from '@web3-react/core';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';

// Library imports
import { WrappedStakingPool } from 'lib/providers/staking/StakingProviderTypes';
import { displayEther, toFiat } from 'lib/currency';
import { ethers } from 'ethers';

import { Artwork, FutureButton, Spinner } from 'components';

// Local imports
import { MESSAGE } from './StakePoolTable.constants';
import styles from './StakePoolTableRow.module.scss';

export const TEST_ID = {
	CONTAINER: 'stake-pool-table-container',
	SPINNER: 'stake-pool-row-spinner',
};

const StakePoolTableRow = (props: any) => {
	const selectPool = useStakingPoolSelector().selectStakePool;
	const { account } = useWeb3React();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [totalStake, setTotalStake] = useState<ethers.BigNumber | undefined>();
	const pool = props.data as WrappedStakingPool;
	const apy = pool.metrics.apy;
	const tvl = pool.metrics.tvl.valueOfTokensUSD;

	/**
	 * Gets user's stake and assigns it to state variables
	 * @returns void
	 */
	const getStake = () => {
		if (!account) {
			setTotalStake(ethers.BigNumber.from(0));
			return;
		}
		setTotalStake(undefined);
		setIsLoading(true);
		pool.instance
			.userValueStaked(account)
			.then((value) => {
				const { userValueLocked, userValueUnlocked } = value;
				setTotalStake(userValueUnlocked.add(userValueLocked));
				setIsLoading(false);
			})
			.catch((e: any) => {
				setIsLoading(false);
				console.error(e);
			});
	};

	useUpdateEffect(getStake, [pool, account]);

	useDidMount(getStake);

	const onClick = () => {
		selectPool(pool);
	};

	return (
		<tr
			className={styles.Row}
			onClick={onClick}
			data-testid={TEST_ID.CONTAINER}
		>
			<td>{props.rowNumber + 1}</td>
			<td>
				<Artwork
					disableAnimation
					name={pool.content.name}
					image={pool.content.image}
					disableInteraction
					id={pool.content.domain}
					style={{ maxWidth: 200 }}
				/>
			</td>
			<td className={styles.Right}>
				{Number(apy.toFixed(2)).toLocaleString() + '%'}
			</td>
			{account ? (
				<td className={styles.Right}>
					{isLoading ? (
						<Spinner data-testid={TEST_ID.SPINNER} />
					) : totalStake ? (
						`${displayEther(totalStake)} ${pool.content.tokenTicker}`
					) : (
						MESSAGE.FAILED_TO_LOAD
					)}
				</td>
			) : (
				<></>
			)}
			<td className={styles.Right}>{'$' + toFiat(tvl)}</td>
			<td>
				<FutureButton glow onClick={onClick}>
					Stake
				</FutureButton>
			</td>
		</tr>
	);
};

export default StakePoolTableRow;
