// React Imports
import { FormEvent, useState } from 'react';

// Component Imports
import { FutureButton, TextInput } from 'components';

// Style Imports
import styles from './SelectAmount.module.scss';

// Library Imports
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

	const remainingUserWheels =
		props.maxPurchasesPerUser - props.numberPurchasedByUser;
	const maxUserCanAfford = Math.floor(props.balanceEth / EthPerWheel);

	const maxWheelsRemaining = Math.min(
		remainingUserWheels,
		props.remainingWheels,
	);
	const maxUserCanBuy = Math.min(maxUserCanAfford, maxWheelsRemaining);
	const [amount, setAmount] = useState<string | undefined>();

	const [hasUserAcceptedTerms, setHasUserAcceptedTerms] =
		useState<boolean>(false);

	// Input errors
	const [inputError, setInputError] = useState<string | undefined>();
	const [showTermsError, setShowTermsError] = useState<boolean>(false);

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
			if (!hasUserAcceptedTerms) {
				setShowTermsError(true);
				setInputError(undefined);
			} else {
				props.onContinue(Number(amount));
			}
		} else {
			if (isNaN(Number(amount))) {
				setInputError('Please enter a valid number');
				return;
			}
			const numWheels = Number(amount);
			if (numWheels <= 0 || numWheels > props.maxPurchasesPerUser) {
				setInputError(
					`Please enter a number between 1 & ${props.maxPurchasesPerUser}`,
				);
			} else if (numWheels * EthPerWheel > props.balanceEth) {
				setInputError(`You do not have enough WILD to mint ${numWheels} Cribs`);
			} else if (numWheels > remainingUserWheels) {
				setInputError(
					`You have already minted ${props.numberPurchasedByUser}/${props.maxPurchasesPerUser} of the maximum allowed Cribs. Please choose a lower number`,
				);
			} else if (numWheels > props.remainingWheels) {
				if (props.remainingWheels === 1) {
					setInputError(`There is only 1 Crib left in this drop`);
				} else {
					setInputError(
						`There are only ${props.remainingWheels} Cribs left in this drop`,
					);
				}
			}
		}
	};

	const toggleAcceptTerms = (event: any) => {
		setHasUserAcceptedTerms(!hasUserAcceptedTerms);
	};

	const openTerms = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		event.preventDefault();
		window
			.open('https://zine.wilderworld.com/terms-and-conditions/', '_blank')
			?.focus();
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
						How many Cribs would you like to Mint? The number of Cribs you enter
						will be minted in one transaction, saving on GAS fees. Each Crib
						costs <b>{EthPerWheel} WILD</b>.
					</p>
					<TextInput
						onChange={onInputChange}
						placeholder={`Number of Cribs (Maximum of ${props.maxPurchasesPerUser})`}
						numeric
						text={amount}
					/>

					<div className={styles.Terms}>
						<div
							onClick={toggleAcceptTerms}
							className={hasUserAcceptedTerms ? styles.Selected : ''}
						></div>
						<input
							type="radio"
							id="termsAndConditions"
							name="terms"
							value="terms"
							checked={hasUserAcceptedTerms}
							onClick={toggleAcceptTerms}
							readOnly
						/>
						<label className="no-select" htmlFor="termsAndConditions">
							I agree to the auction{' '}
							<button className="text-button" onClick={openTerms}>
								terms and conditions
							</button>
						</label>
					</div>

					{props.error !== undefined &&
						inputError === undefined &&
						!showTermsError && (
							<span className={styles.Error}>{props.error}</span>
						)}
					{inputError !== undefined && (
						<span className={styles.Error}>{inputError}</span>
					)}
					{showTermsError && !inputError && (
						<span className={styles.Error}>
							Please accept the terms and conditions to continue
						</span>
					)}
					<FutureButton glow className={styles.Button} onClick={() => {}}>
						Continue
					</FutureButton>
				</form>
			)}
			{props.numberPurchasedByUser >= props.maxPurchasesPerUser && (
				<p className={styles.Green} style={{ textAlign: 'center' }}>
					You have already minted {props.numberPurchasedByUser}/
					{props.maxPurchasesPerUser} Cribs
				</p>
			)}
		</section>
	);
};

export default SelectAmount;
