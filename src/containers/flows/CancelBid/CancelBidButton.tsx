//- React Imports
import { useState } from 'react';

//- Components Imports
import { FutureButton, Overlay, TextButton, Tooltip } from 'components';

//- Containers Imports
import CancelBid from './CancelBid';

//- Styles Imports
import textButtonStyles from 'components/Buttons/TextButton/TextButton.module.scss';
import futureButtonStyles from 'components/Buttons/FutureButton/FutureButtonStyle.module.scss';

interface BuyNowButtonProps {
	bidNonce: string;
	buttonText?: string;
	className?: string;
	domainId: string;
	isTextButton?: boolean;
	isDisabled: boolean;
	onCancel?: () => void;
	onSuccess?: () => void;
	style?: React.CSSProperties;
}

const CancelBidButton = ({
	buttonText,
	className,
	isTextButton,
	isDisabled,
	onCancel,
	onSuccess: onSuccessParent,
	style,
	...rest
}: BuyNowButtonProps) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const onClose = () => {
		setIsModalOpen(false);
		onCancel?.();
	};

	const onClick = () => {
		setIsModalOpen(true);
	};

	const onSuccess = () => {
		setIsModalOpen(false);
		onSuccessParent?.();
	};

	return (
		<>
			{isModalOpen && (
				<Overlay open={isModalOpen} onClose={onClose}>
					<CancelBid onClose={onClose} onSuccess={onSuccess} {...rest} />
				</Overlay>
			)}
			{isTextButton ? (
				<TextButton
					style={style}
					className={isDisabled ? textButtonStyles.Disabled : className}
					onClick={onClick}
				>
					{buttonText ? buttonText : 'Cancel Bid'}
				</TextButton>
			) : (
				<FutureButton
					style={style}
					className={isDisabled ? futureButtonStyles.Disabled : className}
					glow={!isDisabled}
					onClick={onClick}
				>
					{buttonText ? buttonText : 'Cancel Bid'}
				</FutureButton>
			)}
		</>
	);
};

export default CancelBidButton;
