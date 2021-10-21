/*
	This is a container for rendering a subdomain
	on the *current* domain.
 */

// React Imports
import React from 'react';

// Library Imports
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import BidProvider, { useBid } from './BidProvider';

// Component Imports
import SubdomainTableRow from './SubdomainTableRow';
import SubdomainTableCard from './SubdomainTableCard';
import { GenericTable, Overlay } from 'components';
import { MakeABid } from 'containers';

type SubdomainTableProps = {
	domainName: string;
	isNftView?: boolean;
	style?: React.CSSProperties;
};

const SubdomainTable = (props: SubdomainTableProps) => {
	// Domain hook data
	const { domain, loading } = useCurrentDomain();

	const { domain: biddingOn, close, bidPlaced } = useBid();

	return (
		<>
			{biddingOn !== undefined && (
				<Overlay onClose={close} open={biddingOn !== undefined}>
					<MakeABid domain={biddingOn!} onBid={bidPlaced} />
				</Overlay>
			)}
			<GenericTable
				alignments={[0, 0, 1, 1, 1, 1, 1]}
				data={domain?.subdomains}
				headers={[
					'',
					'Domain',
					'Highest Bid',
					'# of Bids',
					'Last Sale',
					'Volume',
					'',
				]}
				rowComponent={SubdomainTableRow}
				gridComponent={SubdomainTableCard}
				infiniteScroll
				isLoading={loading}
				loadingText={'Loading Subdomains'}
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
