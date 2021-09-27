import { FormEvent, useState } from 'react';

import { FutureButton, TextInput } from 'components';

import styles from './SelectAmount.module.css';

type SelectAmountProps = {
	onBack: () => void;
	onContinue: () => void;
	remainingWheels: number;
};

const SelectAmount = (props: SelectAmountProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const max = props.remainingWheels < 2 ? props.remainingWheels : 2;
	const min = 1;
	const [amount, setAmount] = useState<string | undefined>();

	// We should never hit this, but just in case
	// there are no wheels remaining
	if (props.remainingWheels <= 0) {
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
			props.onContinue();
		}
	};

	const isAmountValid = () => {
		return (
			amount !== undefined &&
			amount.length > 0 &&
			!isNaN(Number(amount)) &&
			Number(amount) % 1 === 0 &&
			Number(amount) >= min &&
			Number(amount) <= max
		);
	};

	////////////
	// Render //
	////////////

	return (
		<section className={styles.Container}>
			<form onSubmit={formSubmit}>
				<p>
					You may mint up to 2 wheels. For each Wheel you mint, you must pay
					100WILD. They will be minted in one transaction incurring a GAS fee.
				</p>
				<TextInput
					onChange={onInputChange}
					placeholder="Number of Wheels (2 max)"
					numeric
					text={amount}
				/>
				<FutureButton glow={isAmountValid()} onClick={() => {}}>
					Continue
				</FutureButton>
			</form>
		</section>
	);
};

export default SelectAmount;
