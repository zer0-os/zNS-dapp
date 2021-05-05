//- React Imports
import React from 'react'

//- Web3 Imports
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { injected, walletconnect, walletlink, fortmatic, portis, network } from 'lib/connectors'
import { AbstractConnector } from '@web3-react/abstract-connector';

//- Style Imports
import WalletStyles from './Wallet.module.css'

//- Asset Imports
// import metamask from "./assets/metamask.png";
// import walletConnect from "./assets/wallet-connect.png"
// import coinbaseWallet from "./assets/coinbase-wallet.png"
// import fortmatic from "./assets/fortmatic.png"
// import portis from "./assets/portis.png"

type ConnectToWalletProps = {
	onConnect: () => void;
}

const connectorFromName = (name: string) => {
	switch(name) {
		case 'metamask':
			return injected
	}
}

const ConnectToWallet: React.FC<ConnectToWalletProps> = ({ onConnect }) => {

	const walletContext = useWeb3React<Web3Provider>()
    const { active, connector, activate, error } = walletContext

    const connectToWallet = (wallet: string) => {
		const c = connectorFromName(wallet) as AbstractConnector
		activate(c)
    }

	return (
        <div className={`${WalletStyles.connect} blur`}>
            <div className={WalletStyles.header}>
                <h3>Connect To A Wallet</h3>
            </div>
            <ul>
        		<li onClick={() => connectToWallet('metamask')} className={WalletStyles.wallet}>
                	Metamask
                	<img src={''} />
            	</li>
        		<li onClick={() => connectToWallet('walletconnect')} className={WalletStyles.wallet}>
                	<span>Wallet Connect</span>
                	<img src={''} />
            	</li>
        		<li onClick={() => connectToWallet('coinbase')} className={WalletStyles.wallet}>
                	<span>Coinbase Wallet</span>
                	<img src={''} />
            	</li>
        		<li onClick={() => connectToWallet('fortmatic')} className={WalletStyles.wallet}>
                	<span>Fortmatic</span>
                	<img src={''} />
            	</li>
        		<li onClick={() => connectToWallet('portis')} className={WalletStyles.wallet}>
                	<span>Portis</span>
                	<img src={''} />
            	</li>
            </ul>
            <div className={WalletStyles.footer}>
                <p>New to Ethereum?<br/><a href='https://ethereum.org/en/wallets/' target='_blank'>Learn more about wallets</a></p>
            </div>
        </div>
    )
}

export default ConnectToWallet