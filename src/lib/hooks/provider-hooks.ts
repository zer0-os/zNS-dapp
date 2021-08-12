import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected } from '../connectors';
import { connectorFromName } from 'components/ConnectToWallet/ConnectToWallet';
import { AbstractConnector } from '@web3-react/abstract-connector';

export function useEagerConnect() {
	const { activate, active } = useWeb3React();

	const [tried, setTried] = useState(false);

	useEffect(() => {
		const wallet = localStorage.getItem('chosenWallet');

		const reConnectToWallet = async (wallet: string) => {
			if (wallet === 'metamask') {
				await injected.isAuthorized().then((isAuthorized: boolean) => {
					if (isAuthorized) {
						activate(injected, undefined, true).catch(() => {
							setTried(true);
						});
					} else {
						setTried(true);
					}
				});
			} else {
				const c = connectorFromName(wallet) as AbstractConnector;
				if (c) {
					if (wallet === 'portis') {
						setTimeout(() => {
							//timeout to reload if wallets isnt connected after 30 seconds
							if (
								!active &&
								localStorage.getItem('chosenWallet') === 'portis'
							) {
								//if portis connect request got stuck
								//if user isnt connected when time ends
								localStorage.clear(); //dont reconnect next time
								window.location.reload();
							}
						}, 30000);
					}
					await activate(c, async (e: Error) => {
						localStorage.removeItem('chosenWallet');
						console.error(`Encounter error while connecting to ${wallet}.`);
						console.error(e);
					});
					setTried(true);
				}
			}
		};

		if (wallet) reConnectToWallet(wallet);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // intentionally only running on mount (make sure it's only mounted once :))

	// if the connection worked, wait until we get confirmation of that to flip the flag
	useEffect(() => {
		if (!tried && active) {
			setTried(true);
		}
	}, [tried, active]);

	return tried;
}

export function useInactiveListener(suppress: boolean = false) {
	const { active, error, activate } = useWeb3React();

	useEffect((): any => {
		const { ethereum } = window as any;
		if (ethereum && ethereum.on && !active && !error && !suppress) {
			const handleConnect = () => {
				//console.log("Handling 'connect' event");
				activate(injected);
			};
			const handleChainChanged = (chainId: string | number) => {
				//console.log("Handling 'chainChanged' event with payload", chainId);
				activate(injected);
			};
			const handleAccountsChanged = (accounts: string[]) => {
				//console.log("Handling 'accountsChanged' event with payload", accounts);
				if (accounts.length > 0) {
					activate(injected);
				}
			};
			const handleNetworkChanged = (networkId: string | number) => {
				//console.log("Handling 'networkChanged' event with payload", networkId);
				activate(injected);
			};

			ethereum.on('connect', handleConnect);
			ethereum.on('chainChanged', handleChainChanged);
			ethereum.on('accountsChanged', handleAccountsChanged);
			ethereum.on('networkChanged', handleNetworkChanged);

			return () => {
				if (ethereum.removeListener) {
					ethereum.removeListener('connect', handleConnect);
					ethereum.removeListener('chainChanged', handleChainChanged);
					ethereum.removeListener('accountsChanged', handleAccountsChanged);
					ethereum.removeListener('networkChanged', handleNetworkChanged);
				}
			};
		}
	}, [active, error, suppress, activate]);
}
