// Components
import { Artwork } from 'components';

// Lib
import { formatUnits } from 'ethers/lib/utils';
import millify from 'millify';

// Styles + assets
import classNames from 'classnames';
import styles from './AssetsTableRow.module.scss';

// Config
const MILLIFY_PRECISION = 5;
const MILLIFY_LOWERCASE = false;

export type TableAsset = {
	amount: string | number;
	decimals?: number;
	image: string;
	key: string;
	name: string;
	subtext: string;
	amountInUSD: string;
};

/**
 * A single row item for the Assets table
 */
const AssetsTableRow = (props: any) => {
	const { data, onRowClick, className } = props;

	const { amount, decimals, image, name, subtext, amountInUSD } =
		data as TableAsset;

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
			<td className={styles.Right}>{amountInUSD}</td>
		</tr>
	);
};

export default AssetsTableRow;
