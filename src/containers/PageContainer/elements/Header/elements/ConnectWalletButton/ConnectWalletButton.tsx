import React from 'react';
import { useWeb3 } from 'lib/web3-connection/useWeb3';
import './_connect-wallet-button.scss';
import { tryDeactivateConnector } from 'lib/web3-connection/wallets/connections';
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
	const { isActive, connector } = useWeb3();

	const handleOnClick = isActive
		? () => tryDeactivateConnector(connector)
		: onConnectWallet;
	const buttonText = isActive ? 'Disconnect' : 'Connect';

	return (
		<Button onPress={handleOnClick} className={className}>
			{buttonText}
		</Button>
	);
};
