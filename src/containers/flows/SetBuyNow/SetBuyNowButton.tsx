import { useState } from 'react';
import { FutureButton, Overlay } from 'components';
import SetBuyNow from '.';

interface SetBuyNowButtonProps {
	className?: string;
	domainId?: string;
	buttonText?: string;
	disabled?: boolean;
}

const SetBuyNowButton = ({
	className,
	domainId,
	buttonText,
	disabled,
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
