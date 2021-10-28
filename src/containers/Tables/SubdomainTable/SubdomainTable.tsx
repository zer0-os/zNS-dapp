/*
	This is a container for rendering a subdomain
	on the *current* domain.
 */

// React Imports
import React, { useState } from 'react';

// Library Imports
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import { useAsyncEffect } from 'use-async-effect';
import BidProvider, { useBid } from './BidProvider';

// Component Imports
import SubdomainTableRow from './SubdomainTableRow';
import SubdomainTableCard from './SubdomainTableCard';
import { GenericTable, Overlay } from 'components';
import { MakeABid } from 'containers';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { DisplayDomain } from 'lib/types';
import { DomainMetrics } from '@zero-tech/zns-sdk';

type SubdomainTableProps = {
	domainName: string;
	isNftView?: boolean;
	style?: React.CSSProperties;
};

const SubdomainTable = (props: SubdomainTableProps) => {
	const sdk = useZnsSdk();

	// Domain hook data
	const { domain, loading } = useCurrentDomain();

	const { domain: biddingOn, close, bidPlaced } = useBid();

	const [areDomainMetricsLoading, setAreDomainMetricsLoading] = useState(false);
	const [loadingDomain, setLoadingDomain] = useState<string | undefined>();
	const [data, setData] = useState<
		| (DisplayDomain & {
				metrics: DomainMetrics;
		  })[]
		| undefined
	>();

	useAsyncEffect(async () => {
		let isMounted = true;
		setData(undefined);
		if (domain?.subdomains) {
			setAreDomainMetricsLoading(true);
			setLoadingDomain(domain.name);
			const sudomains = domain.subdomains.map((item) => item.id);
			try {
				const tradeData = await sdk.instance.getDomainMetrics(sudomains);
				const subDomainsData = domain.subdomains.map((item) =>
					Object.assign({}, item, { metrics: tradeData[item.id] }),
				);
				if (isMounted && (!loadingDomain || loadingDomain === domain.name)) {
					setData(subDomainsData);
				}
			} catch (err) {
				console.error(err);
			}

			if (isMounted) {
				setAreDomainMetricsLoading(false);
			}
		} else {
			setData([]);
			setLoadingDomain(domain?.name);
		}

		return () => {
			isMounted = false;
		};
	}, [domain]);

	const headers = [
		{
			label: '',
			accessor: '',
			className: '',
		},
		{
			label: 'Domain',
			accessor: '',
			className: 'domain',
		},
		{
			label: 'Highest Bid (WILD)',
			accessor: '',
			className: '',
		},
		{
			label: '# of Bids',
			accessor: '',
			className: '',
		},
		{
			label: 'Last Sale (WILD)',
			accessor: '',
			className: 'lastSale',
		},
		{
			label: 'Volume (WILD)',
			accessor: '',
			className: 'volume',
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
					<MakeABid domain={biddingOn!} onBid={bidPlaced} />
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
				isLoading={loading || areDomainMetricsLoading}
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
