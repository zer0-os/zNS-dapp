import React from 'react';
import { useWeb3 } from 'lib/web3-connection/useWeb3';
import './_connect-wallet-button.scss';
import { tryDeactivateConnector } from 'lib/web3-connection/wallets/connections';
import { Button } from '@zero-tech/zui/components';
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';

type ConnectWalletButtonProps = {
	isDesktop?: boolean;
	onConnectWallet?: () => void;
	className?: string;
};

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
	className,
}) => {
	const { isActive } = useWeb3();
	const { open: isModalOpen } = useWeb3ModalState();

	const { open } = useWeb3Modal();

	if (isActive) {
		return <w3m-account-button balance="hide" />;
	} else {
		return (
			<Button isLoading={isModalOpen} onPress={open} className={className}>
				Connect
			</Button>
		);
	}
};
