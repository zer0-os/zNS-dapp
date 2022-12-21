import { useRef } from 'react';

import { displayEther } from 'lib/currency';
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';
import { WrappedDeposit } from './DepositTable';
import {
	compareTimestamp,
	getDateFromTimestamp,
	getTimestampLabel,
} from './DepositTable.helpers';

import { Artwork, OptionDropdown } from 'components';

import styles from './DepositTableRow.module.scss';

type Option = {
	name: string;
	callback: () => void;
};

const DepositTableRow = (props: any) => {
	const deposit = props.data as WrappedDeposit;

	const buttonRef = useRef<HTMLButtonElement>(null);

	const stake = useStakingPoolSelector().selectStakePool;
	const claim = useStakingPoolSelector().claim;
	const unstake = useStakingPoolSelector().unstake;

	const OPTIONS: Option[] = [
		{
			name: 'Claim Pool Rewards',
			callback: () => claim(deposit.pool),
		},
		{
			name: 'Stake In Pool',
			callback: () => stake(deposit.pool),
		},
	];

	if (compareTimestamp(deposit.lockedUntil, new Date())) {
		OPTIONS.unshift({
			name: 'Unstake Deposit',
			callback: () => unstake(deposit),
		});
	}

	const onDropdownSelect = ({ title }: { title: string }) => {
		const filter = OPTIONS.filter((o: Option) => o.name === title);
		if (filter.length) {
			filter[0].callback();
		}
	};

	const handleRowClick = () => {
		buttonRef.current?.click();
	};

	if (!deposit) {
		return <></>;
	}

	return (
		<tr className={styles.Row} onClick={handleRowClick}>
			<td>{props.rowNumber + 1}</td>
			<td>
				<Artwork
					disableAnimation
					name={deposit.pool.content.name}
					image={deposit.pool.content.image}
					disableInteraction
					id={deposit.pool.content.domain}
					style={{ maxWidth: 200 }}
				/>
			</td>
			<td className={styles.Right}>
				{deposit.lockedFrom.gt('0')
					? getDateFromTimestamp(deposit.lockedFrom)
							.toLocaleString()
							.split(',')[0]
					: '-'}
			</td>
			<td className={styles.Right}>
				{displayEther(deposit.tokenAmount)} {deposit?.pool.content.tokenTicker}
			</td>
			<td className={styles.Right}>
				{getTimestampLabel(deposit?.lockedUntil)}
			</td>
			<td>
				<OptionDropdown
					onSelect={onDropdownSelect}
					options={OPTIONS.map((o: Option) => ({ title: o.name }))}
					disableSelection
					drawerStyle={{
						width: 222,
						transform: 'translateX(calc(-100% + 8px))',
					}}
				>
					<div className={styles.ButtonContainer}>
						<button ref={buttonRef} className={styles.Dots} onClick={() => {}}>
							<div></div>
							<div></div>
							<div></div>
						</button>
					</div>
				</OptionDropdown>
			</td>
		</tr>
	);
};

export default DepositTableRow;
