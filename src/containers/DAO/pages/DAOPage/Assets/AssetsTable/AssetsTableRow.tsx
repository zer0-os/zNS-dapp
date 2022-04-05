import React from 'react';

// Components
import { Artwork } from 'components';

// Lib
import { formatTotalAmountOfTokens } from './AssetsTable.helpers';

// Styles + assets
import classNames from 'classnames';
import styles from './AssetsTableRow.module.scss';

// Types
import { AssetTableDataItem } from './AssetsTable.type';

interface AssetsTableRowProps {
	data: AssetTableDataItem;
	onRowClick: () => void;
	className: string;
}

/**
 * A single row item for the Assets table
 */
const AssetsTableRow: React.FC<AssetsTableRowProps> = ({
	data,
	onRowClick,
	className,
}) => {
	const { image, name, subtext, amountInUSD } = data;

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
			<td className={styles.Right}>{formatTotalAmountOfTokens(data)}</td>

			{/* Fiat value of tokens */}
			<td className={styles.Right}>{amountInUSD}</td>
		</tr>
	);
};

export default AssetsTableRow;
