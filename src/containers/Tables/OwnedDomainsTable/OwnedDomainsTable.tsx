// Library Imports
import { useWeb3React } from '@web3-react/core';
import useOwnedDomains from './hooks/useOwnedDomains';
import useCurrency from 'lib/hooks/useCurrency';

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
	const { account } = useWeb3React();
	const { isLoading, ownedDomains, refetch } = useOwnedDomains(account);
	const { wildPriceUsd } = useCurrency();

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
				<OwnedDomainsTableCard
					{...props}
					refetch={refetch}
					wildPriceUsd={wildPriceUsd}
				/>
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
