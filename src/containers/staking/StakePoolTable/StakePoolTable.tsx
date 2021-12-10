import { GenericTable } from 'components';
import StakePoolTableRow from './StakePoolTableRow';

import { POOL_DATA, TABLE_HEADERS } from './StakePoolTable.helpers';

const StakePoolTable = () => {
	return (
		<GenericTable
			alignments={[0, 0, 1, 1, 1, 1, 1]}
			data={POOL_DATA}
			itemKey={'id'}
			headers={TABLE_HEADERS}
			rowComponent={StakePoolTableRow}
		/>
	);
};

export default StakePoolTable;
