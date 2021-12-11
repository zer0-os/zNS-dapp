/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Library Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import useCurrency from 'lib/hooks/useCurrency';
import { DomainMetrics } from '@zero-tech/zns-sdk/lib/types';
import { ethers } from 'ethers';
import { formatNumber, formatEthers } from 'lib/utils';

// Component Imports
import { Spinner, NFTCard } from 'components';
import { BidButton } from 'containers';

// Local Imports
import { useBid } from './BidProvider';

import styles from './SubdomainTableCard.module.scss';

const SubdomainTableCard = (props: any) => {
	//////////////////
	// State & Data //
	//////////////////

	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;
	const { push: goTo } = useHistory();
	const { makeABid, updated } = useBid();

	const { wildPriceUsd } = useCurrency();

	const domain = props.data;
	const tradeData: DomainMetrics = domain?.metrics;

	const [hasUpdated, setHasUpdated] = useState<boolean>(false);

	const isOwnedByUser =
		account?.toLowerCase() === domain?.owner?.id.toLowerCase();

	///////////////
	// Functions //
	///////////////

	const onButtonClick = (event: any) => {
		makeABid(domain);
	};

	const onClick = (event: any) => {
		if (!event.target.className.includes('FutureButton')) {
			goTo(domain.name.split('wilder.')[1]);
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
		<NFTCard
			domain={domain.name}
			metadataUrl={domain.metadata}
			nftOwnerId={domain.owner?.id || ''}
			nftMinterId={domain.minter?.id || ''}
			showCreator
			showOwner
			onClick={onClick}
		>
			<div className={styles.Container}>
				<div className={styles.Bid}>
					{!tradeData && <Spinner style={{ marginTop: 1 }} />}
					{tradeData && (
						<>
							<label>Highest Bid</label>
							<span className={`${styles.Crypto} glow-text-blue`}>
								{tradeData.highestBid ? formatEthers(tradeData.highestBid) : 0}{' '}
								WILD
							</span>
							{wildPriceUsd > 0 && (
								<span className={styles.Fiat}>
									$
									{tradeData.highestBid
										? formatNumber(
												Number(
													ethers.utils.formatEther(tradeData?.highestBid),
												) * wildPriceUsd,
										  )
										: 0}{' '}
								</span>
							)}
						</>
					)}
				</div>
				<BidButton
					glow={account !== undefined && !isOwnedByUser}
					onClick={onButtonClick}
				>
					Bid
				</BidButton>
			</div>
		</NFTCard>
	);
};

export default React.memo(SubdomainTableCard);
