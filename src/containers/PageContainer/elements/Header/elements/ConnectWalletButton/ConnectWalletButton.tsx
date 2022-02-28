import React, { useMemo } from 'react';
import { FutureButton, Spinner } from 'components';
import './_connect-wallet-button.scss';

type ConnectWalletButtonProps = {
	wallet: string | null;
	isDesktop: boolean;
	onClick: () => void;
};

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
	wallet,
	isDesktop,
	onClick,
}) => {
	const { title, wasConnecting } = useMemo(() => {
		const wasConnecting = Boolean(wallet);
		const title = wasConnecting
			? `Trying to connect ${wallet}`
			: `Connect ${isDesktop && 'Wallet'}`;

		return {
			title,
			wasConnecting,
		};
	}, [wallet, isDesktop]);

	return (
		<FutureButton glow onClick={onClick}>
			<div className="connect-wallet-button__container">
				{wasConnecting && <Spinner />}

				<strong className="connect-wallet-button__title">{title}</strong>
			</div>
		</FutureButton>
	);
};
