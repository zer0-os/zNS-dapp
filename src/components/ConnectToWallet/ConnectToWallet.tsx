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
import WalletStyles from './Wallet.module.css';

//- Component Imports
import { FutureButton, Spinner,  Image  } from 'components';

//- Asset Imports
import metamaskIcon from './assets/metamask.svg';
import walletConnectIcon from './assets/walletconnect.svg';
import coinbaseWalletIcon from './assets/coinbasewallet.svg';
import fortmaticIcon from './assets/fortmatic.svg';
import portisIcon from './assets/portis.svg';
import useNotification from 'lib/hooks/useNotification';

type ConnectToWalletProps = {
	onConnect: () => void;
};

const nameToConnector: { [key: string]: AbstractConnector } = {
	metamask: injected,
	coinbase: walletlink,
	fortmatic: fortmatic,
	portis: portis,
};

export const connectorFromName = (name: string) => {
	if (name === 'walletconnect') {
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

const ConnectToWallet: React.FC<ConnectToWalletProps> = ({ onConnect }) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { active, connector, activate, deactivate } = walletContext;
	const [isLoading, setIsLoading] = useState(false); //state for trigger the loading spinner

	//- Notification State
	const { addNotification } = useNotification();

	const connectToWallet = async (wallet: string) => {
		setIsLoading(true);
		const c = connectorFromName(wallet) as AbstractConnector;

		if (c) {
			const previousWallet = localStorage.getItem('chosenWallet');
			if (previousWallet) await closeSession(previousWallet);
			localStorage.setItem('chosenWallet', wallet); //sets the actual wallet key to connect

			await activate(c, async (e: Error) => {
				addNotification(`Failed to connect to wallet.`);
				localStorage.removeItem('chosenWallet');
				console.error(`Encounter error while connecting to ${wallet}.`);
				console.error(e);
			});
			setIsLoading(false);
			onConnect();
		}
	};

	const closeSession = (wallet: string) => {
		deactivate();
		//if has a wallet connected, instead of just deactivate, close connection too
		switch (wallet) {
			case 'coinbase': {
				walletlink.close();
				break;
			}
			case 'portis': {
				portis.close();
				break;
			}
			case 'fortmatic': {
				fortmatic.close();
				break;
			}
			case 'walletconnect': {
				localStorage.removeItem('walletconnect'); //session info of walletconnect
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
		<div className={`${WalletStyles.connect} border-primary`}>
			<div className={WalletStyles.header}>
				<h3 className={`glow-text-white`}>Connect to a wallet</h3>
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
								paddingBottom: '5px',
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
				onClick={() => connectToWallet('metamask')}
				className={WalletStyles.wallet}
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
				onClick={() => connectToWallet('walletconnect')}
				className={WalletStyles.wallet}
			>
				<span>Wallet Connect</span>
				<div>
					<Image alt="wallet connect" src={walletConnectIcon} />
				</div>
			</li>
			<li
				onClick={() => connectToWallet('coinbase')}
				className={WalletStyles.wallet}
			>
				<span>Coinbase Wallet</span>
				<div>
					<Image alt="coinbase wallet" src={coinbaseWalletIcon} />
				</div>
			</li>
			<li
				onClick={() => connectToWallet('fortmatic')}
				className={WalletStyles.wallet}
			>
				<span>Fortmatic</span>
				<div>
					<Image alt="fortmatic" src={fortmaticIcon} />
				</div>
			</li>
			<li
				onClick={() => connectToWallet('portis')}
				className={WalletStyles.wallet}
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
	);
};

export default ConnectToWallet;