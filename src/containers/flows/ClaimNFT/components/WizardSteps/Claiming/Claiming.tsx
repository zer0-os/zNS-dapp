import { FormEvent, useState } from 'react';
//- Library Imports
import classNames from 'classnames/bind';
import { Domain } from '@zero-tech/zns-sdk';
//- Component Imports
import { TextInput, QuestionButton, Tooltip, FutureButton } from 'components';
//- Constants Imports
import { LABELS, MESSAGES } from 'containers/flows/ClaimNFT/ClaimNFT.constants';
import { TOOLTIP, INPUT, BUTTON_TEXT, WARNINGS } from './Claiming.constants';
//- Utils Imports
import {
	getPlaceholder,
	handleInputError,
	maxQuantityLimit,
} from './Claiming.utils';
//- Style Imports
import styles from './Claiming.module.scss';
import { IDWithClaimStatus } from '@zero-tech/zsale-sdk';
type ClaimingProps = {
	eligibleDomains?: IDWithClaimStatus[];
	apiError?: string;
	statusText?: string;
	onClaim: (quantity: number) => void;
};
const cx = classNames.bind(styles);
const Claiming = ({
	eligibleDomains,
	apiError,
	statusText,
	onClaim,
}: ClaimingProps) => {
	///////////////////////
	// State & Variables //
	///////////////////////
	const [quantity, setQuantity] = useState<string | undefined>();
	const [inputError, setInputError] = useState<string | undefined>();
	const totalEligibleDomains = eligibleDomains?.length ?? 0;
	const exceedsQuantityMintLimit = totalEligibleDomains > maxQuantityLimit;
	const hasValue = Boolean(quantity);
	const placeholder = getPlaceholder(
		totalEligibleDomains,
		exceedsQuantityMintLimit,
	);
	const validQuantity =
		Number(quantity) <= totalEligibleDomains &&
		Number(quantity) > 0 &&
		Number(quantity) <= maxQuantityLimit &&
		quantity !== undefined &&
		!isNaN(Number(quantity)) &&
		Number(quantity) % 1 === 0;
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
		setInputError('');
		e.preventDefault();
		if (validQuantity) {
			onClaim(Number(quantity));
		} else {
			return;
		}
	};
	return (
		<>
			<section className={styles.Container}>
				<form onSubmit={onSubmit}>
					<div className={styles.TextContainer}>
						<div
							className={styles.QuantityText}
						>{`${MESSAGES.APPEND_CLAIMABLE_TEXT} ${totalEligibleDomains} ${LABELS.MOTOS}`}</div>
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
						<FutureButton
							glow={validQuantity}
							disabled={!validQuantity}
							onClick={() => {}}
						>
							{BUTTON_TEXT}
						</FutureButton>
					</div>
				</form>
			</section>
		</>
	);
};
export default Claiming;
