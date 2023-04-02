import React, { useMemo } from 'react';
import { Asset } from 'lib/types/dao';
import { GenericTable, TextButton } from 'components';
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

			<div className={styles.Message}>
				Not all DAO assets may show in the list above
			</div>
			<TextButton className={styles.Link}>
				<a
					href={`https://etherscan.io/tokenholdings?a=${safeAddress}`}
					target="_blank"
					rel="noreferrer"
				>
					View full asset collection
				</a>
			</TextButton>
		</>
	);
};

export default AssetsTable;
