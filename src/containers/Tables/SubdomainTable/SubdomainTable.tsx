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
	const [data, setData] = useState<
		| (DisplayDomain & {
				metrics: DomainMetrics;
		  })[]
		| undefined
	>();
	useAsyncEffect(async () => {
		if (domain?.subdomains) {
			setAreDomainMetricsLoading(true);
			const sudomains = domain.subdomains.map((item) => item.id);
			try {
				const tradeData = await sdk.instance.getDomainMetrics(sudomains);
				const subDomainsData = domain.subdomains.map((item) =>
					Object.assign({}, item, { metrics: tradeData[item.id] }),
				);
				setData(subDomainsData);
				setAreDomainMetricsLoading(false);
			} catch (err) {
				console.log(err);
				setAreDomainMetricsLoading(false);
			}

			// setTradeData(data);
		}
	}, [domain]);

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
				headers={[
					'',
					'Domain',
					'Highest Bid (WILD)',
					'# of Bids',
					'Last Sale (WILD)',
					'Volume (WILD)',
					'',
				]}
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
