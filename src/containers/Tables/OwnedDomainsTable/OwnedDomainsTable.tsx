/*
	This is a container for rendering a subdomain
	on the *current* domain.
 */

// React Imports
import React, { useState } from 'react';

// Library Imports
import BidProvider, { useBid } from './BidProvider';
import { useWeb3React } from '@web3-react/core';
import useOwnedDomains from './hooks/useOwnedDomains';

// Component Imports
import OwnedDomainsTableRow from './OwnedDomainsTableRow';
import { GenericTable, Overlay } from 'components';

//- Containers Imports
import { AcceptBid, BidList } from 'containers';

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

	const [isAccepting, setIsAccepting] = useState<boolean>(false);

	const closeDomain = () => {
		selectDomain(undefined);
		setIsAccepting(false);
	};

	const onAccept = () => {
		setIsAccepting(true);
		console.log('accept');
	};

	return (
		<>
			{!isAccepting && (
				<Overlay onClose={closeDomain} centered open>
					<AcceptBid
						onClose={closeDomain}
						bid={undefined}
						bidData={undefined}
						refetch={undefined}
						isLoading={undefined}
						assetUrl={''}
						creatorId={''}
						domainName={''}
						domainId={''}
						walletAddress={''}
						highestBid={''}
						wildPriceUsd={''}
					/>
				</Overlay>
			)}
			{selectedDomain !== undefined && (
				<Overlay onClose={closeDomain} centered open>
					<BidList bids={selectedDomain.bids} onAccept={onAccept} />
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
