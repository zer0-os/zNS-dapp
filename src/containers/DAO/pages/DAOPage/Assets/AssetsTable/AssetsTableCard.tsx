import React, { useEffect, useState } from 'react';

// Components
import { Detail } from 'components';
import ImageCard from 'components/Cards/ImageCard/ImageCard';

// Lib
import { isZnsToken } from './AssetsTable.helpers';
import { getMetadata } from 'lib/metadata';

// Styles + assets
import styles from './AssetsTableCard.module.scss';

// Types
import { AssetTableDataItem } from './AssetsTable.type';

interface AssetsTableCardProps {
	data: AssetTableDataItem;
	onRowClick: () => void;
	className: string;
}

/**
 * A single row item for the Assets table
 */
const AssetsTableCard: React.FC<AssetsTableCardProps> = ({
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
				if (isSubscribed) {
					setFetchedMetadata(d);
				}
			});
			return;
		}
		return () => {
			isSubscribed = false;
		};
	}, [metadataUrl, metadata]);

	return (
		<ImageCard
			imageUri={fetchedMetadata?.image ?? image}
			header={fetchedMetadata?.title ?? name}
			subHeader={subtext}
			onClick={onRowClick}
			className={styles.ImageCard}
			shouldUseCloudinary={isZnsToken(subtext)}
		>
			<div className={styles.Details}>
				<Detail
					className={styles.AmountInUSD}
					text={<span className={styles.Amount}>{amountInUSD}</span>}
					subtext={'Value (USD)'}
				/>
			</div>
		</ImageCard>
	);
};

export default AssetsTableCard;
