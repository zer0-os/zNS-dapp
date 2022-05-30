//- React Imports
import { useState } from 'react';

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

type ClaimingProps = {
	eligibleDomains?: Domain[];
	apiError?: string;
	onClaim: () => void;
};

const cx = classNames.bind(styles);

const Claiming = ({ eligibleDomains, onClaim, apiError }: ClaimingProps) => {
	///////////////////////
	// State & Variables //
	///////////////////////

	const [quantity, setQuantity] = useState<string | undefined>();
	const [inputError, setInputError] = useState<string | undefined>();
	const totalEligibleDomains = eligibleDomains?.length ?? 0;
	const exceedsQuantityMintLimit = totalEligibleDomains > maxQuantityLimit;
	const validQuantity =
		Number(quantity) <= totalEligibleDomains &&
		Number(quantity) > 0 &&
		Number(quantity) <= maxQuantityLimit;
	const hasValue = Boolean(quantity);
	const placeholder = getPlaceholder(
		totalEligibleDomains,
		exceedsQuantityMintLimit,
	);

	///////////////
	// Functions //
	///////////////

	const onSubmit = () => {
		onClaim();
	};

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

	return (
		<>
			<section className={styles.Container}>
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
						onClick={onSubmit}
					>
						{BUTTON_TEXT}
					</FutureButton>
				</div>
			</section>
		</>
	);
};

export default Claiming;
