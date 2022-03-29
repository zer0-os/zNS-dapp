import { zDAOAssets } from '@zero-tech/zdao-sdk/lib/types';
import { GenericTable } from 'components';
import AssetsTableRow from './AssetsTableRow';

type AssetsTableProps = {
	assets?: zDAOAssets;
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
	{
		label: '',
		accessor: '',
		className: '',
	},
];

const AssetsTable = ({ assets, isLoading }: AssetsTableProps) => {
	return (
		<GenericTable
			alignments={[0, 1, 1, 1, 1, 1, 1]}
			data={assets}
			itemKey={'address'}
			headers={HEADERS}
			rowComponent={AssetsTableRow}
			infiniteScroll
			isLoading={isLoading}
			loadingText={'Loading Assets'}
			notSearchable
		/>
	);
};

export default AssetsTable;
