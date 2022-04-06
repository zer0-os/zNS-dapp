// Components
import { Image } from 'components';

// Lib
import {
	formatBigNumber,
	formatNumber,
	truncateWalletAddress,
} from 'lib/utils';
import { formatUnits } from '@ethersproject/units';
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
import erc721Icon from 'assets/erc721-default.svg';
import erc20Icon from 'assets/erc20-default.svg';
import styles from './Transactions.module.scss';
import ethIcon from './assets/gnosis-eth.png';

const DEFAULT_ICON = '';

/**
 * Converts a transaction into a HistoryItem
 * @param transaction to convert
 * @returns a history item
 */
export const toHistoryItem = (
	transaction: Transaction,
	etherscanUri: string,
) => {
	let assetString;
	let image;

	const assetType = transaction.asset.type;

	let valueString;
	if (Object.keys(transaction.asset).includes('value')) {
		const asAny = transaction.asset as any;
		const formattedValue = formatUnits(
			asAny.value as string,
			asAny.decimals ?? (18 as number),
		);
		if (Number(formattedValue) < 1) {
			valueString = formatBigNumber(formattedValue);
		} else {
			valueString = formatNumber(formattedValue);
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
				(typed.tokenSymbol ??
					typed.tokenName ??
					truncateWalletAddress(typed.tokenAddress)) + ' (NFT)';
			image = erc721Icon;
			break;
		case AssetType.ERC20:
			typed = transaction.asset as unknown as ERC20Transfer;
			assetString =
				valueString +
				' ' +
				(typed.tokenSymbol ??
					typed.tokenName ??
					truncateWalletAddress(typed.tokenAddress));
			image = erc20Icon;
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
					<b>
						<a
							target="_blank"
							rel="noreferrer"
							href={`${etherscanUri}address/${transaction.to}`}
							className="alt-link"
						>
							{truncateWalletAddress(transaction.to)}
						</a>
					</b>
				</span>
			</span>
		),
		date: transaction.created,
	};
};
