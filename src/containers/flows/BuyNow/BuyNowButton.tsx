import { useState } from 'react';
import { FutureButton, Overlay, TextButton } from 'components';
import BuyNow from '.';

interface BuyNowButtonProps {
	className?: string;
	domainId?: string;
	buttonText?: string;
	disabled?: boolean;
	onSuccess?: () => void;
	style?: React.CSSProperties;
	isTextButton?: boolean;
}

const SetBuyNowButton = ({
	className,
	domainId,
	buttonText = 'Set Buy Now',
	disabled,
	onSuccess,
	style,
	isTextButton,
}: BuyNowButtonProps) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const onClick = () => {
		if (!disabled) {
			setIsModalOpen(true);
		}
	};

	return (
		<>
			{isModalOpen && domainId && (
				<Overlay open={isModalOpen} onClose={() => setIsModalOpen(false)}>
					<BuyNow
						onSuccess={onSuccess}
						domainId={domainId}
						onCancel={() => setIsModalOpen(false)}
					/>
				</Overlay>
			)}
			{isTextButton ? (
				<TextButton className={className} style={style} onClick={onClick}>
					{buttonText}
				</TextButton>
			) : (
				<FutureButton
					style={style}
					className={className}
					glow={!disabled}
					onClick={onClick}
				>
					{buttonText}
				</FutureButton>
			)}
		</>
	);
};

export default SetBuyNowButton;
