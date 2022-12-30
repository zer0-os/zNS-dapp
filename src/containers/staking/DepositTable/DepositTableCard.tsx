import { useRef } from 'react';

import { displayEther, toFiat } from 'lib/currency';
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';
import { WrappedDeposit } from './DepositTable';
import { compareTimestamp, getTimestampLabel } from './DepositTable.helpers';

import { Artwork, OptionDropdown } from 'components';

import styles from './DepositTableCard.module.scss';

type Option = {
	name: string;
	callback: () => void;
};

const DepositTableCard = (props: any) => {
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

	return (
		<div className={styles.Container}>
			<div className={styles.Header}>
				<Artwork
					disableAnimation
					name={deposit.pool.content.name}
					image={deposit.pool.content.image}
					disableInteraction
					id={deposit.pool.content.domain}
					style={{ maxWidth: 200 }}
				/>
				<OptionDropdown
					onSelect={onDropdownSelect}
					options={OPTIONS.map((o: Option) => ({ title: o.name }))}
					disableSelection
					drawerStyle={{
						width: 222,
						transform: 'translateX(calc(-100% + 34px))',
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
			</div>
			<div className={styles.Body}>
				<ul>
					<li>
						<label>Amount</label>
						<span>{displayEther(deposit.tokenAmount)}</span>
					</li>
					<li>
						<label>APR</label>
						<span>{toFiat(deposit.pool.metrics.apy)}%</span>
					</li>
					<li>
						<label>Unlock Date</label>
						<span>{getTimestampLabel(deposit?.lockedUntil)}</span>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default DepositTableCard;
