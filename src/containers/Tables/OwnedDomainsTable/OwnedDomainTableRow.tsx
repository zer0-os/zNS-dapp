/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './OwnedDomainTableRow.module.css';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useBidProvider } from 'lib/providers/BidProvider';
import { Bid, Domain } from 'lib/types';
import { useHistory } from 'react-router-dom';
import { useBid } from '../SubdomainTable/BidProvider';
// Components
import ViewBids  from './components/ViewBids';
import { Artwork, Overlay, Spinner } from 'components';
import { MakeABid } from 'containers';

enum Modals {
	Bid,
}

const OwnedDomainTableRow = (props: any) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;
	// const { push: goTo } = useHistory();
	// const {onNavigate}= props;
	const domain = props.data;


	const { makeABid, updated } = useBid();
	// Data state
	const [biddingOn, setBiddingOn] = useState<Domain | undefined>();
	const [modal, setModal] = useState<Modals | undefined>();
	const { getBidsForDomain } = useBidProvider();
	const [bids, setBids] = useState<Bid[] | undefined>();
	const [hasUpdated, setHasUpdated] = useState<boolean>(false);
	const [areBidsLoading, setAreBidsLoading] = useState<boolean>(true);
	// const [domainToRefresh, setDomainToRefresh] = useState<string>('');

	const isOwnedByUser = account?.toLowerCase() === domain?.id.toLowerCase();

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

	// Modals
	const openBidModal = () =>{ 
		
		setModal(Modals.Bid);}
	
	
	
	const closeModal = () => setModal(undefined);

	const onBid = async () => {
		closeModal();

		// if (biddingOn) {
		// 	setDomainToRefresh(biddingOn.id);
		// 	// Need to reset this in case the user
		// 	// is bidding on the same domain twice
		// 	setTimeout(() => {
		// 		setDomainToRefresh('');
		// 	}, 1000);
		// }
	};


	//Click handlers
	const rowClick = (event: any, domain: Domain) => {
		if (event.target.className.indexOf('FutureButton') >= 0) return;
		if (props.rowClick) {
			props.rowClick(domain);
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

	const buttonClick = (domain: Domain) => {
		try {
			if (domain?.owner.id.toLowerCase() !== account?.toLowerCase()) {
				setBiddingOn(domain);
				openBidModal();
			}
		} catch (e) {
			console.error(e);
		}
	};

	/////////////////////
	// Overlay Fragment //
	/////////////////////

	const overlays = () => {
		return (
			<>
				{props.userId && (
					<Overlay
						onClose={closeModal}
						centered
						open={modal === Modals.Bid && biddingOn !== undefined}
					>
						<MakeABid domain={biddingOn!} onBid={onBid} />
					</Overlay>
				)}
			</>
		);
	};

	return (
		<>
			{overlays()}
			<tr className={styles.Row} onClick={(e)=>rowClick(e,domain)}>
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
						onClick={props.onRowClick}
						openModal={openBidModal}
						filterOwnBids={props.filterOwnBids}
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
