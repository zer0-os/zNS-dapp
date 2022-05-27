//-s React Imports
import { useState } from 'react';

//- Library Imports
import classNames from 'classnames/bind';

//- Component Imports
import { TextInput, QuestionButton, Tooltip, FutureButton } from 'components';

//- Constants Imports
import { LABELS, MESSAGES } from 'containers/flows/ClaimNFT/ClaimNFT.constants';
import { TOOLTIP, INPUT, BUTTON_TEXT } from './Claiming.constants';

//- Utils Imports
import { getPlaceholder } from './Claiming.utils';

//- Style Imports
import styles from './Claiming.module.scss';

type ClaimingProps = {
	maxQuantity: number;
	error?: string;
	onClaim: () => void;
};

const cx = classNames.bind(styles);

const Claiming = ({ maxQuantity, onClaim, error }: ClaimingProps) => {
	///////////////////////
	// State & Variables //
	///////////////////////

	const [quantity, setQuantity] = useState<string | undefined>();

	const validQuantity = Number(quantity) === maxQuantity;
	const hasValue = Boolean(quantity);
	const placeholder = getPlaceholder(maxQuantity);

	///////////////
	// Functions //
	///////////////

	const onSubmit = () => {
		onClaim();
	};

	return (
		<>
			<section className={styles.Container}>
				<div className={styles.TextContainer}>
					<div
						className={styles.QuantityText}
					>{`${MESSAGES.APPEND_CLAIMABLE_TEXT} ${maxQuantity} ${LABELS.MOTOS}`}</div>
					<Tooltip deepPadding text={TOOLTIP.MAX_QUANTITY}>
						<QuestionButton small />
					</Tooltip>
				</div>
				<div className={styles.InputHeaderContainer}>
					<div className={styles.Header}>{INPUT.HEADER}</div>
				</div>
				<div
					className={cx(styles.InputContainer, {
						hasValue: hasValue,
						hasError: error,
					})}
				>
					{quantity && <span>{placeholder}</span>}
					<TextInput
						className={cx(styles.Input, {
							hasValue: hasValue,
						})}
						numeric
						onChange={(total: string) => setQuantity(total)}
						placeholder={placeholder}
						text={quantity}
						type={''}
					/>
				</div>
				{error && (
					<div
						className={cx(styles.Error, {
							hasError: error,
						})}
					>
						{error}
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
