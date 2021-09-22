/*
	This is a container for rendering a subdomain
	on the *current* domain.
 */

// Library Imports
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';

// Component Imports
import SubdomainTableRow from './SubdomainTableRow';
import SubdomainTableCard from './SubdomainTableCard';
import { GenericTable } from 'components';
import React from 'react';

type SubdomainTableProps = {
	domainName: string;
	style?: React.CSSProperties;
};

const SubdomainTable = (props: SubdomainTableProps) => {
	// Domain hook data
	const { domain, loading } = useCurrentDomain();

	return (
		<GenericTable
			alignments={[0, 0, 1, 1, 1]}
			data={domain?.subdomains}
			headers={['', 'Domain', 'Highest Bid', '# of Bids', '']}
			rowComponent={SubdomainTableRow}
			gridComponent={SubdomainTableCard}
			infiniteScroll
			isLoading={loading}
			loadingText={'Loading Subdomains'}
			style={props.style}
		/>
	);
};

export default React.memo(SubdomainTable);
