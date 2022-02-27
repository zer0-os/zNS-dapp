import styles from './StakeModule.module.scss';

import { TextInput, FutureButton, Spinner, TextButton } from 'components';
import { displayEther } from 'lib/currency';

import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { MaybeUndefined } from 'lib/types';

const cx = classNames.bind(styles);

type StakeModuleProps = {
	amount?: string;
	className?: string;
	balance?: ethers.BigNumber;
	onStake: (amount: string) => void;
	tokenName: string;
	isLoading?: boolean;
	pendingRewards?: ethers.BigNumber;
	unstake?: boolean;
};

const StakeModule = (props: StakeModuleProps) => {
	const {
		amount,
		className,
		balance,
		onStake,
		tokenName,
		isLoading,
		pendingRewards,
		unstake,
	} = props;

	const [amountString, setAmountString] =
		useState<MaybeUndefined<string>>(amount);
	const [amountIsValid, setAmountIsValid] = useState<boolean>(false);

	const onInput = (input: string) => {
		if (input.length === 0) {
			setAmountString(input);
			setAmountIsValid(false);
			return;
		}
		try {
			const amtWei = ethers.BigNumber.from(ethers.utils.parseEther(input));
			// Check amount
			if (input.length && balance) {
				setAmountIsValid(
					amtWei.gt(0) && ethers.BigNumber.from(amtWei).lte(balance),
				);
			} else {
				setAmountIsValid(false);
			}
			setAmountString(input);
		} catch (e) {
			console.error(e);
		}
	};

	const onStakeButton = () => {
		if (amountIsValid && amountString) {
			onStake(amountString);
		}
	};

	const setMaxAmount = () => {
		if (balance) {
			setAmountString(ethers.utils.formatEther(balance).toString());
			setAmountIsValid(true);
		}
	};

	useEffect(() => {
		setAmountString(amount);
	}, [amount]);

	return (
		<div className={cx(styles.Container, className)}>
			<div className={styles.Actions}>
				<div className={styles.Input}>
					<TextInput
						text={amountString}
						numeric
						placeholder="Amount"
						onChange={onInput}
						disabled={isLoading}
						maxLength={24}
					/>
					<TextButton
						className={styles.Max}
						disabled={balance === undefined}
						onClick={setMaxAmount}
					>
						MAX
					</TextButton>
				</div>
				<FutureButton
					loading={isLoading}
					glow={amountIsValid}
					onClick={onStakeButton}
				>
					{unstake ? 'Unstake' : 'Stake'}{' '}
					{amountString && ethers.utils.commify(amountString) + ' ' + tokenName}
				</FutureButton>
			</div>
			<hr />
			<div className={styles.Balances}>
				<div className={cx(styles.Balance, 'flex-split flex-vertical-align')}>
					<span>
						{unstake
							? `Amount Staked in This Deposit (${tokenName})`
							: `Your balance (${tokenName})`}
					</span>
					<div className={styles.Amounts}>
						<b className={styles.Tokens}>
							{balance ? displayEther(balance) + ' ' + tokenName : <Spinner />}
						</b>
					</div>
				</div>
				{pendingRewards && (
					<div className={cx(styles.Balance, 'flex-split flex-vertical-align')}>
						<span>Your Pool Rewards Claimable (WILD)</span>
						<div className={styles.Amounts}>
							<b className={styles.Tokens}>{displayEther(pendingRewards)}</b>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default StakeModule;
