import { LOCAL_STORAGE_KEYS } from 'constants/localStorage';
import WalletStyles from './Wallet.module.scss';

export const getWalletOptionStyle = (walletType: string) =>
	`${WalletStyles.wallet} ${
		localStorage.getItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET) === walletType
			? WalletStyles.Disabled
			: WalletStyles.wallet
	}`;
