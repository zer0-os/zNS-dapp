import { OptionDropdown } from 'components';
import { Artwork } from 'components';
import styles from './DepositTableRow.module.scss';

const StakePoolTableRow = (props: any) => {
	const stake = props.data;

	const onDropdownSelect = (selection: string) => {
		console.log('selection');
	};

	return (
		<tr className={styles.Row}>
			<td>{props.rowNumber + 1}</td>
			<td>
				<Artwork
					disableAnimation
					domain={stake?.pool.domain}
					name={stake?.pool.name}
					image={stake?.pool.image}
					disableInteraction
					id={stake?.pool.id}
					style={{ maxWidth: 200 }}
				/>
			</td>
			<td className={styles.Right}>
				{stake?.dateStaked.toLocaleString().split(',')[0]}
			</td>
			<td className={styles.Right}>
				{stake?.stakeAmount.toLocaleString()} {stake?.pool.token}
			</td>
			<td className={styles.Right}>365 Days</td>
			<td>
				<OptionDropdown
					onSelect={onDropdownSelect}
					options={['Unstake Deposit', 'Claim Rewards', 'Stake In Pool']}
					disableSelection
					drawerStyle={{ width: 222 }}
				>
					<button className={styles.Dots} onClick={() => {}}>
						<div></div>
						<div></div>
						<div></div>
					</button>
				</OptionDropdown>
			</td>
		</tr>
	);
};

export default StakePoolTableRow;
