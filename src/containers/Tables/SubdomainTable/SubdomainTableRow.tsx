/* eslint-disable react-hooks/exhaustive-deps */
import { Artwork, Spinner } from 'components';
import React, { useEffect, useState } from 'react';

import styles from './SubdomainTableRow.module.scss';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useBidProvider } from 'lib/providers/BidProvider';
import { useCurrencyProvider } from 'lib/providers/CurrencyProvider';
import { Bid } from 'lib/types';
import { useHistory } from 'react-router-dom';
import { useBid } from './BidProvider';
import { BidButton } from 'containers';
import { ethers } from 'ethers';
import { toFiat } from 'lib/currency';
import { DomainMetrics } from '@zero-tech/zns-sdk';

const SubdomainTableRow = (props: any) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;
	const { push: goTo } = useHistory();

	const { makeABid, updated } = useBid();
	const { getBidsForDomain } = useBidProvider();

	const { wildPriceUsd } = useCurrencyProvider();

	const domain = props.data;
	const tradeData: DomainMetrics = domain?.metrics;

	const [bids, setBids] = useState<Bid[] | undefined>();

	const [hasUpdated, setHasUpdated] = useState<boolean>(false);
	const [areBidsLoading, setAreBidsLoading] = useState<boolean>(true);

	const isOwnedByUser =
		account?.toLowerCase() === domain?.owner?.id.toLowerCase();

	useEffect(() => {
		if (updated && updated.id === domain.id) {
			setHasUpdated(!hasUpdated);
		}
	}, [updated]);

	useEffect(() => {
		let isMounted = true;
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
		return () => {
			isMounted = false;
		};
	}, [domain, hasUpdated]);

	const highestBid = () => {
		if (!bids) {
			return <span>Failed to retrieve</span>;
		} else if (bids.length === 0) {
			return <span>-</span>;
		} else {
			return (
				<>
					<span className={styles.Bid}>
						{bids[0].amount.toLocaleString() + ' WILD'}
					</span>
					{wildPriceUsd && (
						<span className={styles.Bid}>
							{'$' + toFiat(wildPriceUsd * bids[0].amount) + ' USD'}
						</span>
					)}
				</>
			);
		}
	};

	const bidColumns = () => {
		if (!areBidsLoading) {
			return (
				<>
					<td className={styles.Right}>{highestBid()}</td>
					<td className={styles.Right}>
						{!bids && 'Failed to retrieve'}
						{bids && bids.length.toLocaleString()}
					</td>
					<td className={styles.Right}>
						{!tradeData && 'Failed to retrieve'}
						{tradeData?.lastSale
							? Number(ethers.utils.formatEther(tradeData?.lastSale))
									.toFixed(2)
									.toLocaleString()
							: ''}
					</td>
					<td className={styles.Right}>
						{!tradeData && 'Failed to retrieve'}
						{(tradeData?.volume as any)?.all
							? ethers.utils.formatUnits((tradeData?.volume as any)?.all)
							: ''}
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
				<BidButton
					glow={account !== undefined && !isOwnedByUser}
					onClick={onBidButtonClick}
					style={{ marginLeft: 'auto' }}
				>
					Make A Bid
				</BidButton>
			</td>
		</tr>
	);
};

export default React.memo(SubdomainTableRow);
