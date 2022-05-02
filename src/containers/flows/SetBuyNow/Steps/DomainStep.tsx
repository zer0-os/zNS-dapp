/*
 * This component represents the "Set buy now price" step
 * of the Set Buy Now flow.
 */

// React Imports
import { useEffect, useState } from 'react';

// Library Imports
import { toFiat } from 'lib/currency';

// Component Imports
import { FutureButton, TextInput, ToggleButton, Wizard } from 'components';
import { DomainData } from '../SetBuyNow';

// Style Imports
import styles from './DomainStep.module.scss';
import { ethers } from 'ethers';

type DomainStepProps = {
	domainData: DomainData;
	error?: string;
	onCancel: () => void;
	onNext: (buyNowPrice?: number) => void;
	wildPriceUsd: number;
	isWaitingForWalletConfirmation?: boolean;
	didSucceed?: boolean;
};

const DomainStep = ({
	domainData: domain,
	error: externalError,
	onCancel: onCancelParent,
	onNext: onNextParent,
	wildPriceUsd,
	isWaitingForWalletConfirmation,
	didSucceed,
}: DomainStepProps) => {
	// Check existing buy now
	let currentBuyNow: number | undefined, details;
	if (domain.currentBuyNowPrice?.gt(0)) {
		currentBuyNow = Number(ethers.utils.formatEther(domain.currentBuyNowPrice));
		details = [
			{
				name: 'Buy Now Price',
				value: currentBuyNow.toLocaleString() + ' WILD',
			},
		];
	}
	const hasValidBuyNow = (currentBuyNow ?? 0) > 0;

	///////////////////////
	// State & Variables //
	///////////////////////

	// Some internal state for keeping variables and passing back up to container
	const [amount, setAmount] = useState<string | undefined>();
	const [toggledValue, setToggledValue] = useState<boolean>(hasValidBuyNow);
	const [isConfirming, setIsConfirming] = useState<boolean>(false);
	const [internalError, setInternalError] = useState<string | undefined>();

	const isRemovingBuyNow = hasValidBuyNow && toggledValue === false;

	///////////////
	// Functions //
	///////////////

	// Navigates back (internally) from the confirmation step
	const onCancel = () => {
		setIsConfirming(false);
	};

	// Triggers the onNext parent function
	const onConfirm = () => {
		onNextParent(!isRemovingBuyNow ? Number(amount) : undefined);
	};

	// Navigates forward from the "set buy now price" step to the confirmation step
	const onNext = () => {
		// If amount is invalid
		if (
			!isRemovingBuyNow &&
			(amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0)
		) {
			return setInternalError('Please provide a valid buy now price');
		}

		// If proposed by now price is same as current
		if (currentBuyNow && Number(amount) === currentBuyNow) {
			return setInternalError(
				'Buy now price is already ' + currentBuyNow.toLocaleString() + ' WILD',
			);
		}

		// Move on to confirmation
		setIsConfirming(true);
		setInternalError(undefined);
	};

	useEffect(() => {
		setInternalError(undefined);
	}, [toggledValue]);

	///////////////
	// Fragments //
	///////////////

	// Confirmation step
	const Confirming = () => (
		<p className={styles.Confirmation}>
			{!isRemovingBuyNow ? (
				<>
					Are you sure you want to set a buy now price of{' '}
					<b>{Number(amount).toLocaleString()} WILD</b> for{' '}
					<b>{domain.title}</b>?
				</>
			) : (
				<>
					Are you sure you want to remove the buy now price of{' '}
					<b>{currentBuyNow} WILD</b> for <b>{domain.title}</b>?
				</>
			)}
		</p>
	);

	// Inputs to capture proposed buy now price
	const Inputs = () => (
		<>
			{(domain.currentBuyNowPrice ?? 0) > 0 && (
				<div>
					<p>
						This NFT has an existing buy now price of{' '}
						<b>{currentBuyNow!.toLocaleString()} WILD</b>
					</p>
					<ToggleButton
						label={'Enable Buy Now price?'}
						toggled={toggledValue}
						onClick={() => setToggledValue(!toggledValue)}
					/>
				</div>
			)}
			{(!hasValidBuyNow || toggledValue) && !isConfirming && (
				<div>
					<TextInput
						className={styles.Input}
						onChange={(text: string) => setAmount(text)}
						placeholder="New Buy Now Price (WILD)"
						numeric
						text={amount}
						error={true}
					/>
					{amount !== undefined && (
						<span className={styles.Fiat}>
							${toFiat(Number(amount) * wildPriceUsd)} USD
						</span>
					)}
				</div>
			)}
		</>
	);

	// Main body of this screen
	const Main = () => (
		<>
			{!isConfirming && Inputs()}
			{isConfirming && Confirming()}
			{internalError && (
				<p className="error-text text-center">{internalError}</p>
			)}
			{!internalError && externalError && (
				<p className="error-text text-center">{externalError}</p>
			)}
			{isWaitingForWalletConfirmation ? (
				<Wizard.Loading message={'Waiting for approval from your wallet...'} />
			) : (
				<Wizard.Buttons
					primaryButtonText={isConfirming ? 'Yes' : 'Next'}
					secondaryButtonText={isConfirming ? 'No' : 'Cancel'}
					onClickPrimaryButton={isConfirming ? onConfirm : onNext}
					onClickSecondaryButton={isConfirming ? onCancel : onCancelParent}
				/>
			)}
		</>
	);

	const Success = () => (
		<div className={styles.Success}>
			<p className="text-center text-success">Buy now set successfully</p>
			<FutureButton glow onClick={onCancelParent}>
				Finish
			</FutureButton>
		</div>
	);

	////////////
	// Render //
	////////////

	return (
		<>
			<Wizard.NFTDetails {...domain} otherDetails={details} />
			<div className={styles.Inputs}>{didSucceed ? Success() : Main()}</div>
		</>
	);
};

export default DomainStep;
