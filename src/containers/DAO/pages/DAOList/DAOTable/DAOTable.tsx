import { GenericTable } from 'components';
import DAOTableRow from './DAOTableRow';

type DAOTableProps = {
	daoZnas?: string[];
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

const DAOTable = ({ daoZnas, isLoading }: DAOTableProps) => {
	return (
		<GenericTable
			alignments={[0, 1]}
			data={daoZnas?.map((z) => ({ zna: z }))}
			itemKey={'zna'}
			headers={HEADERS}
			rowComponent={DAOTableRow}
			infiniteScroll
			isLoading={isLoading}
			loadingText={'Loading DAOs'}
			notSearchable
		/>
	);
};

export default DAOTable;
