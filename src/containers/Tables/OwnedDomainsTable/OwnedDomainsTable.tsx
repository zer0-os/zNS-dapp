// Library Imports
import { useWeb3 } from 'lib/web3-connection/useWeb3';
import useOwnedDomains from 'lib/hooks/useOwnedDomains';

// Component Imports
import OwnedDomainsTableRow from './OwnedDomainsTableRow';
import { GenericTable } from 'components';
import OwnedDomainsTableCard from './OwnedDomainsTableCard';

//- Utils Imports
import { filterOwnedDomainsByNetwork } from './OwnedDomainsTable.utils';

// Contants Imports
import { HEADERS, MESSAGES } from './OwnedDomainsTable.constants';

const OwnedDomainsTable = () => {
	///////////
	//  Data //
	///////////
	const { account } = useWeb3();
	const { isLoading, ownedDomains, refetch } = useOwnedDomains(account);

	// filter owned domains by network
	const onNetworkOwnedDomains = filterOwnedDomainsByNetwork(ownedDomains);

	return (
		<GenericTable
			alignments={[0, 1, 1, 1]}
			data={onNetworkOwnedDomains}
			itemKey={'id'}
			headers={HEADERS}
			rowComponent={(props: any) => (
				<OwnedDomainsTableRow {...props} refetch={refetch} />
			)}
			gridComponent={(props: any) => (
				<OwnedDomainsTableCard {...props} refetch={refetch} />
			)}
			infiniteScroll
			isLoading={isLoading}
			loadingText={MESSAGES.LOADING}
			emptyText={'You do not own any domains.'}
			isGridViewByDefault
		/>
	);
};

export default OwnedDomainsTable;
