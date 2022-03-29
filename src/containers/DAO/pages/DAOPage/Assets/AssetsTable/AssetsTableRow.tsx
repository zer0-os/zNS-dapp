// Components
import { Artwork } from 'components';

// Lib
import { formatEther } from 'ethers/lib/utils';
import { toFiat } from 'lib/currency';
import { Asset, WrappedCollectible } from 'lib/types/dao';
import millify from 'millify';
import { AssetType, Coin } from '@zero-tech/zdao-sdk/lib/types';

// Styles + assets
import classNames from 'classnames';
import styles from './AssetsTableRow.module.scss';

import defaultAssetIcon from 'assets/default_asset.png';

// Config
const MILLIFY_PRECISION = 5;
const MILLIFY_LOWERCASE = false;

/**
 * A single row item for the Assets table
 */
const AssetsTableRow = (props: any) => {
	const { data, onRowClick, className } = props;

	const asset = data as Asset;
	const typedAsset =
		asset.type === AssetType.ERC721
			? (asset as WrappedCollectible)
			: (asset as Coin);

	return (
		<tr
			className={classNames(styles.Container, className)}
			onClick={onRowClick}
		>
			{/* Asset details */}
			<td>
				<Artwork
					id={'1'}
					subtext={typedAsset.symbol}
					name={typedAsset.name}
					image={typedAsset.logoUri ?? defaultAssetIcon}
					disableAnimation
					disableInteraction={true}
				/>
			</td>

			{/* Total amount of tokens */}
			<td className={styles.Right}>
				{asset.amount
					? millify(Number(formatEther(asset.amount!)), {
							precision: MILLIFY_PRECISION,
							lowercase: MILLIFY_LOWERCASE,
					  })
					: 1}
			</td>

			{/* Fiat value of tokens */}
			<td className={styles.Right}>
				{asset.amountInUSD !== undefined
					? '$' + toFiat(asset.amountInUSD)
					: '-'}
			</td>
		</tr>
	);
};

export default AssetsTableRow;
