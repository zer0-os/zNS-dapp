// React Imports
import React, { useState } from 'react';

// Component Imports
import { FutureButton } from 'components';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ConnectWalletPrompt } from 'containers';

type BidButtonProps = {
	onClick: (event?: any) => void;
	className?: string;
	style?: React.CSSProperties;
	toggleable?: boolean;
	children: React.ReactNode;
	glow?: boolean;
	loading?: boolean;
	alt?: boolean;
};

const BidButton: React.FC<BidButtonProps> = ({ onClick, ...rest }) => {
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
				/>
			)}
			<FutureButton onClick={handleClick} {...rest}>
				Make A Bid
			</FutureButton>
		</>
	);
};

export default BidButton;
