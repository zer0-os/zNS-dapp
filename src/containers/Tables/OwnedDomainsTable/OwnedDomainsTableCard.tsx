/* eslint-disable react-hooks/exhaustive-deps */

//- React Imports
import React, { useMemo, useState } from 'react';

//- Components Imports
import { Overlay, Spinner } from 'components';

//- Containers Imports
import { BidList } from 'containers';
import { DomainSettings } from 'containers/other/NFTView/elements';

//- Library Imports
import { useHistory } from 'react-router-dom';
import { BigNumber } from 'ethers';
import { Domain } from '@zero-tech/zns-sdk/lib/types';
import useBidData from 'lib/hooks/useBidData';
import { formatEther } from '@ethersproject/units';
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';
import { getParentZna, getAspectRatioForZna } from 'lib/utils';
import { ethers } from 'ethers';
import { formatNumber } from 'lib/utils';

//- Styles Imports
import styles from './OwnedDomainsTableCard.module.scss';

//- Constants Imports
import { LABELS } from './OwnedDomainsTable.constants';
import { CURRENCY } from 'constants/currency';

//- Utils Imports
import ImageCard from 'components/Cards/ImageCard/ImageCard';

enum Modal {
	ViewBids,
	EditMetadata,
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

	// Split out all the relevant data from hook
	const { bidData, isLoading: isLoadingBidData } = useBidData(domain.id);
	const bids = bidData?.bids;
	const highestBid = bidData?.highestBid;

	// Retrieve Metadata
	const domainMetadata = useDomainMetadata(domain.metadataUri);

	// Decides which modal is being rendered
	const [modal, setModal] = useState<Modal | undefined>();

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
		goTo(`/market/${domain.name.split('wilder.')[1]}`);
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
		} else {
			return null;
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
				aspectRatio={getAspectRatioForZna(getParentZna(domain.name))}
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
