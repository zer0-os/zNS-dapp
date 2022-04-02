import { FutureButton } from 'components';
import styles from './Buttons.module.scss';
import classNames from 'classnames';

const cx = classNames.bind(styles);

export interface ButtonsProps {
	className?: string;
	isPrimaryButtonActive?: boolean;
	isSecondaryButtonActive?: boolean;
	onClickPrimaryButton: () => void;
	onClickSecondaryButton?: () => void;
	primaryButtonText?: string;
	secondaryButtonText?: string;
}

const Buttons = ({
	className,
	isPrimaryButtonActive = true,
	isSecondaryButtonActive = true,
	onClickPrimaryButton,
	onClickSecondaryButton,
	primaryButtonText,
	secondaryButtonText,
}: ButtonsProps) => (
	<div className={cx(styles.Container, className)}>
		{onClickSecondaryButton && (
			<FutureButton
				alt
				glow={isSecondaryButtonActive}
				disabled={!isSecondaryButtonActive}
				onClick={onClickSecondaryButton}
			>
				{secondaryButtonText ? secondaryButtonText : 'Cancel'}
			</FutureButton>
		)}
		<FutureButton
			glow={isPrimaryButtonActive}
			disabled={!isPrimaryButtonActive}
			onClick={onClickPrimaryButton}
		>
			{primaryButtonText ? primaryButtonText : 'Continue'}
		</FutureButton>
	</div>
);

export default Buttons;
