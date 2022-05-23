//- React Imports
import { useState } from 'react';

//- Components Imports
import { FutureButton, Overlay, TextButton } from 'components';
import CancelBid from './CancelBid';
import { TokenPriceInfo } from '@zero-tech/zns-sdk';

interface BuyNowButtonProps {
	bidNonce: string;
	buttonText?: string;
	className?: string;
	domainId: string;
	isTextButton?: boolean;
	onCancel?: () => void;
	onSuccess?: () => void;
	style?: React.CSSProperties;
	paymentTokenInfo: TokenPriceInfo;
}

const CancelBidButton = ({
	buttonText,
	className,
	isTextButton,
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
				<TextButton style={style} className={className} onClick={onClick}>
					{buttonText ? buttonText : 'Cancel Bid'}
				</TextButton>
			) : (
				<FutureButton
					style={style}
					className={className}
					glow
					onClick={onClick}
				>
					{buttonText ? buttonText : 'Cancel Bid'}
				</FutureButton>
			)}
		</>
	);
};

export default CancelBidButton;
