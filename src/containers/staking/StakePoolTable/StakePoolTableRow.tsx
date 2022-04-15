/**
 * This component represents a single row rendered by StakePoolTable
 */

import styles from './StakePoolTableRow.module.scss';
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';

// Library imports
import { WrappedStakingPool } from 'lib/providers/staking/StakingProviderTypes';
import { toFiat } from 'lib/currency';

import { FutureButton, Artwork } from 'components';

export const TEST_ID = {
	CONTAINER: 'stake-pool-table-container',
};

const StakePoolTableRow = (props: any) => {
	const selectPool = useStakingPoolSelector().selectStakePool;

	const pool = props.data as WrappedStakingPool;
	const apy = pool.metrics.apy;
	const tvl = pool.metrics.tvl.valueOfTokensUSD;

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
