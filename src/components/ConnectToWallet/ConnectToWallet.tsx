//- React Imports
import React, { useState } from 'react';

//- Web3 Imports
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useWeb3React } from '@web3-react/core';
import {
	injected,
	walletlink,
	fortmatic,
	portis,
	createWalletConnectConnector,
} from 'lib/connectors';
import { AbstractConnector } from '@web3-react/abstract-connector';

//- Style Imports
import WalletStyles from './Wallet.module.scss';

//- Component Imports
import { FutureButton, Spinner, Image, Overlay } from 'components';

//- Utils Imports
import { WalletOptionType, getWalletOptionStyle } from './utils';

//- Asset Imports
import metamaskIcon from './assets/metamask.svg';
import walletConnectIcon from './assets/walletconnect.svg';
import coinbaseWalletIcon from './assets/coinbasewallet.svg';
import fortmaticIcon from './assets/fortmatic.svg';
import portisIcon from './assets/portis.svg';
import useNotification from 'lib/hooks/useNotification';

type ConnectToWalletProps = {
	onConnect: () => void;
	closeOverlay: () => void;
};

const nameToConnector: { [key: string]: AbstractConnector } = {
	metamask: injected,
	coinbase: walletlink,
	fortmatic: fortmatic,
	portis: portis,
};

export const connectorFromName = (name: string) => {
	if (name === WalletOptionType.WALLET_CONNECT) {
		return createWalletConnectConnector();
	}

	const connector = nameToConnector[name];

	if (!connector) {
		console.error(`invalid connector ${name}`);
		return null;
	}

	return connector;
};

const nameFromConnector = (c: AbstractConnector) => {
	switch (c) {
		case injected:
			return 'MetaMask';
	}

	return 'Wallet';
};

const ConnectToWallet: React.FC<ConnectToWalletProps> = ({
	onConnect,
	closeOverlay,
}) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { active, connector, activate, deactivate } = walletContext;
	const [isLoading, setIsLoading] = useState(false); //state for trigger the loading spinner

	//- Notification State
	const { addNotification } = useNotification();

	const connectToWallet = async (wallet: string) => {
		setIsLoading(true);
		const c = connectorFromName(wallet) as AbstractConnector;

		if (c) {
			//if user tries to connect metamask without provider
			if (wallet === WalletOptionType.METAMASK && !window.ethereum) {
				addNotification(
					'Unable to find Metamask. Please check it is installed.',
				);
				setIsLoading(false);
				return;
			}

			const previousWallet = localStorage.getItem('chosenWallet');
			if (previousWallet) await closeSession(previousWallet);
			localStorage.setItem('chosenWallet', wallet); //sets the actual wallet key to reconnect if connected

			//metamask may get stuck due to eth_requestAccounts promise, if user close log in overlay
			if (wallet === WalletOptionType.METAMASK) {
				setTimeout(async () => {
					const authorized = await injected.isAuthorized();
					if (
						!authorized &&
						localStorage.getItem('chosenWallet') === WalletOptionType.METAMASK
					)
						addNotification('Cant connect?, please reload and retry');
				}, 20000); //@todo: check if metamask solves this, issue #10085
			}

			await activate(c, async (e) => {
				addNotification(`Failed to connect to wallet.`);
				localStorage.removeItem('chosenWallet');
				console.error(`Encounter error while connecting to ${wallet}.`);
				console.error(e);
				//if page has a connection request stuck, it needs to reload to get connected again
				if (
					e.message === 'Already processing eth_requestAccounts. Please wait.'
				)
					window.location.reload();
			});

			setIsLoading(false);
			onConnect();
		}
	};

	const closeSession = (wallet: string) => {
		deactivate();
		//if has a wallet connected, instead of just deactivate, close connection too
		switch (wallet) {
			case WalletOptionType.COINBASE: {
				walletlink.close();
				break;
			}
			case WalletOptionType.PORTIS: {
				portis.close();
				break;
			}
			case WalletOptionType.FORTMATIC: {
				fortmatic.close();
				break;
			}
			case WalletOptionType.WALLET_CONNECT: {
				localStorage.removeItem(WalletOptionType.WALLET_CONNECT); //session info of walletconnect
				break;
			}
			default:
				break;
		}
		localStorage.removeItem('chosenWallet');
	};

	const disconnect = () => {
		const wallet = localStorage.getItem('chosenWallet');
		if (wallet) closeSession(wallet);
		onConnect();
	};

	return (
		<Overlay centered open onClose={closeOverlay}>
			<div className={`${WalletStyles.connect} border-primary`}>
				<div className={WalletStyles.header}>
					<h3 className={`glow-text-white`}>Connect To A Wallet</h3>
				</div>
				<hr className="glow" />

				{isLoading && (
					<div className={WalletStyles.Disconnect}>
						<hr className="glow" />
						<FutureButton glow onClick={() => {}}>
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									verticalAlign: 'center',
									alignItems: 'center',
								}}
							>
								<div
									style={{
										display: 'inline-block',
										width: '10%',
										margin: '0px',
										padding: '0px',
									}}
								>
									<Spinner />
								</div>
								<p
									style={{
										display: 'inline-block',
										width: '90%',
										verticalAlign: 'center',
										height: '18px',
										marginLeft: '24px',
									}}
								>
									Connecting
								</p>
							</div>
						</FutureButton>
					</div>
				)}

				{!isLoading && (
					<ul>
						<li
							onClick={() => connectToWallet(WalletOptionType.METAMASK)}
							className={getWalletOptionStyle(WalletOptionType.METAMASK)}
						>
							Metamask
							<div>
								<Image
									style={{ height: 36, width: 36 }}
									alt="metamask"
									src={metamaskIcon}
								/>
							</div>
						</li>
						<li
							onClick={() => connectToWallet(WalletOptionType.WALLET_CONNECT)}
							className={getWalletOptionStyle(WalletOptionType.WALLET_CONNECT)}
						>
							<span>Wallet Connect</span>
							<div>
								<Image alt="wallet connect" src={walletConnectIcon} />
							</div>
						</li>
						<li
							onClick={() => connectToWallet(WalletOptionType.COINBASE)}
							className={getWalletOptionStyle(WalletOptionType.COINBASE)}
						>
							<span>Coinbase Wallet</span>
							<div>
								<Image alt="coinbase wallet" src={coinbaseWalletIcon} />
							</div>
						</li>
						<li
							onClick={() => connectToWallet(WalletOptionType.FORTMATIC)}
							className={getWalletOptionStyle(WalletOptionType.FORTMATIC)}
						>
							<span>Fortmatic</span>
							<div>
								<Image alt="fortmatic" src={fortmaticIcon} />
							</div>
						</li>
						<li
							onClick={() => connectToWallet(WalletOptionType.PORTIS)}
							className={getWalletOptionStyle(WalletOptionType.PORTIS)}
						>
							<span>Portis</span>
							<div>
								<Image alt="portis" src={portisIcon} />
							</div>
						</li>
					</ul>
				)}
				{active && connector && !isLoading && (
					<div className={WalletStyles.Disconnect}>
						<hr className="glow" />
						<FutureButton glow onClick={disconnect}>
							Disconnect {nameFromConnector(connector)}
						</FutureButton>
					</div>
				)}
				<hr className="glow" />
				<div className={WalletStyles.footer}>
					<p>
						New to Ethereum?
						<br />
						<a
							rel="noreferrer"
							href="https://ethereum.org/en/wallets/"
							target="_blank"
						>
							Learn more about wallets
						</a>
					</p>
				</div>
			</div>
		</Overlay>
	);
};

export default ConnectToWallet;
