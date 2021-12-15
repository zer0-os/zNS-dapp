import { FutureButton } from 'components';
import { Artwork } from 'components';
import styles from './StakePoolTableRow.module.scss';
import { useHistory } from 'react-router';

import { useStaking } from 'lib/providers/staking/StakingProvider';

const StakePoolTableRow = (props: any) => {
	const { selectPoolByName } = useStaking();
	const { push } = useHistory();

	const pool = props.data;

	const onRowClick = (event: React.MouseEvent<HTMLElement>) => {
		if ((event.target as HTMLElement).className.indexOf('FutureButton') < 0) {
			push(pool.domain);
		}
	};

	const onButtonClick = () => {
		selectPoolByName(pool.name);
	};

	return (
		<tr className={styles.Row} onClick={onRowClick}>
			<td>{props.rowNumber + 1}</td>
			<td>
				<Artwork
					disableAnimation
					name={pool.name}
					image={pool.image}
					disableInteraction
					id={pool.id}
					style={{ maxWidth: 200 }}
				/>
			</td>
			<td className={styles.Right}>-</td>
			<td className={styles.Right}>-</td>
			<td className={styles.Right}>-</td>
			<td className={styles.Right}>-</td>
			<td>
				<FutureButton glow onClick={onButtonClick}>
					Stake
				</FutureButton>
			</td>
		</tr>
	);
};

export default StakePoolTableRow;
