import React from 'react';

// Components
import { Detail } from 'components';
import ImageCard from 'components/Cards/ImageCard/ImageCard';

// Lib
import { formatTotalAmountOfTokens, isZnsToken } from './AssetsTable.helpers';

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
	const { image, name, subtext, amountInUSD } = data;

	return (
		<ImageCard
			imageUri={image}
			header={name}
			subHeader={subtext}
			onClick={onRowClick}
			className={styles.ImageCard}
			shouldUseCloudinary={isZnsToken(subtext)}
		>
			<div className={styles.Details}>
				<Detail
					className={styles.Quantity}
					text={formatTotalAmountOfTokens(data)}
					subtext={'Quantity'}
				/>
				<Detail
					className={styles.AmountInUSD}
					text={amountInUSD}
					subtext={'Value (USD)'}
				/>
			</div>
		</ImageCard>
	);
};

export default AssetsTableCard;
