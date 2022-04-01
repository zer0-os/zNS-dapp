import { FutureButton } from 'components';
import { Artwork } from 'components';
import styles from './StakePoolTableRow.module.scss';

import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';
import { WrappedStakingPool } from 'lib/providers/staking/StakingProviderTypes';
import { toFiat } from 'lib/currency';

const StakePoolTableRow = (props: any) => {
	const selectPool = useStakingPoolSelector().selectStakePool;

	const pool = props.data as WrappedStakingPool;
	const apy = pool.metrics.apy;
	const tvl = pool.metrics.tvl.valueOfTokensUSD;

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
