import { FutureButton } from 'components';
import { Artwork } from 'components';
import styles from './StakePoolTableRow.module.scss';
import { useHistory } from 'react-router';

import { useStaking } from 'lib/providers/staking/StakingProvider';

const StakePoolTableRow = (props: any) => {
	const { selectPoolByDomain } = useStaking();
	const { push } = useHistory();

	const pool = props.data;

	const onRowClick = (event: React.MouseEvent<HTMLElement>) => {
		if ((event.target as HTMLElement).className.indexOf('FutureButton') < 0) {
			push('pools/' + pool.domain);
		}
	};

	const onButtonClick = () => {
		selectPoolByDomain(pool.domain);
	};

	return (
		<tr className={styles.Row} onClick={onRowClick}>
			<td>{props.rowNumber + 1}</td>
			<td>
				<Artwork
					disableAnimation
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
