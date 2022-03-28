/* eslint-disable react-hooks/exhaustive-deps */
import { Artwork, FutureButton, Spinner } from 'components';
import React, { useEffect, useRef, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';

import { BidButton, BuyNowButton } from 'containers';

import { useBidProvider } from 'lib/hooks/useBidProvider';
import useCurrency from 'lib/hooks/useCurrency';
import { Bid } from 'lib/types';
import { useHistory } from 'react-router-dom';
import { useBid } from './BidProvider';
import { ethers } from 'ethers';
import { DomainMetrics } from '@zero-tech/zns-sdk/lib/types';
import { formatNumber, formatEthers } from 'lib/utils';
import { useZAuctionSdk } from 'lib/providers/ZAuctionSdkProvider';

import styles from './SubdomainTableRow.module.scss';

const SubdomainTableRow = (props: any) => {
	const isMounted = useRef<boolean>();

	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;
	const { push: goTo } = useHistory();

	const { instance: zAuctionInstance } = useZAuctionSdk();
	const { makeABid, updated } = useBid();
	const { getBidsForDomain } = useBidProvider();
	const { domainMetadata } = useCurrentDomain();

	const { wildPriceUsd } = useCurrency();

	const domain = props.data;
	const tradeData: DomainMetrics = domain?.metrics;

	const [bids, setBids] = useState<Bid[] | undefined>();
	const [buyNowPrice, setBuyNowPrice] = useState<number | undefined>();

	const [hasUpdated, setHasUpdated] = useState<boolean>(false);
	const [isPriceDataLoading, setIsPriceDataLoading] = useState<boolean>(true);

	const isRootDomain = domain.name.split('.').length <= 2;
	const isBiddable = isRootDomain || Boolean(domainMetadata?.isBiddable);

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
	}, [domain, hasUpdated, account, zAuctionInstance]);

	const fetchData = async () => {
		setIsPriceDataLoading(true);
		setBids(undefined);
		setBuyNowPrice(undefined);

		try {
			if (isMounted.current === false) {
				return;
			}
			const buyNow = await zAuctionInstance.getBuyNowPrice(domain.id);
			if (buyNow) {
				setBuyNowPrice(Number(ethers.utils.formatEther(buyNow.price)));
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
						{tradeData.highestBid ? formatEthers(tradeData.highestBid) : 0}
					</span>
					{wildPriceUsd > 0 && (
						<span className={styles.Bid}>
							$
							{tradeData.highestBid
								? formatNumber(
										Number(ethers.utils.formatEther(tradeData?.highestBid)) *
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
			return (
				<>
					<td className={styles.Right}>{highestBid()}</td>
					<td className={styles.Right}>
						{!bids && '-'}
						{bids && formatNumber(bids.length)}
					</td>
					<td className={`${styles.Right} ${styles.lastSaleCol}`}>
						{formatColumn('lastSale')}
					</td>
					<td className={`${styles.Right} ${styles.volumeCol}`}>
						{formatColumn('volume')}
					</td>
				</>
			);
		} else {
			return (
				<>
					<td className={styles.Right}>
						<Spinner />
					</td>
					<td className={styles.Right}>
						<Spinner />
					</td>
					<td className={`${styles.Right} ${styles.lastSaleCol}`}>
						<Spinner />
					</td>
					<td className={`${styles.Right} ${styles.volumeCol}`}>
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
					<FutureButton style={{ marginLeft: 'auto', width: 160 }} glow loading>
						Loading
					</FutureButton>
				) : buyNowPrice ? (
					<BuyNowButton
						onSuccess={fetchData}
						buttonText="Buy Now"
						domainId={domain.id}
						disabled={isOwnedByUser || !account}
						style={{ marginLeft: 'auto', width: 160 }}
					/>
				) : isBiddable ? (
					<BidButton
						glow={account !== undefined && !isOwnedByUser}
						onClick={onBidButtonClick}
						style={{ marginLeft: 'auto', width: 160 }}
					>
						Make A Bid
					</BidButton>
				) : null}
			</td>
		</tr>
	);
};

export default React.memo(SubdomainTableRow);
