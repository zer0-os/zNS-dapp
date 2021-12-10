import { GenericTable } from 'components';
import DepositTableRow from './DepositTableRow';

import { DEPOSIT_DATA, TABLE_HEADERS } from './DepositTable.helpers';

const DepositTable = () => {
	return (
		<GenericTable
			alignments={[0, 0, 1, 1, 1, 1, 1]}
			data={DEPOSIT_DATA}
			itemKey={'id'}
			headers={TABLE_HEADERS}
			rowComponent={DepositTableRow}
		/>
	);
};

export default DepositTable;
