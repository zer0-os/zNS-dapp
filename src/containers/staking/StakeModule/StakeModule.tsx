import styles from './StakeModule.module.scss';

import { TextInput, FutureButton, Spinner } from 'components';
import { displayEther, toFiat } from 'lib/currency';

import classNames from 'classnames/bind';
import { useState } from 'react';
import { ethers } from 'ethers';
import { MaybeUndefined } from 'lib/types';

const cx = classNames.bind(styles);

type StakeModuleProps = {
	amount?: ethers.BigNumber;
	className?: string;
	balance?: ethers.BigNumber;
	onStake: (amount: string) => void;
	tokenName: string;
	isLoading?: boolean;
};

const StakeModule = (props: StakeModuleProps) => {
	const { amount, className, balance, onStake, tokenName, isLoading } = props;

	const [amountString, setAmountString] = useState<MaybeUndefined<string>>(
		!amount ? undefined : ethers.utils.formatEther(amount),
	);

	const canStakeSpecifiedAmount =
		balance && Number(amountString) > 0 && balance.gt(amountString || 0);

	const onInput = (input: string) => {
		setAmountString(input);
	};

	const onStakeButton = () => {
		if (canStakeSpecifiedAmount && amountString) {
			onStake(amountString);
		}
	};

	return (
		<div className={cx(styles.Container, className)}>
			<div className={styles.Actions}>
				<TextInput
					text={amountString}
					numeric
					placeholder="Amount"
					onChange={onInput}
					disabled={isLoading}
				/>
				<FutureButton
					loading={isLoading}
					glow={canStakeSpecifiedAmount}
					onClick={onStakeButton}
				>
					Stake{' '}
					{amountString &&
						Number(amountString).toLocaleString() + ' ' + tokenName}
				</FutureButton>
			</div>
			<hr />
			<div className={styles.Balances}>
				<div className={cx(styles.Balance, 'flex-split flex-vertical-align')}>
					<span>Your balance</span>
					<div className={styles.Amounts}>
						<b className={styles.Tokens}>
							{balance ? displayEther(balance) + ' ' + tokenName : <Spinner />}
						</b>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StakeModule;
