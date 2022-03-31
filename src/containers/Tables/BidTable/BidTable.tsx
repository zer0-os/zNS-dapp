import BidTableRow, { BidTableRowData } from './BidTableRow';
import { GenericTable } from 'components';

type BidTableProps = {
	bidData?: BidTableRowData[];
	isLoading: boolean;
	refetch: () => void;
};

export const HEADERS = [
	{
		label: 'Domain',
		accessor: '',
		className: 'domain',
	},
	{
		label: 'Date',
		accessor: '',
		className: '',
	},
	{
		label: 'Your Bid',
		accessor: '',
		className: '',
	},
	{
		label: 'Highest Bid',
		accessor: '',
		className: 'lastSale',
	},
	{
		label: 'State',
		accessor: '',
		className: 'volume',
	},
	{
		label: '',
		accessor: '',
		className: '',
	},
];

const BidTable = ({ bidData, isLoading, refetch }: BidTableProps) => {
	return (
		<GenericTable
			alignments={[0, 1, 1, 1, 1, 0, 0]}
			data={bidData}
			headers={HEADERS}
			infiniteScroll
			isLoading={isLoading}
			itemKey={'id'}
			loadingText={'Loading Your Bids'}
			notSearchable
			rowComponent={(props: any) => (
				<BidTableRow {...props} onRefetch={refetch} />
			)}
		/>
	);
};

export default BidTable;
