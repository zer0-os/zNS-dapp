import { useState } from 'react';
import { FutureButton, Spinner } from 'components';
import { Artwork } from 'components';
import styles from './StakePoolTableRow.module.scss';

import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';
import { WrappedStakingPool } from 'lib/providers/staking/StakingProviderTypes';
import { displayEther, toFiat } from 'lib/currency';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useDidMount } from 'lib/hooks/useDidMount';

const StakePoolTableRow = (props: any) => {
	const selectPool = useStakingPoolSelector().selectStakePool;
	const { account } = useWeb3React();

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
		pool.instance
			.userValueStaked(account)
			.then((value) => {
				const { userValueLocked, userValueUnlocked } = value;
				setTotalStake(userValueUnlocked.add(userValueLocked));
			})
			.catch((e: any) => {
				setTotalStake(ethers.BigNumber.from(0));
				console.error(e);
			});
	};

	useUpdateEffect(getStake, [pool, account]);

	useDidMount(getStake);

	const onClick = () => {
		selectPool(pool);
	};

	return (
		<tr className={styles.Row} onClick={onClick}>
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
					{totalStake === undefined ? (
						<Spinner />
					) : (
						<>
							{displayEther(totalStake)} {pool.content.tokenTicker}
						</>
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
