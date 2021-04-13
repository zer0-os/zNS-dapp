import React from 'react'

import WalletStyles from './Wallet.module.css'

import metamask from "./assets/metamask.png";
import walletConnect from "./assets/wallet-connect.png"
import coinbaseWallet from "./assets/coinbase-wallet.png"
import fortmatic from "./assets/fortmatic.png"
import portis from "./assets/portis.png"

const ConnectToWallet = (props) => {

	const images = importAll(require.context('./assets', false, /\.(png|jpe?g|svg)$/));

    const connectToWallet = () => {
        props.onConnect()
    }

	return (
        <div className={`${WalletStyles.connect} blur`}>
            <div className={WalletStyles.header}>
                <h3>Connect To A Wallet</h3>
            </div>
            <ul>
        		<li onClick={connectToWallet} className={WalletStyles.wallet}>
                	<span>Metamask</span>
                	<img src={metamask} />
            	</li>
        		<li onClick={connectToWallet} className={WalletStyles.wallet}>
                	<span>Wallet Connect</span>
                	<img src={walletConnect} />
            	</li>
        		<li onClick={connectToWallet} className={WalletStyles.wallet}>
                	<span>Coinbase Wallet</span>
                	<img src={coinbaseWallet} />
            	</li>
        		<li onClick={connectToWallet} className={WalletStyles.wallet}>
                	<span>Fortmatic</span>
                	<img src={fortmatic} />
            	</li>
        		<li onClick={connectToWallet} className={WalletStyles.wallet}>
                	<span>Portis</span>
                	<img src={portis} />
            	</li>
            </ul>
            <div className={WalletStyles.footer}>
                <p>New to Ethereum?<br/><a href='https://ethereum.org/en/wallets/' target='_blank'>Learn more about wallets</a></p>
            </div>
        </div>
    )
}

function importAll(r) {
	return r.keys().map(r);
}

export default ConnectToWallet