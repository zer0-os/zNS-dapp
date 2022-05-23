//- React Imports
import { useState } from 'react';

//- Components Imports
import { FutureButton, Overlay, TextButton } from 'components';
import SetBuyNow from '.';
import { TokenPriceInfo } from '@zero-tech/zns-sdk';

interface SetBuyNowButtonProps {
	className?: string;
	domainId?: string;
	buttonText?: string;
	disabled?: boolean;
	onSuccess?: () => void;
	isTextButton?: boolean;
	paymentTokenInfo: TokenPriceInfo;
}

const SetBuyNowButton = ({
	className,
	domainId,
	buttonText,
	disabled,
	onSuccess,
	isTextButton,
	paymentTokenInfo,
}: SetBuyNowButtonProps) => {
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
					<SetBuyNow
						onSuccess={onSuccess}
						domainId={domainId}
						onCancel={() => setIsModalOpen(false)}
						paymentTokenInfo={paymentTokenInfo}
					/>
				</Overlay>
			)}
			{isTextButton ? (
				<TextButton className={className} onClick={onClick}>
					{buttonText ? buttonText : 'Edit Buy Now'}
				</TextButton>
			) : (
				<FutureButton className={className} glow={!disabled} onClick={onClick}>
					{buttonText ? buttonText : 'Edit Buy Now'}
				</FutureButton>
			)}
		</>
	);
};
export default SetBuyNowButton;
