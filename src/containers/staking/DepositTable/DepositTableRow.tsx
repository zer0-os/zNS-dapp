import { OptionDropdown } from 'components';
import { Artwork } from 'components';
import styles from './DepositTableRow.module.scss';

const StakePoolTableRow = (props: any) => {
	const stake = props.data;

	const onDropdownSelect = (selection: string) => {
		console.log('selection');
	};

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
			<td className={styles.Right}>@todo</td>
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
