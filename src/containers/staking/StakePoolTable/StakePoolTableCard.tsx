import { Artwork, FutureButton, TextButton } from 'components';
import { toFiat } from 'lib/currency';
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';
import { WrappedStakingPool } from 'lib/providers/staking/StakingProviderTypes';
import styles from './StakePoolTableCard.module.scss';

const StakePoolTableCard = (props: any) => {
	const selectPool = useStakingPoolSelector().selectStakePool;

	const pool = props.data as WrappedStakingPool;
	const apy = pool.metrics.apy;
	const tvl = pool.metrics.tvl.valueOfTokensUSD;

	const onClick = () => {
		selectPool(pool);
	};

	return (
		<div className={styles.Container}>
			<div className={styles.Header}>
				<Artwork
					disableAnimation
					name={pool.content.name}
					image={pool.content.image}
					disableInteraction
					id={pool.content.domain}
					style={{ maxWidth: 200 }}
				/>
			</div>
			<div className={styles.Body}>
				<ul>
					<li>
						<label>APR</label>
						<span>{Number(apy.toFixed(2)).toLocaleString()}%</span>
					</li>
					<li>
						<label>TVL</label>
						<span>{'$' + toFiat(tvl)}</span>
					</li>
				</ul>
			</div>
			<div className={styles.TextButtonContainer}>
				<TextButton onClick={onClick}>Stake</TextButton>
			</div>
		</div>
	);
};

export default StakePoolTableCard;
