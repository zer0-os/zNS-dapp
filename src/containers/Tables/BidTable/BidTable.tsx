//- React Imports
import { memo } from 'react';

//- Component Imports
import { GenericTable } from 'components';
import BidTableRow from './BidTableRow/BidTableRow';
import BidTableCard from './BidTableCard/BidTableCard';

//- Hooks Import
import useBidTableData from './hooks/useBidTableData';

//- Constants Imports
import { Headers, Messages } from './BidTable.constants';

const BidTable = () => {
	const { isLoading, bidData, refetch } = useBidTableData();

	return (
		<>
			<GenericTable
				alignments={[0, 1, 1, 1, 1, 0, 0]}
				data={bidData}
				headers={Headers}
				infiniteScroll
				isLoading={isLoading}
				itemKey={'id'}
				loadingText={Messages.LOADING}
				emptyText={Messages.EMPTY}
				isSingleGridColumn
				notSearchable
				rowComponent={(props: any) => (
					<BidTableRow {...props} refetch={refetch} />
				)}
				gridComponent={(props: any) => (
					<BidTableCard {...props} refetch={refetch} />
				)}
				refetch={refetch}
			/>
		</>
	);
};

export default memo(BidTable);
