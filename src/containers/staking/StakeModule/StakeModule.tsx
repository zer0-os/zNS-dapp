import styles from './StakeModule.module.scss';

import { TextInput, FutureButton } from 'components';

import classNames from 'classnames/bind';
import { useState } from 'react';

const cx = classNames.bind(styles);

type StakeModuleProps = {
	className?: string;
	balance: number;
	onStake: (amount: number) => void;
	tokenName: string;
};

const StakeModule = (props: StakeModuleProps) => {
	const { className, balance, onStake, tokenName } = props;

	const [amountString, setAmountString] = useState<string | undefined>();

	const canStakeSpecifiedAmount =
		Number(amountString) > 0 && Number(amountString) <= balance;

	const onInput = (input: string) => {
		setAmountString(input);
	};

	const onStakeButton = () => {
		if (canStakeSpecifiedAmount) {
			onStake(Number(amountString));
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
				/>
				<FutureButton glow={canStakeSpecifiedAmount} onClick={onStakeButton}>
					Stake
				</FutureButton>
			</div>
			<hr />
			<div className={styles.Balances}>
				<div className={cx(styles.Balance, 'flex-split flex-vertical-align')}>
					<span>Your balance ({tokenName})</span>
					<div className={styles.Amounts}>
						<b className={styles.Tokens}>{balance.toLocaleString()}</b>
						<span className={styles.Fiat}>$456.00</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StakeModule;
