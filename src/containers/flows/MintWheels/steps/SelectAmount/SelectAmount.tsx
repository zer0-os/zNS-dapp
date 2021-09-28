import { FormEvent, useState } from 'react';

import { FutureButton, TextInput } from 'components';

import styles from './SelectAmount.module.css';

import { EthPerWheel } from '../../helpers';

type SelectAmountProps = {
	onBack: () => void;
	onContinue: (numWheels: number) => void;
	remainingWheels: number;
	balanceEth: number;
	error?: string;
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
	const [amount, setAmount] = useState<string | undefined>(
		maxUserCanBuy.toString(),
	);

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
					How many wheels would you like to Mint? Each user can mint a maximum
					of <b>2 wheels</b>. For each Wheel you mint, you must pay{' '}
					<b>{EthPerWheel} ETH</b>. However many you choose, they will be minted
					in one transaction, saving on GAS fees.
				</p>
				<p className={styles.Green}>
					Your balance is <b>{props.balanceEth} ETH</b>, which means you can
					mint{' '}
					<b>
						{maxUserCanBuy} wheel
						{maxUserCanBuy > 1 || (maxUserCanBuy === 0 && 's')}
					</b>{' '}
					not including GAS fees.
				</p>
				<TextInput
					onChange={onInputChange}
					placeholder={`Number of Wheels (Maximum of ${maxUserCanBuy})`}
					numeric
					text={amount}
				/>
				{props.error !== undefined && (
					<span className={styles.Error}>{props.error}</span>
				)}
				<FutureButton
					className={styles.Button}
					glow={isAmountValid()}
					onClick={() => {}}
				>
					Continue
				</FutureButton>
			</form>
		</section>
	);
};

export default SelectAmount;
