import React, { memo, useEffect, useState } from 'react';

// Components
import { Artwork } from 'components';

// Lib
import { formatTotalAmountOfTokens, isZnsToken } from './AssetsTable.helpers';
import { getMetadata } from 'lib/metadata';

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
	const { image, name, subtext, amountInUSD, metadata, metadataUrl } = data;

	const [fetchedMetadata, setFetchedMetadata] = useState<any | undefined>();

	/**
	 * Get metadata for collectibles whose metadata failed to load
	 * properly (from Gnosis Safe API)
	 */
	useEffect(() => {
		let isSubscribed = true;
		setFetchedMetadata(undefined);
		if (metadataUrl && Object.keys(metadata).length === 0) {
			getMetadata(metadataUrl).then((d) => {
				setTimeout(() => {
					if (isSubscribed) {
						setFetchedMetadata(d);
					}
				}, 1200);
			});
			return;
		}
		return () => {
			isSubscribed = false;
		};
	}, [metadataUrl, metadata]);

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
					name={fetchedMetadata?.title ?? name}
					image={fetchedMetadata?.image ?? image}
					disableAnimation
					disableInteraction={true}
					shouldUseCloudinary={isZnsToken(subtext)}
				/>
			</td>

			{/* Total amount of tokens */}
			<td className={styles.Right}>{formatTotalAmountOfTokens(data)}</td>

			{/* Fiat value of tokens */}
			<td className={styles.Right}>{amountInUSD}</td>
		</tr>
	);
};

export default memo(AssetsTableRow);
