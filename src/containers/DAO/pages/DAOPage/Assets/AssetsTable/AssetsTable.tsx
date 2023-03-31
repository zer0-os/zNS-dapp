import React, { useMemo } from 'react';
import { Asset } from 'lib/types/dao';
import { ArrowLink, GenericTable } from 'components';
import AssetsTableRow from './AssetsTableRow';
import AssetsTableCard from './AssetsTableCard';
import { AssetTableDataItem } from './AssetsTable.type';
import { convertAsset } from './AssetsTable.helpers';

import styles from './AssetsTable.module.scss';

type AssetsTableProps = {
	assets?: Asset[];
	safeAddress?: string;
	isLoading: boolean;
};

const HEADERS = [
	{
		label: 'Asset',
		accessor: '',
		className: '',
	},
	{
		label: 'Quantity',
		accessor: '',
		className: '',
	},
	{
		label: 'Value (USD)',
		accessor: '',
		className: '',
	},
];

const AssetsTable: React.FC<AssetsTableProps> = ({
	assets,
	safeAddress,
	isLoading,
}) => {
	const tableData: AssetTableDataItem[] = useMemo(() => {
		if (!assets) return [];

		return assets.map(convertAsset);
	}, [assets]);

	return (
		<>
			<ArrowLink
				className={styles.Link}
				isLinkToExternalUrl
				href={`https://etherscan.io/address/${safeAddress}`}
			>
				View Full Asset Collection
			</ArrowLink>

			<GenericTable
				alignments={[0, 1, 1, 1, 1, 1, 1]}
				data={tableData}
				itemKey={'uuid'}
				infiniteScroll
				headers={HEADERS}
				rowComponent={AssetsTableRow}
				gridComponent={AssetsTableCard}
				isLoading={isLoading}
				loadingText={'Loading Assets'}
				searchKey={['name', 'subtext']}
				searchBy={'asset name'}
				emptyText={'This DAO has no assets.'}
				notSearchable={true}
			/>
		</>
	);
};

export default AssetsTable;
