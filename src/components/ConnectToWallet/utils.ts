//- Style Imports
import WalletStyles from './Wallet.module.scss';

export enum WalletOptionType {
	METAMASK = 'metamask',
	COINBASE = 'coinbase',
	WALLET_CONNECT = 'walletconnect',
	FORTMATIC = 'fortmatic',
	PORTIS = 'portis',
}

export const getWalletOptionStyle = (walletType: string) =>
	`${WalletStyles.wallet} ${
		localStorage.getItem('chosenWallet') === walletType
			? WalletStyles.Disabled
			: WalletStyles.wallet
	}`;
