import { OptionDropdown } from 'components';
import { Artwork } from 'components';
import styles from './DepositTableRow.module.scss';

import { useStaking, DepositView } from 'lib/providers/staking/StakingProvider';
import { ethers } from 'ethers';

type Option = {
	name: string;
	callback: () => void;
};

const DepositTableRow = (props: any) => {
	const deposit = props.data as DepositView;

	const { selectPoolByName, selectDeposit } = useStaking();

	const OPTIONS: Option[] = [
		{
			name: 'Unstake Deposit',
			callback: () => console.log('unhandled'),
		},
		{
			name: 'Claim Rewards',
			callback: () => selectDeposit(deposit.depositId, deposit.pool.name),
		},
		{
			name: 'Stake In Pool',
			callback: () => selectPoolByName(deposit.pool.name),
		},
	];

	const onDropdownSelect = (selection: string) => {
		const filter = OPTIONS.filter((o: Option) => o.name === selection);
		if (filter.length) {
			filter[0].callback();
		}
	};

	const timestampLabel = (timestamp: ethers.BigNumber) => {
		// Only have flexible locking for now
		return 'No Lock (Flexible)';
	};

	const dateFromTimestamp = (timestamp: ethers.BigNumber) => {
		return new Date(timestamp.toNumber() * 1000);
	};

	if (!deposit) {
		return <></>;
	}

	return (
		<tr className={styles.Row}>
			<td>{props.rowNumber + 1}</td>
			<td>
				<Artwork
					disableAnimation
					name={deposit.pool.name}
					image={deposit.pool.image}
					disableInteraction
					id={deposit.pool.id}
					style={{ maxWidth: 200 }}
				/>
			</td>
			<td className={styles.Right}>
				{deposit.lockedFrom.gt('0')
					? dateFromTimestamp(deposit.lockedFrom).toLocaleString().split(',')[0]
					: '-'}
			</td>
			<td className={styles.Right}>
				{deposit.tokenAmount.toString()} {deposit?.pool.tokenTicker}
			</td>
			<td className={styles.Right}>{timestampLabel(deposit?.lockedUntil)}</td>
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
