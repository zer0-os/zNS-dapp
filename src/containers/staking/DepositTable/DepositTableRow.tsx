import { FutureButton } from 'components';
import { Artwork } from 'components';
import styles from './DepositTableRow.module.scss';

const StakePoolTableRow = (props: any) => {
	const stake = props.data;

	return (
		<tr>
			<td>{props.rowNumber + 1}</td>
			<td>
				<Artwork
					domain={stake.domain}
					name={stake.name}
					image={stake.image}
					disableInteraction
					id={stake.id}
					style={{ maxWidth: 200 }}
				/>
			</td>
			<td className={styles.Right}>
				{stake.dateStaked.toLocaleString().split(',')[0]}
			</td>
			<td className={styles.Right}>
				{stake.stakeAmount.toLocaleString()} {stake.token}
			</td>
			<td className={styles.Right}>{stake.stakeRewards.toLocaleString()}</td>
			<td className={styles.Right}>
				{stake.stakeRewardsVested.toLocaleString()}
			</td>
			<td>
				<FutureButton style={{ width: 113 }} glow onClick={() => {}}>
					Unstake
				</FutureButton>
			</td>
			<td>
				<FutureButton
					style={{ width: 92 }}
					glow={stake.stakeRewardsVested > 0}
					onClick={() => {}}
				>
					Claim
				</FutureButton>
			</td>
		</tr>
	);
};

export default StakePoolTableRow;
