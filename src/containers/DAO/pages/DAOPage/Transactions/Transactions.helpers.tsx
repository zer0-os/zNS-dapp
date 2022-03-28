// Components
import { Image } from 'components';

// Lib
import { truncateAddress } from 'lib/utils';
import { formatEther } from '@ethersproject/units';
import { startCase, toLower } from 'lodash';
import {
	AssetType,
	ERC20Transfer,
	ERC721Transfer,
	NativeCoinTransfer,
	Transaction,
	TransactionType,
} from '@zero-tech/zdao-sdk';

// Styles
import styles from './Transactions.module.scss';
import ethIcon from './assets/gnosis-eth.png';

const DEFAULT_ICON = '';

/**
 * Converts a transaction into a HistoryItem
 * @param transaction to convert
 * @returns a history item
 */
export const toHistoryItem = (transaction: Transaction) => {
	let assetString;
	let image;

	const assetType = transaction.asset.type;

	/**
	 * Handle formatting for different asset types
	 */
	let typed;
	switch (assetType) {
		case AssetType.NATIVE_TOKEN:
			typed = transaction.asset as unknown as NativeCoinTransfer;
			assetString = formatEther(typed.value) + ' ETH';
			image = ethIcon;
			break;
		case AssetType.ERC721:
			typed = transaction.asset as unknown as ERC721Transfer;
			assetString =
				typed.tokenSymbol ??
				typed.tokenName ??
				truncateAddress(typed.tokenAddress);
			image = typed.logoUri;
			break;
		case AssetType.ERC20:
			typed = transaction.asset as unknown as ERC20Transfer;
			assetString =
				formatEther(typed.value) +
				' ' +
				(typed.tokenSymbol ??
					typed.tokenName ??
					truncateAddress(typed.tokenAddress));
			image = typed.logoUri;
			break;
	}

	const toOrFrom = transaction.type === TransactionType.SENT ? 'to' : 'from';

	return {
		event: (
			<span className={styles.Transaction}>
				{image !== undefined ? (
					<Image
						alt="asset icon"
						src={image}
						style={{ height: 32, width: 32 }}
						className={styles.Icon}
					/>
				) : (
					<img alt="asset icon" src={DEFAULT_ICON} className={styles.Icon} />
				)}
				<span>
					{startCase(toLower(transaction.type))} <b>{assetString}</b> {toOrFrom}{' '}
					<b>{truncateAddress(transaction.to)}</b>
				</span>
			</span>
		),
		date: transaction.created,
	};
};
