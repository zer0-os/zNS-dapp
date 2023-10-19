import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect-v2';

import { Connection, ConnectionType, onConnectionError } from './connections';

export function buildWalletConnectConnector() {
	const [web3WalletConnect, web3WalletConnectHooks] =
		initializeConnector<WalletConnect>(
			(actions) =>
				new WalletConnect({
					actions,
					options: {
						chains: [1],
						rpc: import.meta.env.VITE_APP_RPC_URL_1,
						showQrModal: true,
						projectId: import.meta.env.VITE_APP_WALLET_CONNECT_PROJECT_ID!,
						qrModalOptions: {
							themeMode: 'dark',
							themeVariables: {
								'--wcm-z-index': '999999',
							},
						},
					},
					defaultChainId: parseInt(import.meta.env.VITE_APP_CHAIN_ID! ?? 1),
					onError: onConnectionError,
				}),
		);
	const walletConnectConnection: Connection = {
		connector: web3WalletConnect,
		hooks: web3WalletConnectHooks,
		type: ConnectionType.WALLET_CONNECT,
	};
	return walletConnectConnection;
}
