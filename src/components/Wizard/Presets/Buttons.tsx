import { FutureButton } from 'components';
import styles from './Buttons.module.scss';
import classNames from 'classnames';

const cx = classNames.bind(styles);

export type ButtonVariants = 'primary' | 'secondary';

export interface ButtonsProps {
	className?: string;
	isPrimaryButtonActive?: boolean;
	isSecondaryButtonActive?: boolean;
	onClickPrimaryButton: () => void;
	onClickSecondaryButton?: () => void;
	primaryButtonText?: string;
	secondaryButtonText?: string;
	primaryButtonVariant?: ButtonVariants;
	secondaryButtonVariant?: ButtonVariants;
}

const Buttons = ({
	className,
	isPrimaryButtonActive,
	isSecondaryButtonActive,
	onClickPrimaryButton,
	onClickSecondaryButton,
	primaryButtonText,
	secondaryButtonText,
	primaryButtonVariant = 'primary',
	secondaryButtonVariant = 'primary',
}: ButtonsProps) => (
	<div className={cx(styles.Container, className)}>
		{onClickSecondaryButton && (
			<FutureButton
				alt={secondaryButtonVariant === 'primary'}
				secondary={secondaryButtonVariant === 'secondary'}
				glow={isSecondaryButtonActive === undefined || isSecondaryButtonActive}
				onClick={onClickSecondaryButton}
			>
				{secondaryButtonText ? secondaryButtonText : 'Cancel'}
			</FutureButton>
		)}
		<FutureButton
			glow={isPrimaryButtonActive === undefined || isPrimaryButtonActive}
			onClick={onClickPrimaryButton}
		>
			{primaryButtonText ? primaryButtonText : 'Continue'}
		</FutureButton>
	</div>
);

export default Buttons;
