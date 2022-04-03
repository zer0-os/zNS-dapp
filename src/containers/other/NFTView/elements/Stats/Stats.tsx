//- React Imports
import React, { useState, useCallback, useEffect, useMemo } from 'react';

//- Web3 Imports
import { ethers } from 'ethers';

//- Component Imports
import { StatsWidget } from 'components';

//- Library Imports
import { toFiat } from 'lib/currency';
import { useZnsSdk } from 'lib/hooks/sdk';
import {
	DomainBidEvent,
	DomainMetrics,
	DomainMetricsCollection,
} from '@zero-tech/zns-sdk/lib/types';

//- Type Imports
import { Maybe, DisplayParentDomain } from 'lib/types';

//- Style Imports
import styles from '../../NFTView.module.scss';

//- Componennt level type definitions
type Stat = {
	fieldName: string;
	title: string;
	subTitle?: string;
	className?: string;
};

type StatsProps = {
	znsDomain: Maybe<DisplayParentDomain>;
	wildPriceUsd: number;
	bids?: DomainBidEvent[];
	isLoading: boolean;
};

export const Stats: React.FC<StatsProps> = ({
	znsDomain,
	wildPriceUsd,
	bids,
	isLoading,
}) => {
	const sdk = useZnsSdk();

	const [isDomainMetricsLoaded, setIsDomainMetricsLoaded] =
		useState<boolean>(false);
	const [domainMetrics, setDomainMetrics] = useState<
		DomainMetrics | undefined
	>();

	const fetchStats = useCallback(async () => {
		if (znsDomain) {
			try {
				const domainMetricsCollection: DomainMetricsCollection =
					await sdk.instance.getDomainMetrics([znsDomain.id]);
				console.log(domainMetricsCollection.volume);
				setDomainMetrics(domainMetricsCollection[znsDomain.id]);
				setIsDomainMetricsLoaded(true);
			} catch (e) {
				console.error(e);
			}
		}
	}, [sdk, znsDomain]);

	useEffect(() => {
		if (znsDomain) {
			fetchStats();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [znsDomain]);

	const stats: Stat[] = useMemo(() => {
		const bidsStat: Stat = {
			fieldName: 'Bids',
			title: (bids?.length || 0).toLocaleString(),
			className: 'BidsStat',
		};

		const lastSaleStat: Stat = {
			fieldName: 'Last Sale',
			title:
				(domainMetrics?.lastSale ?? 0) > 0
					? Number(
							ethers.utils.formatEther(domainMetrics!.lastSale),
					  ).toLocaleString() + ' WILD'
					: 'No sales',
			subTitle:
				(domainMetrics?.lastSale ?? 0) > 0 && wildPriceUsd > 0
					? `$${toFiat(
							Number(ethers.utils.formatEther(domainMetrics!.lastSale)) *
								wildPriceUsd,
					  )}`
					: '',
		};

		const volumeStat: Stat = {
			fieldName: 'Volume',
			title:
				(domainMetrics?.volume as any)?.all > 0
					? `${Number(
							ethers.utils.formatEther((domainMetrics?.volume as any)?.all),
					  ).toLocaleString()} WILD`
					: '0',
			subTitle:
				(domainMetrics?.volume as any)?.all > 0 && wildPriceUsd > 0
					? toFiat(
							Number(
								ethers.utils.formatEther((domainMetrics?.volume as any)?.all),
							) * wildPriceUsd,
					  )
					: '',
		};

		return [bidsStat, lastSaleStat, volumeStat];
	}, [domainMetrics, wildPriceUsd, bids]);

	return (
		<div className={styles.NFTStats}>
			{stats.map((stat: Stat, index) => (
				<div
					key={`stats-widget-${index}`}
					className={`${styles.NFTStatContainer} ${
						stat.className ? styles[stat.className] : ''
					}`}
				>
					<StatsWidget
						title={stat.title}
						fieldName={stat.fieldName}
						subTitle={stat.subTitle}
						isLoading={!isDomainMetricsLoaded || isLoading}
						className="previewView"
					></StatsWidget>
				</div>
			))}
		</div>
	);
};

export default Stats;
