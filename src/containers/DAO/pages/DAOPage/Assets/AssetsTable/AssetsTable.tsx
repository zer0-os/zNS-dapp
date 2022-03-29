import { Asset } from 'lib/types/dao';
import { GenericTable } from 'components';
import AssetsTableRow from './AssetsTableRow';

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

const AssetsTable = ({ assets, isLoading }: AssetsTableProps) => (
	<GenericTable
		alignments={[0, 1, 1, 1, 1, 1, 1]}
		data={assets}
		itemKey={'address'}
		headers={HEADERS}
		rowComponent={AssetsTableRow}
		infiniteScroll
		isLoading={isLoading}
		loadingText={'Loading Assets'}
		searchKey={'symbol'}
		searchBy={'token ticker'}
		emptyText={'This DAO has no assets'}
	/>
);

export default AssetsTable;
