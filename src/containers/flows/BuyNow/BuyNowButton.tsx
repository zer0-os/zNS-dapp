//- React Imports
import { useState } from 'react';

//- Containers Imports
import { ConnectWalletPrompt } from 'containers';

//- Components Imports
import BuyNow from '.';
import { FutureButton, Overlay, TextButton } from 'components';

//- Library Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

//- Constants Imports
import { LABELS } from './BuyNowButton.constants';

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
	buttonText = LABELS.BUTTON_TEXT,
	disabled,
	onSuccess,
	style,
	isTextButton,
}: BuyNowButtonProps) => {
	//- Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
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
