/* eslint-disable react-hooks/exhaustive-deps */
import { Artwork, FutureButton, Spinner } from 'components';
import React, { useEffect, useState } from 'react';
import styles from './SubdomainTableRow.module.css';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useDomainsOwnedByUserQuery } from 'lib/hooks/zNSDomainHooks';
import { useBidProvider } from 'lib/providers/BidProvider';
import { Bid, Domain } from 'lib/types';
import { useHistory } from 'react-router-dom';
import { useBid } from '../SubdomainTable/BidProvider';
// Components 
import ViewBids from 'components/Tables/DomainTable/components/ViewBids';

enum Modals {
	Bid,
}



const OwnedDomainTableRow = (props: any) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;
	const { push: goTo } = useHistory();
    // const {onNavigate}= props;
	const domain = props.data;
    // console.log(onNavigate,'navigate');

	const { makeABid, updated } = useBid();
	// Data state
	const [biddingOn, setBiddingOn] = useState<Domain | undefined>();
	const [modal, setModal] = useState<Modals | undefined>();
	const { getBidsForDomain } = useBidProvider();
 

	const [bids, setBids] = useState<Bid[] | undefined>();
	const [hasUpdated, setHasUpdated] = useState<boolean>(false);
	const [areBidsLoading, setAreBidsLoading] = useState<boolean>(true);

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
	const openBidModal = () => setModal(Modals.Bid);
	const closeModal = () => setModal(undefined);

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

    
 
console.log(props.onRowButtonClick,'undefined');

	return (
		<tr className={styles.Row} onClick={()=>props.rowClick(domain)}>
			<td>{props.rowNumber + 1}</td>
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
					onClick={props.onRowButtonClick}
                    filterOwnBids={props.filterOwnBids}
					style={{ marginLeft: 'auto' }}

				>
					View Bids
				</ViewBids>
			</td>
		</tr>
	);
};

export default React.memo(OwnedDomainTableRow);
