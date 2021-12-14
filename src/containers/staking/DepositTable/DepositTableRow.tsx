import { OptionDropdown } from 'components';
import { Artwork } from 'components';
import styles from './DepositTableRow.module.scss';

import { useStaking } from 'lib/providers/staking/StakingProvider';

type Option = {
	name: string;
	callback: () => void;
};

const DepositTableRow = (props: any) => {
	const stake = props.data;

	const { selectDepositById, selectPoolByDomain } = useStaking();

	const OPTIONS: Option[] = [
		{
			name: 'Unstake Deposit',
			callback: () => console.log('unhandled'),
		},
		{
			name: 'Claim Rewards',
			callback: () => console.log('unhandled'),
		},
		{
			name: 'Stake In Pool',
			callback: () => selectPoolByDomain(stake.pool.domain),
		},
	];

	const onDropdownSelect = (selection: string) => {
		const filter = OPTIONS.filter((o: Option) => o.name === selection);
		if (filter.length) {
			filter[0].callback();
		}
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
			<td className={styles.Right}>None (Flexible)</td>
			<td>
				<OptionDropdown
					onSelect={onDropdownSelect}
					options={OPTIONS.map((o: Option) => o.name)}
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

export default DepositTableRow;
