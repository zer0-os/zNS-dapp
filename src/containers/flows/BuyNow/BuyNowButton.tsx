//- React Imports
import { useState } from 'react';

//- Components Imports
import BuyNow from '.';
import { FutureButton, Overlay, TextButton } from 'components';

//- Library Imports
import { useWeb3 } from 'lib/web3-connection/useWeb3';

//- Constants Imports
import { LABELS } from './BuyNowButton.constants';
import { ConvertedTokenInfo } from '@zero-tech/zns-sdk';
import { useWeb3Modal } from '@web3modal/wagmi/react';

interface BuyNowButtonProps {
	className?: string;
	domainId?: string;
	buttonText?: string;
	disabled?: boolean;
	onSuccess?: () => void;
	style?: React.CSSProperties;
	isTextButton?: boolean;
	paymentTokenInfo: ConvertedTokenInfo;
	isLoading?: boolean;
}

const BuyNowButton = ({
	className,
	domainId,
	buttonText = LABELS.BUTTON_TEXT,
	disabled,
	onSuccess,
	style,
	isTextButton,
	paymentTokenInfo,
	isLoading,
}: BuyNowButtonProps) => {
	//- Wallet Data
	const walletContext = useWeb3();
	const { account } = walletContext;

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const { open: openWeb3Modal } = useWeb3Modal();

	const onClick = () => {
		if (!disabled) {
			openWeb3Modal();
		}
	};

	return (
		<>
			{isModalOpen && domainId && account && (
				<Overlay open={isModalOpen} onClose={() => setIsModalOpen(false)}>
					<BuyNow
						onSuccess={onSuccess}
						domainId={domainId}
						onCancel={() => setIsModalOpen(false)}
						paymentTokenInfo={paymentTokenInfo}
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
					loading={isLoading}
				>
					{buttonText}
				</FutureButton>
			)}
		</>
	);
};

export default BuyNowButton;
