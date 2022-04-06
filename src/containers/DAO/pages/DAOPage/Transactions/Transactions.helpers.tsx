// Components
import { Image } from 'components';

// Lib
import {
	formatBigNumber,
	formatNumber,
	truncateWalletAddress,
} from 'lib/utils';
import { formatEther, formatUnits } from '@ethersproject/units';
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
import { ArrowDownLeft, ArrowUpRight } from 'react-feather';
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

	let valueString;
	if (Object.keys(transaction.asset).includes('value')) {
		const asAny = transaction.asset as any;
		if (Number(asAny.value) < 0.01) {
			valueString = formatBigNumber(
				formatUnits(asAny.value as string, asAny.decimals ?? (18 as number)),
			);
		} else {
			valueString = formatNumber(
				formatUnits(asAny.value as string, asAny.decimals ?? (18 as number)),
			);
		}
	}

	/**
	 * Handle formatting for different asset types
	 */
	let typed;
	switch (assetType) {
		case AssetType.NATIVE_TOKEN:
			typed = transaction.asset as unknown as NativeCoinTransfer;
			assetString = valueString + ' ETH';
			image = ethIcon;
			break;
		case AssetType.ERC721:
			typed = transaction.asset as unknown as ERC721Transfer;
			assetString =
				typed.tokenSymbol ??
				typed.tokenName ??
				truncateWalletAddress(typed.tokenAddress);
			image = typed.logoUri;
			break;
		case AssetType.ERC20:
			typed = transaction.asset as unknown as ERC20Transfer;
			assetString =
				valueString +
				' ' +
				(typed.tokenSymbol ??
					typed.tokenName ??
					truncateWalletAddress(typed.tokenAddress));
			image = typed.logoUri;
			break;
	}

	const toOrFrom = transaction.type === TransactionType.SENT ? 'to' : 'from';

	return {
		event: (
			<span className={styles.Transaction}>
				{image !== undefined ? (
					<div className={styles.Icon}>
						<Image
							alt="asset icon"
							src={image}
							style={{ height: '100%', width: '100%', borderRadius: '50%' }}
						/>
						{toOrFrom === 'from' ? (
							<ArrowDownLeft className={styles.Arrow} color="#52CBFF" />
						) : (
							<ArrowUpRight className={styles.Arrow} color="#52CBFF" />
						)}
					</div>
				) : (
					<img alt="asset icon" src={DEFAULT_ICON} className={styles.Icon} />
				)}
				<span>
					{startCase(toLower(transaction.type))} <b>{assetString}</b> {toOrFrom}{' '}
					<b>{truncateWalletAddress(transaction.to)}</b>
				</span>
			</span>
		),
		date: transaction.created,
	};
};
