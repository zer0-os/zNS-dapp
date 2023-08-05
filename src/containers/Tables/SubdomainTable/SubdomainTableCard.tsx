/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

//-Library Imports
import { useWeb3 } from 'lib/web3-connection/useWeb3';
import {
	ConvertedTokenInfo,
	DomainMetrics,
} from '@zero-tech/zns-sdk/lib/types';
import { ethers } from 'ethers';
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';
import useSubdomainData from './hooks/useSubdomainData';
import {
	formatEthers,
	formatNumber,
	getAspectRatioForZna,
	getNetworkZNA,
	getParentZna,
} from 'lib/utils';

//-Component Imports
import { ImageCard, Overlay, Spinner } from 'components';

//-Containers Imports
import { BidButton, BuyNowButton, MakeABid } from 'containers';

//-Constants Imports
import { LABELS, Modal } from './SubdomainTableCard.constants';
import { ROUTES } from 'constants/routes';

//-Styles Imports
import styles from './SubdomainTableCard.module.scss';

const SubdomainTableCard = (props: any) => {
	//////////////////
	// State & Data //
	//////////////////

	const walletContext = useWeb3();
	const { account } = walletContext;
	const { push: goTo } = useHistory();

	const [modal, setModal] = useState<Modal | undefined>();

	const domain = props.data;
	const paymentTokenInfo: ConvertedTokenInfo = props.data.paymentTokenInfo;
	const tradeData: DomainMetrics = domain?.metrics;
	const domainMetadata = useDomainMetadata(domain?.metadata);
	const isRootDomain = domain.name.split('.').length <= 2;
	const isBiddable =
		isRootDomain || Boolean(domainMetadata?.isBiddable ?? true);

	const isOwnedByUser =
		account?.toLowerCase() === domain?.owner?.id.toLowerCase();

	///////////////
	// Functions //
	///////////////

	const {
		isLoading: isLoadingSubdomain,
		buyNowPrice,
		refetch,
	} = useSubdomainData(domain.id);

	const onButtonClick = (event: any) => {
		if (account !== undefined && !isOwnedByUser && isBiddable) {
			setModal(Modal.MAKE_A_BID);
		}
	};

	const onClick = (event: any) => {
		if (!event.target.className.includes('FutureButton')) {
			goTo(ROUTES.MARKET + '/' + getNetworkZNA(domain.name));
		}
	};

	////////////
	// Render //
	////////////

	return (
		<>
			{modal === Modal.MAKE_A_BID && (
				<Overlay onClose={() => setModal(undefined)} open>
					<MakeABid
						domain={domain}
						onBid={refetch}
						onClose={() => setModal(undefined)}
						paymentTokenInfo={paymentTokenInfo}
					/>
				</Overlay>
			)}
			<ImageCard
				subHeader={`0://${domain.name}`}
				imageUri={domainMetadata?.image_full ?? domainMetadata?.image}
				header={domainMetadata?.title}
				onClick={onClick}
				aspectRatio={getAspectRatioForZna(getParentZna(domain.name))}
				shouldUseCloudinary={true}
			>
				<div className={styles.Container}>
					<div className={styles.Bid}>
						{isLoadingSubdomain && <Spinner />}
						{!isLoadingSubdomain && (
							<>
								<label>{LABELS.TOP_BID}</label>
								{!tradeData && <span className={styles.Crypto}>-</span>}
								{tradeData && (
									<>
										<span className={styles.Crypto}>
											{tradeData.highestBid
												? formatEthers(tradeData.highestBid)
												: 0}{' '}
											{paymentTokenInfo?.symbol}
										</span>
										{Number(paymentTokenInfo?.priceInUsd) > 0 && (
											<span className={styles.Fiat}>
												$
												{tradeData.highestBid
													? formatNumber(
															Number(
																ethers.utils.formatEther(tradeData?.highestBid),
															) * Number(paymentTokenInfo?.priceInUsd),
													  )
													: 0}{' '}
											</span>
										)}
									</>
								)}
							</>
						)}
					</div>
					<div className={styles.ButtonContainer}>
						{buyNowPrice ? (
							<BuyNowButton
								onSuccess={refetch}
								buttonText={LABELS.BUY}
								domainId={domain.id}
								disabled={isOwnedByUser || !account}
								isLoading={isLoadingSubdomain}
								className={styles.Button}
								paymentTokenInfo={paymentTokenInfo}
							/>
						) : (
							<BidButton
								glow={account !== undefined && !isOwnedByUser && isBiddable}
								onClick={onButtonClick}
								className={styles.Button}
								loading={isLoadingSubdomain}
							>
								{LABELS.BID}
							</BidButton>
						)}
					</div>
				</div>
			</ImageCard>
		</>
	);
};

export default SubdomainTableCard;
