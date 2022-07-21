/* eslint-disable react-hooks/exhaustive-deps */
import { Artwork, FutureButton, Overlay, Spinner } from 'components';
import React, { useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';

import { BidButton, BuyNowButton, MakeABid } from 'containers';

import { useHistory } from 'react-router-dom';
import { ethers } from 'ethers';
import { ConvertedTokenInfo, DomainMetrics } from '@zero-tech/zns-sdk';
import { formatEthers, formatNumber, getNetworkZNA } from 'lib/utils';

import { ROUTES } from 'constants/routes';

import styles from './SubdomainTableRow.module.scss';
import useSubdomainData from './hooks/useSubdomainData';
import { Modal } from './SubdomainTableCard.constants';

const SubdomainTableRow = (props: any) => {
	const { account } = useWeb3React();
	const { push: goTo } = useHistory();

	const domain = props.data;
	const tradeData: DomainMetrics = domain?.metrics;

	const paymentTokenInfo: ConvertedTokenInfo = props.data.paymentTokenInfo;

	const domainMetadata = useDomainMetadata(domain?.metadata);

	const [modal, setModal] = useState<Modal | undefined>();

	const isRootDomain = domain.name.split('.').length <= 2;
	const isBiddable =
		isRootDomain || Boolean(domainMetadata?.isBiddable ?? true);

	const isOwnedByUser =
		account?.toLowerCase() === domain?.owner?.id.toLowerCase();

	const {
		isLoading: isLoadingSubdomain,
		buyNowPrice,
		refetch,
	} = useSubdomainData(domain.id);

	const highestBid = () => {
		if (!tradeData) {
			return <span>-</span>;
		} else {
			return (
				<>
					<span className={styles.Bid}>
						{tradeData.volume.all ? formatEthers(tradeData.volume.all) : 0}{' '}
						{paymentTokenInfo?.symbol}
					</span>
					{Number(paymentTokenInfo?.priceInUsd) > 0 && (
						<span className={styles.Bid}>
							$
							{tradeData.volume.all
								? formatNumber(
										Number(ethers.utils.formatEther(tradeData.volume.all)) *
											Number(paymentTokenInfo?.priceInUsd),
								  )
								: 0}{' '}
						</span>
					)}
				</>
			);
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
				{Number(paymentTokenInfo?.priceInUsd) > 0 && Number(value) > 0 && (
					<span className={styles.Bid}>
						{'$' +
							formatNumber(
								Number(paymentTokenInfo?.priceInUsd) *
									Number(ethers.utils.formatEther(value)),
							)}
					</span>
				)}
			</>
		);
	};

	const bidColumns = () => {
		// TODO: Avoid directly defining the columns and associated render method.
		if (!isLoadingSubdomain) {
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
		if (account !== undefined && !isOwnedByUser && isBiddable) {
			setModal(Modal.MAKE_A_BID);
		}
	};

	const onRowClick = (event: any) => {
		const clickedButton = event.target.className.indexOf('FutureButton') >= 0;
		if (!clickedButton) {
			goTo(ROUTES.MARKET + '/' + getNetworkZNA(domain.name));
		}
	};
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
			<tr className={styles.Row} onClick={onRowClick}>
				<td>{props.rowNumber + 1}</td>
				<td>
					<Artwork
						domain={'0://' + domain.name}
						disableInteraction
						metadataUrl={domain.metadata}
						id={domain.id}
						style={{ maxWidth: 220 }}
					/>
				</td>
				{bidColumns()}
				<td>
					{isLoadingSubdomain ? (
						<FutureButton
							style={{ marginLeft: 'auto', width: 93 }}
							glow
							loading
						>
							Loading
						</FutureButton>
					) : buyNowPrice ? (
						<BuyNowButton
							onSuccess={refetch}
							buttonText="Buy"
							domainId={domain.id}
							disabled={isOwnedByUser || !account}
							style={{ marginLeft: 'auto' }}
							paymentTokenInfo={paymentTokenInfo}
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
		</>
	);
};

export default React.memo(SubdomainTableRow);
