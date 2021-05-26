//- React Imports
import React from 'react';

//- Web3 Imports
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
	injected,
	walletconnect,
	walletlink,
	fortmatic,
	portis,
	network,
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

type ConnectToWalletProps = {
	onConnect: () => void;
};

const connectorFromName = (name: string) => {
	switch (name) {
		case 'metamask':
			return injected;
	}
};

const nameFromConnector = (c: AbstractConnector) => {
	switch (c) {
		case injected:
			return 'MetaMask';
	}
};

const ConnectToWallet: React.FC<ConnectToWalletProps> = ({ onConnect }) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { active, connector, activate, deactivate, error } = walletContext;

	const connectToWallet = (wallet: string) => {
		const c = connectorFromName(wallet) as AbstractConnector;
		if (c) {
			activate(c);
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
						<img src={metamaskIcon} />
					</div>
				</li>
				<li
					onClick={() => connectToWallet('walletconnect')}
					className={WalletStyles.wallet}
				>
					<span>Wallet Connect</span>
					<div>
						<img src={walletConnectIcon} />
					</div>
				</li>
				<li
					onClick={() => connectToWallet('coinbase')}
					className={WalletStyles.wallet}
				>
					<span>Coinbase Wallet</span>
					<div>
						<img src={coinbaseWalletIcon} />
					</div>
				</li>
				<li
					onClick={() => connectToWallet('fortmatic')}
					className={WalletStyles.wallet}
				>
					<span>Fortmatic</span>
					<div>
						<img src={fortmaticIcon} />
					</div>
				</li>
				<li
					onClick={() => connectToWallet('portis')}
					className={WalletStyles.wallet}
				>
					<span>Portis</span>
					<div>
						<img src={portisIcon} />
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
					<a href="https://ethereum.org/en/wallets/" target="_blank">
						Learn more about wallets
					</a>
				</p>
			</div>
		</div>
	);
};

export default ConnectToWallet;
