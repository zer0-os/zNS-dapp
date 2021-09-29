import { FormEvent, useState } from 'react';

import { FutureButton, TextInput } from 'components';

import styles from './SelectAmount.module.css';

import { EthPerWheel } from '../../helpers';

type SelectAmountProps = {
	balanceEth: number;
	error?: string;
	maxPurchasesPerUser: number;
	numberPurchasedByUser: number;
	onBack: () => void;
	onContinue: (numWheels: number) => void;
	remainingWheels: number;
};

const SelectAmount = (props: SelectAmountProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const maxPerUser = 2;
	const remainingUserWheels =
		props.maxPurchasesPerUser - props.numberPurchasedByUser;
	const maxUserCanAfford = Math.floor(props.balanceEth / EthPerWheel);

	const maxWheelsRemaining = Math.min(
		remainingUserWheels,
		props.remainingWheels,
	);
	const maxUserCanBuy = Math.min(maxUserCanAfford, maxWheelsRemaining);
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
			} else if (numWheels > remainingUserWheels) {
				setInputError(
					`You have already minted ${props.numberPurchasedByUser}/${props.maxPurchasesPerUser} of the maximum allowed Wheels. Please choose a lower number`,
				);
			}
		}
	};

	const isAmountValid = () => {
		return (
			amount !== undefined &&
			amount.length > 0 &&
			!isNaN(Number(amount)) &&
			Number(amount) % 1 === 0 &&
			Number(amount) <= maxUserCanBuy
		);
	};

	////////////
	// Render //
	////////////

	return (
		<section>
			{props.numberPurchasedByUser < props.maxPurchasesPerUser && (
				<form onSubmit={formSubmit}>
					<p>
						How many Wheels would you like to Mint? Each user can mint a maximum
						of <b>2 Wheels</b>. For each Wheel you mint, you must pay{' '}
						<b>{EthPerWheel} ETH</b>. However many you choose, they will be
						minted in one transaction, saving on GAS fees. Your current balance
						is <b>{props.balanceEth} ETH</b>.
					</p>
					<TextInput
						onChange={onInputChange}
						placeholder={`Number of Wheels (Maximum of 2)`}
						numeric
						text={amount}
					/>
					{props.error !== undefined && inputError === undefined && (
						<span className={styles.Error}>{props.error}</span>
					)}
					{inputError !== undefined && (
						<span className={styles.Error}>{inputError}</span>
					)}
					<FutureButton glow className={styles.Button} onClick={() => {}}>
						Continue
					</FutureButton>
				</form>
			)}
			{props.numberPurchasedByUser >= props.maxPurchasesPerUser && (
				<p className={styles.Green} style={{ textAlign: 'center' }}>
					You have already minted {props.numberPurchasedByUser}/
					{props.maxPurchasesPerUser} Wheels
				</p>
			)}
		</section>
	);
};

export default SelectAmount;
