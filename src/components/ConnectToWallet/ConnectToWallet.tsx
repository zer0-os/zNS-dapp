//- React Imports
import React from 'react';

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
import { FutureButton } from 'components';

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

const connectorFromName = (name: string) => {
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

	//- Notification State
	const { addNotification } = useNotification();

	const connectToWallet = async (wallet: string) => {
		const c = connectorFromName(wallet) as AbstractConnector;
		if (c) {
			await activate(c, async (e: Error) => {
				addNotification(`Failed to connect to wallet.`);
				console.error(`Encounter error while connecting to ${wallet}.`);
				console.error(e);
			});
			onConnect();
		}
	};

	const disconnect = () => {
		deactivate();
		onConnect();
	};

	return (
		<div className={`${WalletStyles.connect} blur border-pink-glow`}>
			<div className={WalletStyles.header}>
				<h3 className={`glow-text-white`}>Connect to a wallet</h3>
			</div>
			<hr className="glow" />
			<ul>
				<li
					onClick={() => connectToWallet('metamask')}
					className={WalletStyles.wallet}
				>
					Metamask
					<div>
						<img alt="metamask" src={metamaskIcon} />
					</div>
				</li>
				<li
					onClick={() => connectToWallet('walletconnect')}
					className={WalletStyles.wallet}
				>
					<span>Wallet Connect</span>
					<div>
						<img alt="wallet connect" src={walletConnectIcon} />
					</div>
				</li>
				<li
					onClick={() => connectToWallet('coinbase')}
					className={WalletStyles.wallet}
				>
					<span>Coinbase Wallet</span>
					<div>
						<img alt="coinbase wallet" src={coinbaseWalletIcon} />
					</div>
				</li>
				<li
					onClick={() => connectToWallet('fortmatic')}
					className={WalletStyles.wallet}
				>
					<span>Fortmatic</span>
					<div>
						<img alt="fortmatic" src={fortmaticIcon} />
					</div>
				</li>
				<li
					onClick={() => connectToWallet('portis')}
					className={WalletStyles.wallet}
				>
					<span>Portis</span>
					<div>
						<img alt="portis" src={portisIcon} />
					</div>
				</li>
			</ul>
			{active && connector && (
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
