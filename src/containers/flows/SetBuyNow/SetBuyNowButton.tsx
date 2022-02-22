import { useState } from 'react';
import { FutureButton, Overlay } from 'components';
import SetBuyNow from '.';

interface SetBuyNowButtonProps {
	className?: string;
	domainId?: string;
	buttonText?: string;
	disabled?: boolean;
	onSuccess?: () => void;
}

const SetBuyNowButton = ({
	className,
	domainId,
	buttonText,
	disabled,
	onSuccess,
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
					/>
				</Overlay>
			)}
			<FutureButton className={className} glow={!disabled} onClick={onClick}>
				{buttonText ? buttonText : 'Edit Buy Now'}
			</FutureButton>
		</>
	);
};

export default SetBuyNowButton;
