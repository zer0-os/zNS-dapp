/* eslint-disable react-hooks/exhaustive-deps */

//- React Imports
import React from 'react';

//- Components Imports
import { Spinner } from 'components';

//- Library Imports
import { useHistory } from 'react-router-dom';
import { BigNumber } from 'ethers';
import { Domain } from '@zero-tech/zns-sdk/lib/types';
import useBidData from 'lib/hooks/useBidData';
import { formatEther } from '@ethersproject/units';
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';
import { ethers } from 'ethers';
import { formatNumber } from 'lib/utils';

//- Styles Imports
import styles from './OwnedDomainsTableCard.module.scss';

//- Constants Imports
import { LABELS } from './OwnedDomainsTable.constants';

//- Utils Imports
import ImageCard from 'components/Cards/ImageCard/ImageCard';

type OwnedDomainsTableRowProps = {
	refetch: () => void;
	data: Domain;
	// this should be refactored when GenericTable has better typing
	[x: string]: any;
	domainsPaymentTokenInfo: any[];
};

const SubdomainTableCard = ({
	refetch,
	data: domain,
	domainsPaymentTokenInfo,
}: OwnedDomainsTableRowProps) => {
	const { push: goTo } = useHistory(); // for navigating on row click

	// Split out all the relevant data from hook
	const { bidData, isLoading: isLoadingBidData } = useBidData(domain.id);

	const highestBid = bidData?.highestBid;

	const paymentTokenInfo = domainsPaymentTokenInfo.find(
		(item) => item.id === domain.id,
	); // Retrieve Metadata
	const domainMetadata = useDomainMetadata(domain.metadataUri);

	// Bid amount wild
	const bidAmountWild = highestBid
		? `${Number(
				formatEther(BigNumber.from(highestBid.amount)),
		  ).toLocaleString()} ${paymentTokenInfo.name}`
		: '-';

	// Bid amount usd
	const bidAmountUsd =
		highestBid &&
		`$${formatNumber(
			Number(ethers.utils.formatEther(highestBid.amount)) *
				paymentTokenInfo.price,
		)}`;

	// Navigates to domain
	const onClick = (event: any) => {
		goTo(`/market/${domain.name}`);
	};

	////////////
	// Render //
	////////////

	return (
		<>
			<ImageCard
				subHeader={`0://${domain.name}`}
				imageUri={domainMetadata?.image_full ?? domainMetadata?.image}
				header={domainMetadata?.title}
				onClick={onClick}
				shouldUseCloudinary={true}
			>
				<div className={styles.Container}>
					<div className={styles.Bid}>
						{isLoadingBidData && <Spinner />}
						{!isLoadingBidData && (
							<>
								<label>{LABELS.TOP_BID}</label>
								<span className={styles.Crypto}>{bidAmountWild}</span>
								{paymentTokenInfo?.price > 0 && (
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
