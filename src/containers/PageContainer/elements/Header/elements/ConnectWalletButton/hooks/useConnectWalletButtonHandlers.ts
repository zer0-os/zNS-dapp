import { useCallback } from 'react';
import { walletlink, fortmatic, portis } from 'lib/connectors';
import { WALLETS } from 'constants/wallets';
import { LOCAL_STORAGE_KEYS } from 'constants/localStorage';

type UseConnectWalletButtonHandlersProps = {
	props: {
		deactivate: () => void;
	};
	formattedData: {
		wallet: string | null;
	};
};

type UseConnectWalletButtonHandlersReturn = {
	handleDisconnectWallet: () => void;
};

export const useConnectWalletButtonHandlers = ({
	props,
	formattedData,
}: UseConnectWalletButtonHandlersProps): UseConnectWalletButtonHandlersReturn => {
	const handleDisconnectWallet = useCallback(() => {
		props.deactivate();

		//if has a wallet connected, instead of just deactivate, close connection too
		switch (formattedData.wallet) {
			case WALLETS.COINBASE: {
				walletlink.close();
				break;
			}
			case WALLETS.PORTIS: {
				portis.close();
				break;
			}
			case WALLETS.FORTMATIC: {
				fortmatic.close();
				break;
			}
			case WALLETS.WALLET_CONNECT: {
				localStorage.removeItem(WALLETS.WALLET_CONNECT); //session info of walletconnect
				break;
			}
			default:
				break;
		}
		localStorage.removeItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET);
	}, [props, formattedData]);

	return {
		handleDisconnectWallet,
	};
};
