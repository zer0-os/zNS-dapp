/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './OwnedDomainTableRow.module.css';
import { useBidProvider } from 'lib/providers/BidProvider';
import { Bid, Domain } from 'lib/types';

import { useBid } from '../SubdomainTable/BidProvider';
import { useTableProvider } from './OwnedDomainTableProvider';
// Components
import ViewBids from './components/ViewBids';
import { Artwork, Spinner } from 'components';



const OwnedDomainTableRow = (props: any) => {
	const domain = props.data;
	const { updated } = useBid();
	const {rowClick, viewBid, filterOwnBids} = useTableProvider()
	// Data state
	const { getBidsForDomain } = useBidProvider();
	const [bids, setBids] = useState<Bid[] | undefined>();
	const [hasUpdated, setHasUpdated] = useState<boolean>(false);
	const [areBidsLoading, setAreBidsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (updated && updated.id === domain.id) {
			setHasUpdated(!hasUpdated);
		}
	}, [updated]);

	useEffect(() => {
		let isMounted = true;
		const get = async () => {
			setBids(undefined);
			setAreBidsLoading(true);
			const b = await getBidsForDomain(domain);
			if (isMounted) {
				setAreBidsLoading(false);
				setBids(b);
			}
		};
		get();
		return () => {
			isMounted = false;
		};
	}, [domain, hasUpdated]);

	//Click handlers
	const click = (event: any, domain: Domain) => {
		if (event.target.className.indexOf('FutureButton') >= 0) return;
		if (rowClick) {
			rowClick(domain);
			return;
		}
	};

	const bidColumns = () => {
		if (!areBidsLoading) {
			return (
				<>
					<td className={styles.Right}>
						{!bids && 'Failed to retrieve'}
						{bids &&
							(bids[0] ? bids[0].amount.toLocaleString() + ' WILD' : '-')}
					</td>
					<td className={styles.Right}>
						{!bids && 'Failed to retrieve'}
						{bids && bids.length.toLocaleString()}
					</td>
				</>
			);
		} else {
			return (
				<>
					<td className={styles.Right}>
						<Spinner />
					</td>
					<td className={styles.Right}>
						<Spinner />
					</td>
				</>
			);
		}
	};

	/////////////////////
	// Overlay Fragment //
	/////////////////////

	return (
		<>
			<tr className={styles.Row} onClick={(e) => click(e, domain)}>
				<td className={styles.RowNumber}>{props.rowNumber + 1}</td>
				<td>
					<Artwork
						domain={domain.name.split('wilder.')[1]}
						disableInteraction
						metadataUrl={domain.metadata}
						id={domain.id}
						style={{ maxWidth: 200 }}
					/>
				</td>
				{bidColumns()}
				<td>
					<ViewBids
						domain={domain}
						onClick={viewBid}
						filterOwnBids={filterOwnBids}
						style={{ marginLeft: 'auto' }}
					>
						View Bids
					</ViewBids>
				</td>
			</tr>
		</>
	);
};

export default React.memo(OwnedDomainTableRow);
