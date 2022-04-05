import React, { useMemo } from 'react';
import { Asset } from 'lib/types/dao';
import { GenericTable } from 'components';
import AssetsTableRow from './AssetsTableRow';
import AssetsTableCard from './AssetsTableCard';
import { AssetTableDataItem } from './AssetsTable.type';
import { convertAsset } from './AssetsTable.helpers';

type AssetsTableProps = {
	assets?: Asset[];
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

const AssetsTable: React.FC<AssetsTableProps> = ({ assets, isLoading }) => {
	const tableData: AssetTableDataItem[] = useMemo(() => {
		if (!assets) return [];

		return assets.map(convertAsset);
	}, [assets]);

	return (
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
		/>
	);
};

export default AssetsTable;
