/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

//-Library Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import useCurrency from 'lib/hooks/useCurrency';
import { DomainMetrics } from '@zero-tech/zns-sdk/lib/types';
import { ethers } from 'ethers';
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';
import {
	formatNumber,
	formatEthers,
	getParentZna,
	getAspectRatioForZna,
} from 'lib/utils';

//-Component Imports
import { Spinner, ImageCard } from 'components';

//-Containers Imports
import { BidButton } from 'containers';

//-Local Imports
import { useBid } from './BidProvider';

//-Constants Imports
import { LABELS } from './SubdomainTableCard.constants';
import { ROUTES } from 'constants/routes';

//-Styles Imports
import styles from './SubdomainTableCard.module.scss';

const SubdomainTableCard = (props: any) => {
	//////////////////
	// State & Data //
	//////////////////

	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;
	const { push: goTo } = useHistory();
	const { makeABid, updated } = useBid();

	const domain = props.data;
	const paymentTokenInfo = props.paymentTokenInfo;
	const tradeData: DomainMetrics = domain?.metrics;

	const domainMetadata = useDomainMetadata(domain?.metadata);
	const isRootDomain = domain.name.split('.').length <= 2;
	const isBiddable =
		isRootDomain || Boolean(domainMetadata?.isBiddable ?? true);

	const [hasUpdated, setHasUpdated] = useState<boolean>(false);

	const isOwnedByUser =
		account?.toLowerCase() === domain?.owner?.id.toLowerCase();

	///////////////
	// Functions //
	///////////////

	const onButtonClick = (event: any) => {
		if (account !== undefined && !isOwnedByUser && isBiddable) {
			makeABid(domain);
		}
	};

	const onClick = (event: any) => {
		if (!event.target.className.includes('FutureButton')) {
			goTo(ROUTES.MARKET + '/' + domain.name.split('wilder.')[1]);
		}
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (updated && updated.id === domain.id) {
			setHasUpdated(!hasUpdated);
		}
	}, [updated]);

	////////////
	// Render //
	////////////

	return (
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
					{!tradeData && <Spinner />}
					{tradeData && (
						<>
							<label>{LABELS.TOP_BID}</label>
							<span className={styles.Crypto}>
								{tradeData.highestBid ? formatEthers(tradeData.highestBid) : 0}{' '}
								{paymentTokenInfo.name}
							</span>
							{paymentTokenInfo.price > 0 && (
								<span className={styles.Fiat}>
									$
									{tradeData.highestBid
										? formatNumber(
												Number(
													ethers.utils.formatEther(tradeData?.highestBid),
												) * paymentTokenInfo.price,
										  )
										: 0}{' '}
								</span>
							)}
						</>
					)}
				</div>
				<div className={styles.ButtonContainer}>
					<BidButton
						glow={account !== undefined && !isOwnedByUser && isBiddable}
						onClick={onButtonClick}
						className={styles.BidButton}
					>
						{LABELS.BID}
					</BidButton>
				</div>
			</div>
		</ImageCard>
	);
};

export default React.memo(SubdomainTableCard);
