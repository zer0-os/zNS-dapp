// Components
import { Artwork } from 'components';

// Lib
import { formatUnits } from 'ethers/lib/utils';
import { toFiat } from 'lib/currency';
import { Asset } from 'lib/types/dao';
import millify from 'millify';

// Styles + assets
import classNames from 'classnames';
import styles from './AssetsTableRow.module.scss';

import defaultAssetIcon from 'assets/default_asset.png';
import { AssetType } from '@zero-tech/zdao-sdk';
import { convertAsset } from './AssetsTable.helpers';

// Config
const MILLIFY_PRECISION = 5;
const MILLIFY_LOWERCASE = false;

export type TableAsset = {
	amount: string | number;
	decimals?: number;
	image: string;
	name: string;
	subtext: string;
	type: AssetType;
};

/**
 * A single row item for the Assets table
 */
const AssetsTableRow = (props: any) => {
	const { data, onRowClick, className } = props;

	const asset = data as Asset;
	const { amount, decimals, image, name, subtext, type } = convertAsset(asset);
	const metadata = (asset as any).metadata;

	return (
		<tr
			className={classNames(styles.Container, className)}
			onClick={onRowClick}
		>
			{/* Asset details */}
			<td>
				<Artwork
					id={'1'}
					subtext={subtext}
					// handle both title and name so Wilder NFTs work
					name={name}
					image={image}
					disableAnimation
					disableInteraction={true}
				/>
			</td>

			{/* Total amount of tokens */}
			<td className={styles.Right}>
				{millify(Number(formatUnits(amount, decimals)), {
					precision: MILLIFY_PRECISION,
					lowercase: MILLIFY_LOWERCASE,
				})}
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
