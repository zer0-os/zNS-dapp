/* eslint-disable react-hooks/exhaustive-deps */
import { Artwork, Spinner } from 'components';
import React, { useEffect, useState } from 'react';

import styles from './SubdomainTableRow.module.scss';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useBidProvider } from 'lib/providers/BidProvider';
import useCurrency from 'lib/hooks/useCurrency';
import { Bid } from 'lib/types';
import { useHistory } from 'react-router-dom';
import { useBid } from './BidProvider';
import { BidButton, BuyNowButton } from 'containers';
import { ethers, providers } from 'ethers';
import { DomainMetrics } from '@zero-tech/zns-sdk/lib/types';
import { formatNumber, formatEthers } from 'lib/utils';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { useBuyNow } from './BuyNowProvider';

const SubdomainTableRow = (props: any) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { account, library } = walletContext;
	const { push: goTo } = useHistory();

	const { makeABid, updated } = useBid();
	const { makeABuy } = useBuyNow();
	const { getBidsForDomain } = useBidProvider();

	const { wildPriceUsd } = useCurrency();

	const domain = props.data;
	const tradeData: DomainMetrics = domain?.metrics;

	const sdk = useZnsSdk();

	const [bids, setBids] = useState<Bid[] | undefined>();
	const [buyNowPrice, setBuyNowPrice] = useState<string | undefined>();
	const [isMounted, setIsMounted] = useState(false);

	const [hasUpdated, setHasUpdated] = useState<boolean>(false);
	const [areBidsLoading, setAreBidsLoading] = useState<boolean>(true);

	const domainId = domain.id;

	const isOwnedByUser =
		account?.toLowerCase() === domain?.owner?.id.toLowerCase();

	useEffect(() => {
		if (updated && updated.id === domain.id) {
			setHasUpdated(!hasUpdated);
		}
	}, [updated]);

	useEffect(() => {
		const get = async () => {
			setBids(undefined);
			setAreBidsLoading(true);
			try {
				const b = await getBidsForDomain(domain);
				if (isMounted) {
					setBids(b);
					setAreBidsLoading(false);
				}
			} catch (err) {
				setAreBidsLoading(false);
				console.log(err);
			}
		};
		get();

		try {
			(async () => {
				const provider =
					library && new providers.Web3Provider(library.provider);
				const signer = provider && provider.getSigner(account!);

				const isAbleToSpendTokens = await (
					await sdk.instance.getZAuctionInstanceForDomain(domainId)
				).getZAuctionSpendAllowance(await signer?.getAddress()!);

				if (isAbleToSpendTokens) {
					await (await sdk.instance.getZAuctionInstanceForDomain(domainId))
						.getBuyNowPrice(domainId, signer!)
						.then((zauctionBuyNowPrice) => {
							if (!zauctionBuyNowPrice.isZero())
								setBuyNowPrice(zauctionBuyNowPrice.toString());
						});
				} else {
					await (await sdk.instance.getZAuctionInstanceForDomain(domainId))
						.approveZAuctionSpendTradeTokens(signer!)
						.then(async () => {
							await (await sdk.instance.getZAuctionInstanceForDomain(domainId))
								.getBuyNowPrice(domainId, signer!)
								.then((zauctionBuyNowPrice) => {
									console.log(zauctionBuyNowPrice.isZero());
									if (!zauctionBuyNowPrice.isZero())
										setBuyNowPrice(zauctionBuyNowPrice.toString());
								});
						});
				}
			})();
		} catch (error) {
			console.error(error);
		}

		return () => {
			setIsMounted(false);
		};
	}, [domain, hasUpdated]);

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
		if (!areBidsLoading) {
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
					<td className={styles.Right}>
						<Spinner />
					</td>
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

	const onBuyNowButtonClick = () => {
		makeABuy(domain);
	};

	const onRowClick = (event: any) => {
		const clickedButton = event.target.className.indexOf('FutureButton') >= 0;
		if (!clickedButton) {
			goTo(domain.name.split('wilder.')[1]);
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
				{buyNowPrice ? (
					<BuyNowButton
						glow={account !== undefined && !isOwnedByUser}
						onClick={onBuyNowButtonClick}
						tooltip={buyNowPrice}
						style={{ margin: 'auto' }}
					>
						Buy Now
					</BuyNowButton>
				) : (
					<BidButton
						glow={account !== undefined && !isOwnedByUser}
						onClick={onBidButtonClick}
						style={{ margin: 'auto' }}
					>
						Make A Bid
					</BidButton>
				)}
			</td>
		</tr>
	);
};

export default React.memo(SubdomainTableRow);
