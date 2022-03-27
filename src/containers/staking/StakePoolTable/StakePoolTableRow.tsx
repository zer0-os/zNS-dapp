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

const StakePoolTableRow = (props: any) => {
	const selectPool = useStakingPoolSelector().selectStakePool;
	const { account } = useWeb3React();

	const [totalStake, setTotalStake] = useState<ethers.BigNumber | undefined>();
	const pool = props.data as WrappedStakingPool;
	const apy = pool.metrics.apy;
	const tvl = pool.metrics.tvl.valueOfTokensUSD;

	const getStake = async (id: string) => {
		try {
			const { userValueLocked, userValueUnlocked } =
				await pool.instance.userValueStaked(id);
			setTotalStake(userValueUnlocked.add(userValueLocked));
		} catch (e: any) {
			setTotalStake(ethers.BigNumber.from(0));
			console.error(e);
		}
	};

	useUpdateEffect(() => {
		if (account) {
			getStake(account);
		}
	}, [pool]);

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
