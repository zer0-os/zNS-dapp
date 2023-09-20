//- React Imports
import React from 'react';

//- Web3 Imports
import { useWeb3 } from 'lib/web3-connection/useWeb3';
import {
	ConnectionType,
	getConnection,
	tryActivateConnector,
	tryDeactivateConnector,
} from 'lib/web3-connection/wallets/connections';

//- Style Imports
import WalletStyles from './Wallet.module.scss';

//- Component Imports
import { FutureButton, Image, Spinner, Wizard } from 'components';

//- Asset Imports
import metamaskIcon from './assets/metamask.svg';
import walletConnectIcon from './assets/walletconnect.svg';
import coinbaseWalletIcon from './assets/coinbasewallet.svg';

export type ConnectToWalletProps = {
	onConnect: () => void;
};

const ConnectToWallet: React.FC<ConnectToWalletProps> = ({ onConnect }) => {
	const { isActive, isActivating, connector } = useWeb3();

	const handleOnConnect = async (connector: ConnectionType) => {
		try {
			await tryActivateConnector(getConnection(connector).connector);
			onConnect();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Wizard
			header="Connect To A Wallet"
			headerClassName={WalletStyles.Header}
			className={`${WalletStyles.connect} border-primary`}
		>
			{isActivating && (
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

			{!isActivating && (
				<ul>
					<li
						onClick={() => handleOnConnect(ConnectionType.COINBASE_WALLET)}
						className={WalletStyles.wallet}
					>
						<span>Coinbase Wallet</span>
						<div>
							<Image alt="coinbase wallet" src={coinbaseWalletIcon} />
						</div>
					</li>
					<li
						onClick={() => handleOnConnect(ConnectionType.INJECTED)}
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
						onClick={() => handleOnConnect(ConnectionType.WALLET_CONNECT)}
						className={WalletStyles.wallet}
					>
						<span>WalletConnect</span>
						<div>
							<Image alt="wallet connect" src={walletConnectIcon} />
						</div>
					</li>
				</ul>
			)}
			{isActive && connector && !isActivating && (
				<div className={WalletStyles.Disconnect}>
					<hr className="glow" />
					<FutureButton glow onClick={() => tryDeactivateConnector(connector)}>
						Disconnect
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
		</Wizard>
	);
};

export default ConnectToWallet;
