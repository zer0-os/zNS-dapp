import { GenericTable } from 'components';
import AssetsTableRow from './AssetsTableRow';

type AssetsTableProps = {
	assets?: any[];
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
	const onRowClick = () => {
		console.log('yeah');
	};

	return (
		<GenericTable
			alignments={[0, 1, 1, 1, 1, 1, 1]}
			data={assets}
			itemKey={'quantity'} // need to change this
			headers={HEADERS}
			rowComponent={AssetsTableRow}
			onRowClick={onRowClick}
			infiniteScroll
			isLoading={isLoading}
			loadingText={'Loading Assets'}
			notSearchable
		/>
	);
};

export default AssetsTable;
