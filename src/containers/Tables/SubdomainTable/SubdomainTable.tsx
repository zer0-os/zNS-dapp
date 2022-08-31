/*
	This is a container for rendering a subdomain
	on the *current* domain.
 */

// React Imports
import React, { memo } from 'react';

import { useLocation } from 'react-router-dom';

// Library Imports
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';
import { zNAFromPathname } from 'lib/utils';

// Component Imports
import SubdomainTableRow from './SubdomainTableRow';
import SubdomainTableCard from './SubdomainTableCard';
import { GenericTable } from 'components';

// Hook for data specific to this table
import useSubdomainTableData from './hooks/useSubdomainTableData';

const DEFAULT_TABLE_HEADER = 'Domain';

type SubdomainTableProps = {
	style?: React.CSSProperties;
};

const SubdomainTable = ({ style }: SubdomainTableProps) => {
	// Domain hook data
	const { domain, loading: isDomainLoading } = useCurrentDomain();

	// Get metadata and custom header
	const domainMetadata = useDomainMetadata(domain?.metadata);

	const { isLoading, data } = useSubdomainTableData(
		domain?.id,
		domain?.subdomains,
	);

	const { pathname } = useLocation();
	const zna = zNAFromPathname(pathname);
	const isNetworkRootDomain = zna.length === 0 || zna.split('.').length === 1;

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
			label: domainMetadata?.customDomainHeaderValue ?? DEFAULT_TABLE_HEADER,
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
		<GenericTable
			alignments={[0, 0, 1, 1, 1, 1, 1]}
			data={data}
			itemKey={'id'}
			headers={headers}
			rowComponent={(props: any) => <SubdomainTableRow {...props} />}
			gridComponent={(props: any) => <SubdomainTableCard {...props} />}
			infiniteScroll
			isLoading={isLoading || isDomainLoading}
			loadingText={'Loading Subdomains'}
			isGridViewByDefault={
				domainMetadata?.gridViewByDefault || isNetworkRootDomain
			}
			style={style}
		/>
	);
};

export default memo(SubdomainTable);
