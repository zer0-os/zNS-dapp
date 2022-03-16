/* eslint-disable react-hooks/exhaustive-deps */
import { Artwork, FutureButton, Spinner } from 'components';
import React, { useEffect, useRef, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

import { BidButton, BuyNowButton } from 'containers';

import { useBidProvider } from 'lib/hooks/useBidProvider';
import useCurrency from 'lib/hooks/useCurrency';
import { useHistory } from 'react-router-dom';
import { useBid } from './BidProvider';
import { ethers } from 'ethers';
import { Domain } from '@zero-tech/zns-sdk/lib/types';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { sortBidsByAmount } from 'lib/utils/bids';

import styles from './OwnedDomainsTableRow.module.scss';
import { Bid } from '@zero-tech/zauction-sdk';

const SubdomainTableRow = (props: any) => {
	const isMounted = useRef<boolean>();

	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;
	const { push: goTo } = useHistory();

	const { instance: sdk } = useZnsSdk();
	const { wildPriceUsd } = useCurrency();
	const { selectDomain } = useBid();

	const domain = props.data as Domain;

	const [isBidDataLoading, setIsBidDataLoading] = useState<boolean>(true);
	const [bids, setBids] = useState<Bid[] | undefined>();
	const [highestBidAmount, setHighestBidAmount] = useState<
		number | undefined
	>();

	useEffect(() => {
		if (!sdk) {
			return;
		}
		setBids(undefined);
		setHighestBidAmount(undefined);
		setIsBidDataLoading(true);
		sdk.zauction.listBids(domain.id).then((bids: Bid[]) => {
			const filteredBids = bids.filter((b) => b.bidder !== account);
			const highestBid = sortBidsByAmount(filteredBids)[0];
			if (!filteredBids && highestBid) {
				setHighestBidAmount(
					Number(ethers.utils.formatEther(highestBid.amount)),
				);
				setBids(filteredBids);
			}
			setIsBidDataLoading(false);
		});
	}, [domain, sdk]);

	const onRowClick = (event: any) => {
		const clickedButton = event.target.className.indexOf('FutureButton') >= 0;
		if (!clickedButton) {
			goTo(`/market/${domain.name.split('wilder.')[1]}`);
		}
	};

	const onViewBids = () => {
		if (!bids) {
			return;
		}
		selectDomain({ domain, bids });
	};

	return (
		<tr className={styles.Container} onClick={onRowClick}>
			<td className={styles.Left}>
				<Artwork
					domain={domain.name.split('wilder.')[1]}
					disableInteraction
					metadataUrl={domain.metadataUri}
					id={domain.id}
					style={{ maxWidth: 200 }}
				/>
			</td>

			{/* Highest Bid */}
			<td className={styles.Right}>
				{isBidDataLoading ? (
					<Spinner />
				) : highestBidAmount ? (
					highestBidAmount.toLocaleString()
				) : (
					'-'
				)}
			</td>

			{/* Number of Bids */}
			<td className={styles.Right}>
				{isBidDataLoading ? <Spinner /> : bids ? bids.length : '-'}
			</td>

			<td>
				<FutureButton
					className={styles.Button}
					glow={bids !== undefined}
					onClick={onViewBids}
				>
					View Bids
				</FutureButton>
			</td>
		</tr>
	);
};

export default React.memo(SubdomainTableRow);
