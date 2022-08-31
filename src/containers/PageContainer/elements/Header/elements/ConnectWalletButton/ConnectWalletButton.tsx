import React from 'react';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useWeb3React } from '@web3-react/core';
import { FutureButton, Spinner } from 'components';
import {
	useConnectWalletButtonData,
	useConnectWalletButtonHandlers,
} from './hooks';
import './_connect-wallet-button.scss';

type ConnectWalletButtonProps = {
	isDesktop?: boolean;
	onConnectWallet?: () => void;
	className?: string;
};

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
	isDesktop,
	onConnectWallet,
	className,
}) => {
	const { active, connector, account, deactivate } =
		useWeb3React<Web3Provider>();

	const { formattedData } = useConnectWalletButtonData({
		props: {
			isDesktop,
			account,
			active,
			connector,
		},
	});

	const handlers = useConnectWalletButtonHandlers({
		props: {
			deactivate,
		},
		formattedData,
	});

	return (
		<>
			{formattedData.isConnected ? (
				<FutureButton
					glow
					onClick={handlers.handleDisconnectWallet}
					className={className}
				>
					{formattedData.disconnectTitle}
				</FutureButton>
			) : (
				<FutureButton glow onClick={onConnectWallet} className={className}>
					<div className="connect-wallet-button__container">
						{formattedData.isConnecting && <Spinner />}

						<strong className="connect-wallet-button__title">
							{formattedData.connectTitle}
						</strong>
					</div>
				</FutureButton>
			)}
		</>
	);
};
