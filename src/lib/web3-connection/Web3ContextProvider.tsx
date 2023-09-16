import React, { ReactNode, useEffect } from 'react';

import { Web3ReactProvider } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import {
	ConnectionType,
	getConnection,
	PRIORITIZED_CONNECTORS,
} from './wallets/connections';

/**
 * Connects to the given connector.
 * @param connector The connector to connect to.
 */
async function connect(connector: Connector) {
	try {
		if (connector.connectEagerly) {
			await connector.connectEagerly();
		} else {
			await connector.activate();
		}
	} catch (error) {
		console.debug(`web3-react eager connection error: ${error}`);
	}
}

/**
 * Connects to all connectors that support eager connection.
 */
const connectEagerly = async () => {
	await connect(getConnection(ConnectionType.INJECTED).connector);
	await connect(getConnection(ConnectionType.WALLET_CONNECT).connector);
	await connect(getConnection(ConnectionType.COINBASE_WALLET).connector);
	await connect(getConnection(ConnectionType.NETWORK).connector);
};

export const Web3ContextProvider = ({ children }: { children: ReactNode }) => {
	useEffect(() => {
		connectEagerly();
	}, []);

	return (
		<Web3ReactProvider
			connectors={Object.values(PRIORITIZED_CONNECTORS).map((connector) => [
				connector.connector,
				connector.hooks,
			])}
		>
			{children}
		</Web3ReactProvider>
	);
};
