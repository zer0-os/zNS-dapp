// Components
import { Artwork } from 'components';

// Lib
import { formatEther } from 'ethers/lib/utils';
import { toFiat } from 'lib/currency';
import { zDAOAssets } from '@zero-tech/zdao-sdk/lib/types';
import millify from 'millify';

// Styles + assets
import classNames from 'classnames';
import styles from './AssetsTableRow.module.scss';
import openIcon from 'assets/open-external-url.svg';

// Config
const MILLIFY_PRECISION = 5;
const MILLIFY_LOWERCASE = false;

/**
 * A single row item for the Assets table
 */
const AssetsTableRow = (props: any) => {
	const { data, onRowClick, className } = props;
	const asset = data as zDAOAssets;

	return <></>;

	// return (
	// 	<tr
	// 		className={classNames(styles.Container, className)}
	// 		onClick={onRowClick}
	// 	>
	// 		{/* Asset details */}
	// 		<td>
	// 			<Artwork
	// 				id={'1'}
	// 				domain={asset.symbol}
	// 				name={asset.name}
	// 				image={asset.logoUri}
	// 				disableAnimation
	// 			/>
	// 		</td>

	// 		{/* Total amount of tokens */}
	// 		<td className={styles.Right}>
	// 			{millify(Number(formatEther(asset.amount)), {
	// 				precision: MILLIFY_PRECISION,
	// 				lowercase: MILLIFY_LOWERCASE,
	// 			})}
	// 		</td>

	// 		{/* Fiat value of tokens */}
	// 		<td className={styles.Right}>{'$' + toFiat(asset.amountInUSD)}</td>

	// 		{/* Action icon */}
	// 		<td className={classNames(styles.Right, styles.Action)}>
	// 			<img
	// 				alt="open icon"
	// 				className={styles.Close}
	// 				src={openIcon}
	// 				style={{ height: 32, width: 32, padding: 6 }}
	// 			/>
	// 		</td>
	// 	</tr>
	// );
};

export default AssetsTableRow;
