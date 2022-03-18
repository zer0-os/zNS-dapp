/* eslint-disable react-hooks/exhaustive-deps */
import { Artwork, OptionDropdown, Overlay, Spinner } from 'components';
import React, { useMemo, useState } from 'react';

import { BidList } from 'containers';

import { useHistory } from 'react-router-dom';
import { BigNumber } from 'ethers';
import { Domain } from '@zero-tech/zns-sdk/lib/types';

import styles from './OwnedDomainsTableRow.module.scss';
import useBidData from 'lib/hooks/useBidData';
import { formatEther } from '@ethersproject/units';

import moreIcon from './assets/more-vertical.svg';

import { ACTIONS, ACTION_KEYS } from './OwnedDomainsTable.constants';
import classNames from 'classnames';
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';
import { DomainSettings } from 'containers/other/NFTView/elements';

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

	// Navigates to domain
	const onRowClick = () => {
		goTo(`/market/${domain.name.split('wilder.')[1]}`);
	};

	const onSelectOption = (option: Option) => {
		if (option.title === ACTION_KEYS.VIEW_BIDS) {
			onViewBids();
		} else {
			setModal(Modal.EditMetadata);
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
		} else if (modal === Modal.EditMetadata) {
			return (
				<Overlay onClose={() => setModal(undefined)} open>
					<DomainSettings
						domainId={domain.id}
						onClose={() => setModal(undefined)}
					/>
				</Overlay>
			);
		} else {
			return null;
		}
		// add other modals here
	}, [modal]);

	return (
		<>
			{/* Modal */}
			{ModalElement}

			{/* Row content */}
			<tr className={styles.Container}>
				<td className={styles.Left} onClick={onRowClick}>
					<Artwork
						domain={domain.name.split('wilder.')[1]}
						disableInteraction
						metadataUrl={domain.metadataUri}
						id={domain.id}
						style={{ maxWidth: 200 }}
					/>
				</td>

				{/* Highest Bid */}
				<td className={styles.Right} onClick={onRowClick}>
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
				<td className={styles.Right} onClick={onRowClick}>
					{isLoadingBidData ? <Spinner /> : bids ? bids.length : '-'}
				</td>

				{/* Actions */}
				<td>
					<OptionDropdown
						onSelect={onSelectOption}
						options={ACTIONS}
						className={classNames(styles.MoreDropdown)}
					>
						<button className={styles.Button}>
							<img alt="more actions" src={moreIcon} />
						</button>
					</OptionDropdown>
				</td>
			</tr>
		</>
	);
};

export default React.memo(OwnedDomainsTableRow);
