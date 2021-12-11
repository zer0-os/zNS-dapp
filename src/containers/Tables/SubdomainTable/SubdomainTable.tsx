/*
	This is a container for rendering a subdomain
	on the *current* domain.
 */

// React Imports
import React, { useRef, useState } from 'react';

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
import { DomainMetrics } from '@zero-tech/zns-sdk/lib/types';

type SubdomainTableProps = {
	domainName: string;
	isNftView?: boolean;
	style?: React.CSSProperties;
};

const SubdomainTable = (props: SubdomainTableProps) => {
	const sdk = useZnsSdk();

	const d = useRef<string | undefined>();

	// Domain hook data
	const { domain, loading } = useCurrentDomain();

	const { domain: biddingOn, close, bidPlaced } = useBid();

	const [areDomainMetricsLoading, setAreDomainMetricsLoading] = useState(false);
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
			d.current = domain.name;
			const subdomains = domain.subdomains.map((item) => item.id);

			var i;
			var j;
			var temporary: string[] = [];
			const chunk = 900;
			const promises = [];
			for (i = 0, j = subdomains.length; i < j; i += chunk) {
				temporary = subdomains.slice(i, i + chunk);
				promises.push(
					// eslint-disable-next-line no-loop-func
					new Promise((resolve, reject) => {
						try {
							sdk.instance.getDomainMetrics(temporary).then((d) => {
								resolve(d);
							});
						} catch {
							reject();
						}
					}),
				);
			}

			try {
				var tradeData: any = {}; // @todo fix any
				try {
					const rawData = (await Promise.all(promises)) as any[];
					for (var m = 0; m < rawData.length; m++) {
						tradeData = { ...tradeData, ...rawData[m] };
					}
				} catch (e) {
					console.error(e);
				}
				const subDomainsData = domain.subdomains.map((item) =>
					Object.assign({}, item, { metrics: tradeData[item.id] }),
				);
				if (isMounted && (!d.current || d.current === domain.name)) {
					setData(subDomainsData);
					setAreDomainMetricsLoading(false);
				} else {
					console.warn(
						`Detected a domain change while loading ${domain.name} - unloaded data`,
					);
				}
			} catch (err) {
				console.error(err);
			}
		} else {
			setData([]);
			d.current = domain?.name;
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
