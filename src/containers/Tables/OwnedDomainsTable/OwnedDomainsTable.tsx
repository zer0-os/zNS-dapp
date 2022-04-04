// Library Imports
import { useWeb3React } from '@web3-react/core';
import useOwnedDomains from './hooks/useOwnedDomains';

// Component Imports
import OwnedDomainsTableRow from './OwnedDomainsTableRow';
import { GenericTable } from 'components';

import { HEADERS, MESSAGES } from './OwnedDomainsTable.constants';

const OwnedDomainsTable = () => {
	const { account } = useWeb3React();
	const { isLoading, ownedDomains, refetch } = useOwnedDomains(account);

	return (
		<GenericTable
			alignments={[0, 1, 1, 1]}
			data={ownedDomains}
			itemKey={'id'}
			headers={HEADERS}
			rowComponent={(props: any) => (
				<OwnedDomainsTableRow {...props} refetch={refetch} />
			)}
			infiniteScroll
			isLoading={isLoading}
			loadingText={MESSAGES.LOADING}
			emptyText={'You do not own any domains.'}
		/>
	);
};

export default OwnedDomainsTable;
