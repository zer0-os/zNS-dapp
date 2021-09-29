import { FormEvent, useState } from 'react';

import { FutureButton, TextInput } from 'components';

import styles from './SelectAmount.module.css';

import { EthPerWheel } from '../../helpers';

type SelectAmountProps = {
	balanceEth: number;
	error?: string;
	maxPurchasesPerUser?: number;
	numberPurchasedByUser?: number;
	onBack: () => void;
	onContinue: (numWheels: number) => void;
	remainingWheels: number;
};

const SelectAmount = (props: SelectAmountProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const maxPerUser = 2;
	const max =
		props.remainingWheels < maxPerUser ? props.remainingWheels : maxPerUser;
	// If the user sees this page, they can afford at least 1 wheel, so we only
	// need to check if the user can afford 2
	const maxUserCanAfford = Math.floor(props.balanceEth / EthPerWheel);
	const maxUserCanBuy = Math.min(maxUserCanAfford, max);
	const min = 1;
	const [amount, setAmount] = useState<string | undefined>();

	// Input errors
	const [inputError, setInputError] = useState<string | undefined>();

	// We should never hit this, but just in case
	// there are no wheels remaining
	// or the user has 0 eth but somehow snuck through
	if (props.remainingWheels <= 0 || props.balanceEth < EthPerWheel) {
		props.onBack();
	}

	///////////////
	// Functions //
	///////////////

	const onInputChange = (amount: string) => {
		setAmount(amount);
	};

	const formSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isAmountValid()) {
			props.onContinue(Number(amount));
		} else {
			if (isNaN(Number(amount))) {
				return;
			}
			const numWheels = Number(amount);
			if (numWheels <= 0 || numWheels > maxPerUser) {
				setInputError(`Please enter a number between 1 & ${maxPerUser}`);
			} else if (numWheels * EthPerWheel > props.balanceEth) {
				setInputError(`You do not have enough ETH to mint ${numWheels} Wheels`);
			}
		}
	};

	const isAmountValid = () => {
		return (
			amount !== undefined &&
			amount.length > 0 &&
			!isNaN(Number(amount)) &&
			Number(amount) * EthPerWheel <= props.balanceEth &&
			Number(amount) % 1 === 0 &&
			Number(amount) >= min &&
			Number(amount) <= max
		);
	};

	////////////
	// Render //
	////////////

	return (
		<section>
			<form onSubmit={formSubmit}>
				<p>
					How many Wheels would you like to Mint? Each user can mint a maximum
					of <b>2 Wheels</b>. For each Wheel you mint, you must pay{' '}
					<b>{EthPerWheel} ETH</b>. However many you choose, they will be minted
					in one transaction, saving on GAS fees. Your current balance is{' '}
					<b>{props.balanceEth} ETH</b>.
				</p>
				<TextInput
					onChange={onInputChange}
					placeholder={`Number of Wheels (Maximum of 2)`}
					numeric
					text={amount}
				/>
				{props.error !== undefined && (
					<span className={styles.Error}>{props.error}</span>
				)}
				{inputError !== undefined && (
					<span className={styles.Error}>{inputError}</span>
				)}
				<FutureButton glow className={styles.Button} onClick={() => {}}>
					Continue
				</FutureButton>
			</form>
		</section>
	);
};

export default SelectAmount;
