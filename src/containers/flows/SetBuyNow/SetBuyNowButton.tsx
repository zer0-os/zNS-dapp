import { FutureButton, Overlay, TextButton } from 'components';
import SetBuyNow from '.';

interface SetBuyNowButtonProps {
	className?: string;
	domainId?: string;
	buttonText?: string;
	disabled?: boolean;
	onSuccess?: () => void;
	isTextButton?: boolean;
	setIsSetBuyNowOpen?: (state: boolean) => void;
	isSetBuyNowOpen?: boolean;
}

const SetBuyNowButton = ({
	className,
	domainId,
	buttonText,
	disabled,
	onSuccess,
	isTextButton,
	setIsSetBuyNowOpen,
	isSetBuyNowOpen,
}: SetBuyNowButtonProps) => {
	const onClick = () => {
		if (!disabled && setIsSetBuyNowOpen) {
			setIsSetBuyNowOpen(true);
		}
	};

	return (
		<>
			{isSetBuyNowOpen && domainId && (
				<Overlay
					open={isSetBuyNowOpen}
					onClose={() => setIsSetBuyNowOpen && setIsSetBuyNowOpen(false)}
				>
					<SetBuyNow
						onSuccess={onSuccess}
						domainId={domainId}
						onCancel={() => setIsSetBuyNowOpen?.(false)}
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
