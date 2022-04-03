import React, { useMemo } from 'react';
import { Asset } from 'lib/types/dao';
import { GenericTable } from 'components';
import AssetsTableRow, { TableAsset } from './AssetsTableRow';
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

const AssetsTable = ({ assets, isLoading }: AssetsTableProps) => {
	const tableData: TableAsset[] = useMemo(() => {
		if (!assets) return [];

		return assets.map(convertAsset);
	}, [assets]);

	return (
		<GenericTable
			alignments={[0, 1, 1, 1, 1, 1, 1]}
			data={tableData}
			itemKey={'key'}
			headers={HEADERS}
			rowComponent={AssetsTableRow}
			isLoading={isLoading}
			loadingText={'Loading Assets'}
			searchKey={['name', 'subtext']}
			searchBy={'token ticker'}
			emptyText={'This DAO has no assets'}
		/>
	);
};

export default AssetsTable;
