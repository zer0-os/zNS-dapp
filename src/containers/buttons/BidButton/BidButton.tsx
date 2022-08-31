// React Imports
import React, { useState } from 'react';

// Component Imports
import { FutureButton, TextButton } from 'components';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ConnectWalletPrompt } from 'containers';

//- Constants Imports
import { LABELS } from './BidButton.constants';

type BidButtonProps = {
	onClick: (event?: any) => void;
	className?: string;
	style?: React.CSSProperties;
	toggleable?: boolean;
	children: React.ReactNode;
	glow?: boolean;
	loading?: boolean;
	alt?: boolean;
	isTextButton?: boolean;
};

const BidButton: React.FC<BidButtonProps> = ({
	onClick,
	isTextButton,
	...rest
}) => {
	//- Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleClick = (event: any) => {
		if (account) {
			onClick(event);
		} else {
			setIsModalOpen(true);
		}
	};

	////////////
	// Render //
	////////////
	return (
		<>
			{isModalOpen && (
				<ConnectWalletPrompt
					open={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					promptText={LABELS.PROMPT_TEXT}
				/>
			)}
			{isTextButton ? (
				<TextButton onClick={handleClick} {...rest} />
			) : (
				<FutureButton onClick={handleClick} {...rest} />
			)}
		</>
	);
};

export default BidButton;
