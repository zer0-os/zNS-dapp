import React from 'react';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useWeb3React } from '@web3-react/core';
import { FutureButton, Spinner } from 'components';
import {
	useConnectWalletButtonData,
	// useConnectWalletButtonHandlers,
} from './hooks';
import './_connect-wallet-button.scss';
import { tryDeactivateConnector } from '../../../../../../lib/wallets/connections';
import { Button } from '@zero-tech/zui/components';

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
	const { isActive, connector } = useWeb3React<Web3Provider>();

	const handleOnClick = isActive
		? () => tryDeactivateConnector(connector)
		: onConnectWallet;
	const buttonText = isActive ? 'Disconnect' : 'Connect';

	return (
		<Button onPress={handleOnClick} className={className}>
			{buttonText}
		</Button>
	);

	// return (
	// 	<>
	// 		{formattedData.isConnected ? (
	// 			<FutureButton
	// 				glow
	// 				onClick={handlers.handleDisconnectWallet}
	// 				className={className}
	// 			>
	// 				{formattedData.disconnectTitle}
	// 			</FutureButton>
	// 		) : (
	// 			<FutureButton glow onClick={onConnectWallet} className={className}>
	// 				<div className="connect-wallet-button__container">
	// 					{formattedData.isConnecting && <Spinner />}
	//
	// 					<strong className="connect-wallet-button__title">
	// 						{formattedData.connectTitle}
	// 					</strong>
	// 				</div>
	// 			</FutureButton>
	// 		)}
	// 	</>
	// );
};
