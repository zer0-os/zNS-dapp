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

//- Utils Imports
import { getWalletOptionStyle } from './utils';

//- Asset Imports
import metamaskIcon from './assets/metamask.svg';
import walletConnectIcon from './assets/walletconnect.svg';
import coinbaseWalletIcon from './assets/coinbasewallet.svg';
import { WALLETS } from 'constants/wallets';

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

	// return (
	// 	<div>
	// 		<button
	// 			onClick={() =>
	// 				tryActivateConnector(getConnection(ConnectionType.INJECTED).connector)
	// 			}
	// 		>
	// 			Metamask
	// 		</button>
	// 	</div>
	// );
	// const walletContext = useWeb3React();
	// const { active, connector, activate, deactivate } = walletContext;
	// const [isLoading, setIsLoading] = useState(false); //state for trigger the loading spinner
	//
	// //- Notification State
	// const { addNotification } = useNotification();
	//
	// const connectToWallet = async (wallet: string) => {
	// 	setIsLoading(true);
	// 	const c = connectorFromName(wallet) as AbstractConnector;
	//
	// 	if (c) {
	// 		//if user tries to connect metamask without provider
	// 		if (wallet === WALLETS.METAMASK && !window.ethereum) {
	// 			addNotification(
	// 				'Unable to find Metamask. Please check it is installed.',
	// 			);
	// 			setIsLoading(false);
	// 			return;
	// 		}
	//
	// 		const previousWallet = localStorage.getItem(
	// 			LOCAL_STORAGE_KEYS.CHOOSEN_WALLET,
	// 		);
	// 		if (previousWallet) await closeSession(previousWallet);
	// 		localStorage.setItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET, wallet); //sets the actual wallet key to reconnect if connected
	//
	// 		//metamask may get stuck due to eth_requestAccounts promise, if user close log in overlay
	// 		if (wallet === WALLETS.METAMASK) {
	// 			setTimeout(async () => {
	// 				const authorized = await injected.isAuthorized();
	// 				if (
	// 					!authorized &&
	// 					localStorage.getItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET) ===
	// 						WALLETS.METAMASK
	// 				)
	// 					addNotification('Cant connect?, please reload and retry');
	// 			}, 20000); //@todo: check if metamask solves this, issue #10085
	// 		}
	//
	// 		await activate(c, async (e) => {
	// 			addNotification(`Failed to connect to wallet.`);
	// 			localStorage.removeItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET);
	// 			console.error(`Encounter error while connecting to ${wallet}.`);
	// 			console.error(e);
	// 			//if page has a connection request stuck, it needs to reload to get connected again
	// 			if (
	// 				e.message === 'Already processing eth_requestAccounts. Please wait.'
	// 			)
	// 				window.location.reload();
	// 		});
	//
	// 		setIsLoading(false);
	// 		onConnect();
	// 	}
	// };
	//
	// const closeSession = (wallet: string) => {
	// 	deactivate();
	// 	//if has a wallet connected, instead of just deactivate, close connection too
	// 	switch (wallet) {
	// 		case WALLETS.COINBASE: {
	// 			walletlink.close();
	// 			break;
	// 		}
	// 		case WALLETS.PORTIS: {
	// 			portis.close();
	// 			break;
	// 		}
	// 		case WALLETS.FORTMATIC: {
	// 			fortmatic.close();
	// 			break;
	// 		}
	// 		case WALLETS.WALLET_CONNECT: {
	// 			localStorage.removeItem(WALLETS.WALLET_CONNECT); //session info of walletconnect
	// 			break;
	// 		}
	// 		default:
	// 			break;
	// 	}
	// 	localStorage.removeItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET);
	// };
	//
	// const disconnect = () => {
	// 	const wallet = localStorage.getItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET);
	// 	if (wallet) closeSession(wallet);
	// 	onConnect();
	// };
	//
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
						className={getWalletOptionStyle(WALLETS.COINBASE)}
					>
						<span>Coinbase Wallet</span>
						<div>
							<Image alt="coinbase wallet" src={coinbaseWalletIcon} />
						</div>
					</li>
					<li
						onClick={() => handleOnConnect(ConnectionType.INJECTED)}
						className={getWalletOptionStyle(WALLETS.METAMASK)}
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
						className={getWalletOptionStyle(WALLETS.WALLET_CONNECT)}
					>
						<span>Wallet Connect</span>
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
