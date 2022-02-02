// React Imports
import React, { useState } from 'react';

// Component Imports
import { FutureButton, Tooltip } from 'components';
import { ConnectWalletPrompt } from 'containers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';

interface BuyNowButtonProps {
	onClick: (event?: any) => void;
	className?: string;
	style?: React.CSSProperties;
	toggleable?: boolean;
	children: React.ReactNode;
	glow?: boolean;
	loading?: boolean;
	alt?: boolean;
	tooltip?: string;
}

interface ConditionalWrapperProps {
	condition: boolean;
	wrapper: (children: React.ReactElement) => JSX.Element;
	children: React.ReactElement;
}

const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({
	condition,
	wrapper,
	children,
}) => (condition ? wrapper(children) : children);

const BuyNowButton: React.FC<BuyNowButtonProps> = ({
	onClick,
	tooltip,
	...rest
}) => {
	//- states
	const [isModalOpen, setIsModalOpen] = useState(false);

	//- Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;

	const handleClick = (event: React.MouseEvent) => {
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
			<ConditionalWrapper
				condition={tooltip !== undefined}
				wrapper={(children) => (
					<Tooltip
						text={
							Intl.NumberFormat('en-US', {
								minimumFractionDigits: 0,
							}).format(Number(ethers.utils.formatEther(tooltip!))) + ' WILD'
						}
					>
						{children}
					</Tooltip>
				)}
			>
				<FutureButton onClick={handleClick} {...rest} />
			</ConditionalWrapper>
		</>
	);
};

export default BuyNowButton;
