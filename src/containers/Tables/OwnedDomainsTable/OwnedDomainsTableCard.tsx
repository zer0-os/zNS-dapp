/* eslint-disable react-hooks/exhaustive-deps */

//- React Imports
import React, { useMemo, useState } from 'react';

//- Components Imports
import { Overlay, Spinner } from 'components';

//- Library Imports
import { useHistory } from 'react-router-dom';
import { BigNumber } from 'ethers';
import { Domain } from '@zero-tech/zns-sdk/lib/types';
import useBidData from 'lib/hooks/useBidData';
import { formatEther } from '@ethersproject/units';
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';
import { ethers } from 'ethers';
import { formatNumber, getNetworkZNA } from 'lib/utils';

//- Styles Imports
import styles from './OwnedDomainsTableCard.module.scss';

//- Constants Imports
import { ACTION_KEYS, LABELS } from './OwnedDomainsTable.constants';
import { CURRENCY } from 'constants/currency';
import { ROUTES } from 'constants/routes';

//- Utils Imports
import ImageCard from 'components/Cards/ImageCard/ImageCard';
import BidList from 'containers/lists/BidList/BidList';
import { DomainSettings } from 'containers/other/NFTView/elements';
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';
import { getActions } from './OwnedDomainsTable.utils';
import SetBuyNow from 'containers/flows/SetBuyNow';
import TransferOwnership from 'containers/flows/TransferOwnership';

enum Modal {
	ViewBids,
	EditMetadata,
	TransferOwnership,
	SetBuyNow,
}

type OwnedDomainsTableRowProps = {
	refetch: () => void;
	wildPriceUsd: number;
	data: Domain;
	// this should be refactored when GenericTable has better typing
	[x: string]: any;
};

const SubdomainTableCard = ({
	refetch,
	wildPriceUsd,
	data: domain,
}: OwnedDomainsTableRowProps) => {
	const { push: goTo } = useHistory(); // for navigating on row click

	// Decides which modal is being rendered
	const [modal, setModal] = useState<Modal | undefined>();

	// Split out all the relevant data from hook
	const { bidData, isLoading: isLoadingBidData } = useBidData(domain.id);
	const bids = bidData?.bids;
	const highestBid = bidData?.highestBid;

	const actions = getActions(bids?.length !== 0);

	// Retrieve Metadata
	const domainMetadata = useDomainMetadata(domain.metadataUri);

	// Bid amount wild
	const bidAmountWild = highestBid
		? `${Number(
				formatEther(BigNumber.from(highestBid.amount)),
		  ).toLocaleString()} ${CURRENCY.WILD}`
		: '-';

	// Bid amount usd
	const bidAmountUsd =
		highestBid &&
		`$${formatNumber(
			Number(ethers.utils.formatEther(highestBid.amount)) * wildPriceUsd,
		)}`;

	// Navigates to domain
	const onClick = (event: any) => {
		goTo(ROUTES.MARKET + '/' + getNetworkZNA(domain.name));
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

	const onSelectOption = (option: Option) => {
		if (option.title === ACTION_KEYS.VIEW_BIDS) {
			onViewBids();
		} else if (option.title === ACTION_KEYS.SETTINGS) {
			setModal(Modal.EditMetadata);
		} else if (option.title === ACTION_KEYS.TRANSFER_OWNERSHIP) {
			setModal(Modal.TransferOwnership);
		} else if (option.title === ACTION_KEYS.SET_BUY_NOW) {
			setModal(Modal.SetBuyNow);
		}
	};

	// Defines the modal element to be rendered
	const ModalElement = useMemo(() => {
		if (modal === Modal.ViewBids && bids && domainMetadata) {
			return (
				<Overlay onClose={() => setModal(undefined)} centered open>
					<BidList
						bids={bids}
						domain={domain}
						domainMetadata={domainMetadata}
						onAccept={refetch}
						isLoading={isLoadingBidData}
						highestBid={highestBid?.amount}
						isAcceptBidEnabled
					/>
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
		} else if (modal === Modal.TransferOwnership) {
			return (
				<TransferOwnership
					metadataUrl={domain.metadataUri}
					domainName={domain.name}
					domainId={domain.id}
					onTransfer={() => setModal(undefined)}
					creatorId={domain.minter}
					ownerId={domain.owner}
				/>
			);
		} else if (modal === Modal.SetBuyNow) {
			return (
				<SetBuyNow
					domainId={domain.id}
					onCancel={() => setModal(undefined)}
					onSuccess={() => setModal(undefined)}
				/>
			);
		}
	}, [modal]);

	////////////
	// Render //
	////////////

	return (
		<>
			{ModalElement}

			<ImageCard
				subHeader={`0://${domain.name}`}
				imageUri={domainMetadata?.image_full ?? domainMetadata?.image}
				header={domainMetadata?.title}
				onClick={onClick}
				onSelectOption={onSelectOption}
				actions={actions}
				shouldUseCloudinary={true}
			>
				<div className={styles.Container}>
					<div className={styles.Bid}>
						{isLoadingBidData && <Spinner />}
						{!isLoadingBidData && (
							<>
								<label>{LABELS.TOP_BID}</label>
								<span className={styles.Crypto}>{bidAmountWild}</span>
								{wildPriceUsd > 0 && (
									<span className={styles.Fiat}>{bidAmountUsd}</span>
								)}
							</>
						)}
					</div>
				</div>
			</ImageCard>
		</>
	);
};

export default React.memo(SubdomainTableCard);
