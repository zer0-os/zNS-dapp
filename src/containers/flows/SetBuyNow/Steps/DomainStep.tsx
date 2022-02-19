// React Imports
import { useState } from 'react';

// Library Imports
import { toFiat } from 'lib/currency';

// Component Imports
import { TextInput, ToggleButton, Wizard } from 'components';
import { DomainData } from '../SetBuyNow';

// Style Imports
import styles from './DomainStep.module.scss';

type DomainStepProps = {
	domainData: DomainData;
	onNext: (buyNowPrice: number) => void;
	wildPriceUsd: number;
};

const DomainStep = ({
	domainData: domain,
	onNext: onNextParent,
	wildPriceUsd,
}: DomainStepProps) => {
	const domainHasValidBuyNowPrice = (domain.currentBuyNowPrice ?? 0) > 0;

	const [amount, setAmount] = useState<string | undefined>(
		domain.currentBuyNowPrice?.toString(),
	);
	const [toggledValue, setToggledValue] = useState<boolean>(
		domainHasValidBuyNowPrice,
	);
	const [isConfirming, setIsConfirming] = useState<boolean>(false);

	const shouldShowInputs = !domainHasValidBuyNowPrice || toggledValue;

	const onCancel = () => {
		if (isConfirming) {
			setIsConfirming(false);
		} else {
			console.log('cancel');
		}
	};

	const onNext = () => {
		if (amount === undefined || isNaN(Number(amount))) {
			return;
		}
		if (!isConfirming) {
			if (
				Number(amount) > 0 ||
				(Number(amount) === 0 && domainHasValidBuyNowPrice)
			) {
				setIsConfirming(true);
			}
		} else {
			onNextParent(Number(amount));
		}
	};

	return (
		<>
			<Wizard.NFTDetails {...domain} />{' '}
			<div className={styles.Inputs}>
				{(domain.currentBuyNowPrice ?? 0) > 0 && (
					<ToggleButton
						toggled={toggledValue}
						onClick={() => setToggledValue(!toggledValue)}
					/>
				)}
				{shouldShowInputs && !isConfirming && (
					<>
						<TextInput
							className={styles.Input}
							onChange={(text: string) => setAmount(text)}
							placeholder="Buy Now Price (WILD)"
							numeric
							text={amount}
						/>
						{amount !== undefined && (
							<span className={styles.Fiat}>
								${toFiat(Number(amount) * wildPriceUsd)} USD
							</span>
						)}
					</>
				)}
				{isConfirming && (
					<p className={styles.Confirmation}>
						{Number(amount) > 0 ? (
							<>
								Are you sure you want to set a buy now price of{' '}
								<b>{Number(amount).toLocaleString()} WILD</b> for{' '}
								<b>{domain.title}</b>?
							</>
						) : (
							<>
								Are you sure you want to remove the buy now price for{' '}
								<b>{domain.title}</b>
							</>
						)}
					</p>
				)}
			</div>
			<Wizard.Buttons
				primaryButtonText="Next"
				onClickPrimaryButton={onNext}
				onClickSecondaryButton={onCancel}
			/>
		</>
	);
};

export default DomainStep;
