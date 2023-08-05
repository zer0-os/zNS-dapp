//- React Imports
import { FormEvent, useEffect, useState } from 'react';

//- Library Imports
import classNames from 'classnames/bind';
import { ClaimableDomain } from '@zero-tech/zsale-sdk';

//- Component Imports
import {
	FutureButton,
	QuestionButton,
	Spinner,
	TextInput,
	Tooltip,
} from 'components';

//- Constants Imports
import { LABELS, MESSAGES } from 'containers/flows/ClaimNFT/ClaimNFT.constants';
import { BUTTON_TEXT, INPUT, TOOLTIP, WARNINGS } from './Claiming.constants';

//- Utils Imports
import {
	getPlaceholder,
	handleInputError,
	maxQuantityLimit,
} from './Claiming.utils';

//- Style Imports
import styles from './Claiming.module.scss';

type ClaimingProps = {
	eligibleDomains?: ClaimableDomain[];
	apiError?: string;
	statusText?: string;
	onClaim: (quantity: number) => void;
	isClaiming?: boolean;
};

const cx = classNames.bind(styles);

const Claiming = ({
	eligibleDomains,
	apiError,
	statusText,
	onClaim,
	isClaiming,
}: ClaimingProps) => {
	///////////////////////
	// State & Variables //
	///////////////////////
	const [quantity, setQuantity] = useState<string | undefined>();
	const [inputError, setInputError] = useState<string | undefined>();
	const [displayTotal, setDisplayTotal] = useState<number>();
	const [isSubmitted, setIsSubmitted] = useState<boolean>();
	const totalEligibleDomains = eligibleDomains?.length ?? 0;
	const exceedsQuantityMintLimit = totalEligibleDomains > maxQuantityLimit;
	const hasValue = Boolean(quantity);
	const placeholder = getPlaceholder(displayTotal, exceedsQuantityMintLimit);

	const validQuantity =
		Number.isInteger(Number(quantity)) &&
		Number(quantity) > 0 &&
		Number(quantity) <= Math.min(totalEligibleDomains, maxQuantityLimit);

	///////////////
	// Functions //
	///////////////

	const handleChange = (total: string) => {
		setInputError('');
		setQuantity(total);
		handleInputError(
			total,
			totalEligibleDomains,
			exceedsQuantityMintLimit,
			setInputError,
		);
	};

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		setIsSubmitted(true);
		setDisplayTotal(totalEligibleDomains);
		setInputError('');
		e.preventDefault();
		if (validQuantity) {
			onClaim(Number(quantity));
		} else {
			return;
		}
	};

	/////////////
	// EFfects //
	/////////////

	useEffect(() => {
		if (!isSubmitted) {
			setDisplayTotal(totalEligibleDomains);
		}
	}, [isSubmitted, totalEligibleDomains]);

	return (
		<>
			<section className={styles.Container}>
				<form onSubmit={onSubmit}>
					<div className={styles.TextContainer}>
						<div
							className={styles.QuantityText}
						>{`${MESSAGES.APPEND_CLAIMABLE_TEXT} ${displayTotal} ${LABELS.MOTOS}`}</div>
						<Tooltip deepPadding text={TOOLTIP.MAX_QUANTITY}>
							<QuestionButton small />
						</Tooltip>
					</div>
					{exceedsQuantityMintLimit && (
						<div className={styles.WarningPrompt}>{WARNINGS.MINT_LIMIT}</div>
					)}
					<div className={styles.InputHeaderContainer}>
						<div className={styles.Header}>{INPUT.HEADER}</div>
					</div>
					<div
						className={cx(styles.InputContainer, {
							hasValue: hasValue,
							hasError: inputError,
						})}
					>
						{quantity && (
							<span
								className={cx(styles.SecondaryPlaceholder, {
									hasError: inputError,
								})}
							>
								{placeholder}
							</span>
						)}
						<TextInput
							className={cx(styles.Input, {
								hasValue: hasValue,
								hasError: inputError,
							})}
							numeric
							onChange={handleChange}
							placeholder={placeholder}
							text={quantity}
							type={INPUT.TYPE}
						/>
					</div>
					{statusText && (
						<div className={styles.StatusContainer}>
							<div className={styles.Status}>{statusText}</div>
						</div>
					)}
					{inputError && (
						<div
							className={cx(styles.Error, {
								hasError: inputError,
							})}
						>
							{inputError}
						</div>
					)}
					{apiError && (
						<div
							className={cx(styles.ApiError, {
								apiError: apiError,
							})}
						>
							{apiError}
						</div>
					)}

					<div className={styles.ButtonContainer}>
						{!isClaiming ? (
							<FutureButton
								glow={validQuantity}
								disabled={!validQuantity}
								onClick={() => {}}
							>
								{BUTTON_TEXT}
							</FutureButton>
						) : (
							<Spinner />
						)}
					</div>
				</form>
			</section>
		</>
	);
};
export default Claiming;
