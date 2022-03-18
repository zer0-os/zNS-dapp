import { GenericTable } from 'components';
import { DAO } from '../DAOList.types';
import DAOTableRow from './DAOTableRow';

type DAOTableProps = {
	daos: DAO[];
	isLoading: boolean;
};

const HEADERS = [
	{
		label: 'DAO',
		accessor: '',
		className: '',
	},
	{
		label: 'Value (USD)',
		accessor: '',
		className: '',
	},
];

const DAOTable = ({ daos, isLoading }: DAOTableProps) => {
	const onRowClick = () => {
		console.log('hello');
	};

	return (
		<GenericTable
			alignments={[0, 1]}
			data={daos}
			itemKey={'quantity'} // need to change this
			headers={HEADERS}
			rowComponent={DAOTableRow}
			onRowClick={onRowClick}
			infiniteScroll
			isLoading={isLoading}
			loadingText={'Loading Assets'}
			notSearchable
		/>
	);
};

export default DAOTable;
