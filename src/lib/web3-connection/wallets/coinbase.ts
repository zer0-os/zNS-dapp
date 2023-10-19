import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector } from '@web3-react/core';

import { Connection, ConnectionType, onConnectionError } from './connections';

export function buildCoinbaseWalletConnector() {
	const [web3CoinbaseWallet, web3CoinbaseWalletHooks] =
		initializeConnector<CoinbaseWallet>(
			(actions) =>
				new CoinbaseWallet({
					actions,
					options: {
						appName: import.meta.env.VITE_APP_TITLE!,
						url: import.meta.env.VITE_APP_RPC_URL_1!,
					},
					onError: onConnectionError,
				}),
		);
	const coinbaseWalletConnection: Connection = {
		connector: web3CoinbaseWallet,
		hooks: web3CoinbaseWalletHooks,
		type: ConnectionType.COINBASE_WALLET,
	};

	return coinbaseWalletConnection;
}
