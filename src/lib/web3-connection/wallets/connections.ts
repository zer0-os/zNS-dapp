import { Web3ReactHooks } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import { buildInjectedConnector } from './metamask';
import { buildNetworkConnector } from './network';
import { buildWalletConnectConnector } from './wallet-connect-v2';
import { buildCoinbaseWalletConnector } from './coinbase';

export interface Connection {
	connector: Connector;
	hooks: Web3ReactHooks;
	type: ConnectionType;
}

export enum ConnectionType {
	INJECTED = 'INJECTED',
	NETWORK = 'NETWORK',
	WALLET_CONNECT = 'WALLET_CONNECT',
	COINBASE_WALLET = 'COINBASE_WALLET',
}

export function onConnectionError(error: Error) {
	console.debug(`web3-react error: ${error}`);
}

export const PRIORITIZED_CONNECTORS: { [key in ConnectionType]: Connection } = {
	[ConnectionType.COINBASE_WALLET]: buildCoinbaseWalletConnector(),
	[ConnectionType.INJECTED]: buildInjectedConnector(),
	[ConnectionType.NETWORK]: buildNetworkConnector(),
	[ConnectionType.WALLET_CONNECT]: buildWalletConnectConnector(),
};

export function getConnection(c: Connector | ConnectionType) {
	if (c instanceof Connector) {
		const connection = Object.values(PRIORITIZED_CONNECTORS).find(
			(connection) => connection.connector === c,
		);
		if (!connection) {
			throw Error('Unsupported Connector');
		}
		return connection;
	} else {
		switch (c) {
			case ConnectionType.COINBASE_WALLET:
				return PRIORITIZED_CONNECTORS[ConnectionType.COINBASE_WALLET];
			case ConnectionType.INJECTED:
				return PRIORITIZED_CONNECTORS[ConnectionType.INJECTED];
			case ConnectionType.NETWORK:
				return PRIORITIZED_CONNECTORS[ConnectionType.NETWORK];
			case ConnectionType.WALLET_CONNECT:
				return PRIORITIZED_CONNECTORS[ConnectionType.WALLET_CONNECT];
		}
	}
}

export const tryActivateConnector = async (
	connector: Connector,
): Promise<ConnectionType | undefined> => {
	await connector.activate();
	return getConnection(connector).type;
};

export const tryDeactivateConnector = async (
	connector: Connector,
): Promise<null | undefined> => {
	connector.deactivate?.();
	connector.resetState();
	return;
};
