import { FutureButton } from 'components';
import { Artwork } from 'components';
import styles from './StakePoolTableRow.module.scss';

import { useStaking } from 'lib/providers/staking/StakingProvider';

const StakePoolTableRow = (props: any) => {
	const { openStakingModal } = useStaking();

	const pool = props.data;

	const onButtonClick = () => {
		openStakingModal(pool.domain);
	};

	return (
		<tr className={styles.Row}>
			<td>{props.rowNumber + 1}</td>
			<td>
				<Artwork
					domain={pool.domain}
					name={pool.name}
					image={pool.image}
					disableInteraction
					id={pool.id}
					style={{ maxWidth: 200 }}
				/>
			</td>
			<td className={styles.Right}>{pool.apy.toLocaleString()}%</td>
			<td className={styles.Right}>
				{pool.tvl.toLocaleString()} {pool.token}
			</td>
			<td className={styles.Right}>{pool.numStakers.toLocaleString()}</td>
			<td className={styles.Right}>
				{pool.totalRewardsIssued.toLocaleString()}
			</td>
			<td>
				<FutureButton glow onClick={onButtonClick}>
					Stake
				</FutureButton>
			</td>
		</tr>
	);
};

export default StakePoolTableRow;
