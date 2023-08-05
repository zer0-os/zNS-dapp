import { initializeConnector } from '@web3-react/core';
import { Network } from '@web3-react/network';

import { Connection, ConnectionType } from './connections';

export function buildNetworkConnector() {
	const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
		(actions) =>
			new Network({
				actions,
				urlMap: process.env.REACT_APP_RPC_URL_1!,
				defaultChainId: (process.env.REACT_APP_DEFAULT_NETWORK as any) ?? 1,
			}),
	);
	const networkConnection: Connection = {
		connector: web3Network,
		hooks: web3NetworkHooks,
		type: ConnectionType.NETWORK,
	};

	return networkConnection;
}
