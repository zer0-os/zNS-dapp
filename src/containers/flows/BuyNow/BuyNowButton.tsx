import { useState } from 'react';
import { FutureButton, Overlay } from 'components';
import BuyNow from '.';

interface BuyNowButtonProps {
	className?: string;
	domainId?: string;
	buttonText?: string;
	disabled?: boolean;
	onSuccess?: () => void;
	style?: React.CSSProperties;
}

const SetBuyNowButton = ({
	className,
	domainId,
	buttonText,
	disabled,
	onSuccess,
	style,
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
			<FutureButton
				style={style}
				className={className}
				glow={!disabled}
				onClick={onClick}
			>
				{buttonText ? buttonText : 'Edit Buy Now'}
			</FutureButton>
		</>
	);
};

export default SetBuyNowButton;
