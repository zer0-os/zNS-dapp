/* eslint-disable react-hooks/exhaustive-deps */
import { Artwork, FutureButton, Spinner } from 'components';
import React, { useEffect, useRef, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';

import { BidButton, BuyNowButton } from 'containers';

import { useBidProvider } from 'lib/hooks/useBidProvider';
import useCurrency from 'lib/hooks/useCurrency';
import { Bid } from 'lib/types';
import { useHistory } from 'react-router-dom';
import { useBid } from './BidProvider';
import { ethers } from 'ethers';
import { DomainMetrics } from '@zero-tech/zns-sdk/lib/types';
import { formatNumber, formatEthers } from 'lib/utils';
import { useZnsSdk } from 'lib/hooks/sdk';

import styles from './SubdomainTableRow.module.scss';

const SubdomainTableRow = (props: any) => {
	const isMounted = useRef<boolean>();

	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;
	const { push: goTo } = useHistory();

	const { makeABid, updated } = useBid();
	const { getBidsForDomain } = useBidProvider();
	const { instance: sdk } = useZnsSdk();

	const { wildPriceUsd } = useCurrency();

	const domain = props.data;
	const tradeData: DomainMetrics = domain?.metrics;

	const domainMetadata = useDomainMetadata(domain?.metadata);

	const [bids, setBids] = useState<Bid[] | undefined>();
	const [buyNowPrice, setBuyNowPrice] = useState<number | undefined>();

	const [hasUpdated, setHasUpdated] = useState<boolean>(false);
	const [isPriceDataLoading, setIsPriceDataLoading] = useState<boolean>(true);

	const isRootDomain = domain.name.split('.').length <= 2;
	const isBiddable =
		isRootDomain || Boolean(domainMetadata?.isBiddable ?? true);

	const isOwnedByUser =
		account?.toLowerCase() === domain?.owner?.id.toLowerCase();

	useEffect(() => {
		if (updated && updated.id === domain.id) {
			setHasUpdated(!hasUpdated);
		}
	}, [updated]);

	useEffect(() => {
		isMounted.current = true;
		fetchData();
		return () => {
			isMounted.current = false;
		};
	}, [domain, hasUpdated, account, sdk]);

	const fetchData = async () => {
		setIsPriceDataLoading(true);
		setBids(undefined);
		setBuyNowPrice(undefined);

		try {
			if (isMounted.current === false) {
				return;
			}
			const buyNowPrice = await sdk.zauction.getBuyNowPrice(domain.id);
			if (buyNowPrice) {
				setBuyNowPrice(Number(buyNowPrice));
			}
		} catch (err) {
			setIsPriceDataLoading(false);
			console.log('Failed to get buy now price', err);
		}

		try {
			const b = await getBidsForDomain(domain);
			if (isMounted.current === true) {
				setBids(b);
				setIsPriceDataLoading(false);
			}
		} catch (err) {
			setIsPriceDataLoading(false);
			console.log('Failed to load domain data', err);
		}
	};

	const highestBid = () => {
		if (!tradeData) {
			return <span>-</span>;
		} else {
			return (
				<>
					<span className={styles.Bid}>
						{tradeData.volume.all ? formatEthers(tradeData.volume.all) : 0} WILD
					</span>
					{wildPriceUsd > 0 && (
						<span className={styles.Bid}>
							$
							{tradeData.volume.all
								? formatNumber(
										Number(ethers.utils.formatEther(tradeData.volume.all)) *
											wildPriceUsd,
								  )
								: 0}{' '}
						</span>
					)}
				</>
			);
		}
	};

	const formatColumn = (columnName: keyof DomainMetrics) => {
		const value =
			columnName === 'volume'
				? (tradeData?.volume as any)?.all
				: tradeData?.[columnName];
		return (
			<>
				{' '}
				{!tradeData && '-'}
				{value && (
					<span className={styles.Bid}>
						{Number(ethers.utils.formatEther(value))
							? formatEthers(value)
							: '-'}
					</span>
				)}
				{wildPriceUsd > 0 && Number(value) > 0 && (
					<span className={styles.Bid}>
						{'$' +
							formatNumber(
								wildPriceUsd * Number(ethers.utils.formatEther(value)),
							)}
					</span>
				)}
			</>
		);
	};

	const bidColumns = () => {
		// TODO: Avoid directly defining the columns and associated render method.
		if (!isPriceDataLoading) {
			return <td className={styles.Right}>{highestBid()}</td>;
		} else {
			return (
				<>
					<td className={styles.Right}>
						<Spinner />
					</td>
				</>
			);
		}
	};

	const onBidButtonClick = () => {
		makeABid(domain);
	};

	const onRowClick = (event: any) => {
		const clickedButton = event.target.className.indexOf('FutureButton') >= 0;
		if (!clickedButton) {
			goTo(`/market/${domain.name.split('wilder.')[1]}`);
		}
	};

	return (
		<tr className={styles.Row} onClick={onRowClick}>
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
				{isPriceDataLoading ? (
					<FutureButton style={{ marginLeft: 'auto', width: 93 }} glow loading>
						Loading
					</FutureButton>
				) : buyNowPrice ? (
					<BuyNowButton
						onSuccess={fetchData}
						buttonText="Buy"
						domainId={domain.id}
						disabled={isOwnedByUser || !account}
						style={{ marginLeft: 'auto' }}
					/>
				) : (
					<BidButton
						glow={account !== undefined && !isOwnedByUser && isBiddable}
						onClick={onBidButtonClick}
						style={{ marginLeft: 'auto' }}
					>
						Bid
					</BidButton>
				)}
			</td>
		</tr>
	);
};

export default React.memo(SubdomainTableRow);
