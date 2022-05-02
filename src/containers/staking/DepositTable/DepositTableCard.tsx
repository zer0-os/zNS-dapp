import { Artwork, OptionDropdown } from 'components';
import { ethers } from 'ethers';
import { displayEther, toFiat } from 'lib/currency';
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';
import { useRef } from 'react';
import { WrappedDeposit } from './DepositTable';
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

	if (!deposit.isYield) {
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

	const timestampLabel = (timestamp: ethers.BigNumber) => {
		if (timestamp.gt(0)) {
			return new Date(timestamp.toNumber() * 1000)
				.toLocaleString()
				.split(',')[0];
		}
		return '-';
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
					<button ref={buttonRef} className={styles.Dots} onClick={() => {}}>
						<div></div>
						<div></div>
						<div></div>
					</button>
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
						<span>{timestampLabel(deposit?.lockedUntil)}</span>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default DepositTableCard;
