//- React Imports
import { useState } from 'react';

//- Containers Imports
import { ConnectWalletPrompt } from 'containers';

//- Components Imports
import BuyNow from '.';
import { FutureButton, Overlay, TextButton } from 'components';

//- Library Imports
import { useWeb3 } from 'lib/web3-connection/useWeb3';
import { Web3Provider } from '@ethersproject/providers';

//- Constants Imports
import { LABELS } from './BuyNowButton.constants';
import { ConvertedTokenInfo } from '@zero-tech/zns-sdk';

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

	const onClick = () => {
		if (!disabled) {
			setIsModalOpen(true);
		}
	};

	return (
		<>
			{isModalOpen && !account && (
				<ConnectWalletPrompt
					open={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					promptText={LABELS.PROMPT_TEXT}
				/>
			)}
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
