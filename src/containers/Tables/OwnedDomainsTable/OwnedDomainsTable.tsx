/*
	This is a container for rendering a subdomain
	on the *current* domain.
 */

// React Imports
import React from 'react';

// Library Imports
import BidProvider, { useBid } from './BidProvider';

// Component Imports
import OwnedDomainsTableRow from './OwnedDomainsTableRow';
import { GenericTable, Overlay } from 'components';
import { BidList } from 'containers';
import { useWeb3React } from '@web3-react/core';
import useOwnedDomains from './hooks/useOwnedDomains';

type SubdomainTableProps = {
	isNftView?: boolean;
	style?: React.CSSProperties;
};

const HEADERS = [
	{
		label: 'Domain',
		accessor: '',
		className: 'domain',
	},
	{
		label: 'Top Bid (WILD)',
		accessor: '',
		className: '',
	},
	{
		label: 'Bids',
		accessor: '',
		className: '',
	},
	{
		label: '',
		accessor: '',
		className: '',
	},
];

const SubdomainTable = (props: SubdomainTableProps) => {
	const { account } = useWeb3React();

	const { isLoading, ownedDomains } = useOwnedDomains(account);
	const { selectedDomain, selectDomain } = useBid();

	const closeDomain = () => selectDomain(undefined);

	const onAccept = () => {
		console.log('accept');
	};

	return (
		<>
			{selectedDomain !== undefined && (
				<Overlay onClose={closeDomain} centered open>
					<BidList
						bids={selectedDomain.bids}
						onAccept={onAccept}
						isAccepting={false}
					/>
				</Overlay>
			)}
			<GenericTable
				alignments={[0, 1, 1, 1]}
				data={ownedDomains}
				itemKey={'id'}
				headers={HEADERS}
				rowComponent={OwnedDomainsTableRow}
				infiniteScroll
				isLoading={isLoading}
				loadingText={'Loading Owned Domains'}
			/>
		</>
	);
};

const WrappedSubdomainTable = (props: SubdomainTableProps) => {
	return (
		<BidProvider>
			<SubdomainTable {...props} />
		</BidProvider>
	);
};

export default React.memo(WrappedSubdomainTable);
