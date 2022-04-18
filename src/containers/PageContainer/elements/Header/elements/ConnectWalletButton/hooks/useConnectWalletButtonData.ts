import { useMemo } from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { LOCAL_STORAGE_KEYS } from 'constants/localStorage';

type UseConnectWalletButtonDataProps = {
	props: {
		isDesktop: boolean;
		account: string | null | undefined;
		active: boolean;
		connector: AbstractConnector | undefined;
	};
};

type UseConnectWalletButtonDataReturn = {
	formattedData: {
		wallet: string | null;
		isConnected: boolean;
		connectTitle: string;
		disconnectTitle: string;
		isConnecting: boolean;
	};
};

export const useConnectWalletButtonData = ({
	props,
}: UseConnectWalletButtonDataProps): UseConnectWalletButtonDataReturn => {
	const formattedData = useMemo(() => {
		const wallet = localStorage.getItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET);
		const isConnected =
			props.active && Boolean(props.account) && Boolean(props.connector);
		const isConnecting = !isConnected && Boolean(wallet);
		const connectTitle = isConnecting ? `` : `Connect`;
		const disconnectTitle = `Disconnect`;

		return {
			wallet,
			isConnected,
			connectTitle,
			disconnectTitle,
			isConnecting,
		};
	}, [props]);

	return {
		formattedData,
	};
};
