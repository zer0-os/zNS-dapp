/*
	This is a container for rendering a subdomain
	on the *current* domain.
 */

// React Imports
import React from 'react';

// Library Imports
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import BidProvider, { useBid } from './BidProvider';
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';

// Component Imports
import SubdomainTableRow from './SubdomainTableRow';
import SubdomainTableCard from './SubdomainTableCard';
import { GenericTable, Overlay } from 'components';
import { MakeABid } from 'containers';

// Hook for data specific to this table
import useSubdomainTableData from './hooks/useSubdomainTableData';

const DEFAULT_TABLE_HEADER = 'Domain';

type SubdomainTableProps = {
	style?: React.CSSProperties;
};

const SubdomainTable = ({ style }: SubdomainTableProps) => {
	// Domain hook data
	const {
		domain,
		loading: isDomainLoading,
		paymentTokenInfo,
	} = useCurrentDomain();

	// Get metadata and custom header
	const domainMetadata = useDomainMetadata(domain?.metadata);
	const domainHeader = domainMetadata?.customDomainHeader
		? domainMetadata?.customDomainHeaderValue
		: undefined;

	const { isLoading, data } = useSubdomainTableData(
		domain?.id,
		domain?.subdomains,
	);

	/*
	 * This pattern was previously used for bidirectional data
	 * between row and table, but should not be used in the future.
	 * Instead, data and callbacks should be sent directly to the row component
	 */
	const { domain: biddingOn, close, bidPlaced } = useBid();
	const isRootDomain = domain && domain?.name.split('.').length <= 2;
	const isGridViewByDefault = isRootDomain
		? true
		: domainMetadata?.gridViewByDefault;

	/*
	 * Not being stored as a constant as one of the headers depends
	 * on a value in the domain's metadata
	 */
	const headers = [
		{
			label: '',
			accessor: '',
			className: '',
		},
		{
			label: domainHeader || DEFAULT_TABLE_HEADER,
			accessor: '',
			className: 'domain',
		},
		{
			label: 'Volume (all time)',
			accessor: '',
			className: '',
		},
		{
			label: '',
			accessor: '',
			className: '',
		},
	];

	return (
		<>
			{biddingOn !== undefined && (
				<Overlay onClose={close} open={biddingOn !== undefined}>
					<MakeABid
						domain={biddingOn!}
						onBid={bidPlaced}
						onClose={close}
						paymentTokenInfo={paymentTokenInfo}
					/>
				</Overlay>
			)}
			<GenericTable
				alignments={[0, 0, 1, 1, 1, 1, 1]}
				data={data}
				itemKey={'id'}
				headers={headers}
				rowComponent={SubdomainTableRow}
				gridComponent={SubdomainTableCard}
				infiniteScroll
				isLoading={isLoading || isDomainLoading}
				loadingText={'Loading Subdomains'}
				isGridViewByDefault={isGridViewByDefault}
				style={style}
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

export default WrappedSubdomainTable;
