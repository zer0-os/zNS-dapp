/* eslint-disable react-hooks/exhaustive-deps */
import { Artwork, FutureButton, Overlay, Spinner } from 'components';
import React, { useMemo, useState } from 'react';

import { BidList } from 'containers';

import { useHistory } from 'react-router-dom';
import { BigNumber } from 'ethers';
import { Domain } from '@zero-tech/zns-sdk/lib/types';

import styles from './OwnedDomainsTableRow.module.scss';
import useBidData from 'lib/hooks/useBidData';
import { formatEther } from '@ethersproject/units';

enum Modal {
	ViewBids,
	EditMetadata,
}

type OwnedDomainsTableRowProps = {
	refetch: () => void;
	data: Domain;
	// this should be refactored when GenericTable has better typing
	[x: string]: any;
};

const OwnedDomainsTableRow = ({
	refetch,
	data: domain,
}: OwnedDomainsTableRowProps) => {
	const { push: goTo } = useHistory(); // for navigating on row click

	// Split out all the relevant data from hook
	const { bidData, isLoading: isLoadingBidData } = useBidData(domain.id);
	const bids = bidData?.bids;
	const highestBid = bidData?.highestBid;

	// Decides which modal is being rendered
	const [modal, setModal] = useState<Modal | undefined>();

	/**
	 * Navigates to domain on row click
	 * Makes sure the button wasn't clicked
	 * @param event automatically provided by element onClick
	 */
	const onRowClick = (event: any) => {
		const clickedButton = event.target.className.indexOf('FutureButton') >= 0;
		if (!clickedButton) {
			goTo(`/market/${domain.name.split('wilder.')[1]}`);
		}
	};

	/**
	 * Opens View Bids modal
	 * @returns void
	 */
	const onViewBids = (): void => {
		if (!bids || !bids.length) {
			return;
		}
		setModal(Modal.ViewBids);
	};

	// Defines the modal element to be rendered
	const ModalElement = useMemo(() => {
		if (modal === Modal.ViewBids && bids) {
			return (
				<Overlay onClose={() => setModal(undefined)} centered open>
					<BidList bids={bids} onAccept={refetch} />
				</Overlay>
			);
		}
		// add other modals here
	}, [modal]);

	return (
		<>
			{/* Modal */}
			{ModalElement}

			{/* Row content */}
			<tr className={styles.Container} onClick={onRowClick}>
				<td className={styles.Left}>
					<Artwork
						domain={domain.name.split('wilder.')[1]}
						disableInteraction
						metadataUrl={domain.metadataUri}
						id={domain.id}
						style={{ maxWidth: 200 }}
					/>
				</td>

				{/* Highest Bid */}
				<td className={styles.Right}>
					{isLoadingBidData ? (
						<Spinner />
					) : highestBid ? (
						Number(
							formatEther(BigNumber.from(highestBid.amount + '0')),
						).toLocaleString()
					) : (
						'-'
					)}
				</td>

				{/* Number of Bids */}
				<td className={styles.Right}>
					{isLoadingBidData ? <Spinner /> : bids ? bids.length : '-'}
				</td>

				{/* View Bids */}
				<td>
					<FutureButton
						className={styles.Button}
						glow={(bids?.length || 0) > 0}
						onClick={onViewBids}
					>
						View Bids
					</FutureButton>
				</td>
			</tr>
		</>
	);
};

export default React.memo(OwnedDomainsTableRow);
