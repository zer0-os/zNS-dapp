/* eslint-disable react-hooks/exhaustive-deps */
import { Spinner } from 'components';
import React, { useEffect, useState } from 'react';

import styles from './SubdomainTableCard.module.scss';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useCurrencyProvider } from 'lib/providers/CurrencyProvider';
import { DomainMetrics } from '@zero-tech/zns-sdk';
import { useHistory } from 'react-router-dom';
import { ethers } from 'ethers';
import { toFiat } from 'lib/currency';

import { NFTCard } from 'components';
import { BidButton } from 'containers';

import { useBid } from './BidProvider';

const SubdomainTableCard = (props: any) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;
	const { push: goTo } = useHistory();
	const { makeABid, updated } = useBid();

	const { wildPriceUsd } = useCurrencyProvider();

	const domain = props.data;
	const tradeData: DomainMetrics = domain?.metrics;

	const [hasUpdated, setHasUpdated] = useState<boolean>(false);

	const isOwnedByUser =
		account?.toLowerCase() === domain?.owner?.id.toLowerCase();

	const onButtonClick = (event: any) => {
		makeABid(domain);
	};

	useEffect(() => {
		if (updated && updated.id === domain.id) {
			setHasUpdated(!hasUpdated);
		}
	}, [updated]);

	const onClick = (event: any) => {
		if (!event.target.className.includes('FutureButton')) {
			goTo(domain.name.split('wilder.')[1]);
		}
	};

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
								{tradeData.highestBid
									? Number(
											ethers.utils.formatEther(tradeData.highestBid),
									  ).toLocaleString()
									: 0}
							</span>
							<span className={styles.Fiat}>
								$
								{tradeData.highestBid
									? toFiat(
											Number(ethers.utils.formatEther(tradeData?.highestBid)) *
												wildPriceUsd,
									  )
									: 0}{' '}
								USD
							</span>
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
