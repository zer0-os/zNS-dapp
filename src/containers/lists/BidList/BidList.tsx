// React Imports
import React, { useCallback, useEffect, useState } from 'react';

// Style Imports
import styles from './BidList.module.scss';

// Component Imports
import { FutureButton } from 'components';

//- Container Imports
import { AcceptBid } from 'containers';

// Type Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Bid } from '@zero-tech/zauction-sdk';
import { ConvertedTokenInfo, Domain } from '@zero-tech/zns-sdk';
import { ethers } from 'ethers';

//- Constants Imports
import { MESSAGES } from './BidList.constants';

//- Library Imports
import { Metadata } from 'lib/types';
import { sortBidsByTime } from 'lib/utils/bids';

const moment = require('moment');

export type BidListProps = {
	bids: Bid[];
	domain?: Domain;
	domainMetadata?: Metadata;
	onAccept?: () => void;
	isAccepting?: boolean;
	isLoading?: boolean;
	highestBid?: string;
	isAcceptBidEnabled?: boolean;
	paymentTokenInfo: ConvertedTokenInfo;
};

const BidList: React.FC<BidListProps> = ({
	bids,
	domain,
	domainMetadata,
	onAccept,
	isAccepting,
	isLoading,
	highestBid,
	isAcceptBidEnabled = false,
	paymentTokenInfo,
}) => {
	//////////////////
	// Data & State //
	//////////////////
	const [blockNumber, setBlockNumber] = useState<number>();
	const [isAcceptBidModal, setIsAcceptBidModal] = useState(false);
	const [acceptingBid, setAcceptingBid] = useState<Bid | undefined>(undefined);
	const { provider, account } = useWeb3React<Web3Provider>();

	// Sort bids by date
	const sortedBids = sortBidsByTime(bids);
	const bidsToShow = isAcceptBidEnabled
		? sortedBids.filter(
				(bid) => bid.bidder.toLowerCase() !== account?.toLowerCase(),
		  )
		: sortedBids;

	useEffect(() => {
		if (provider) {
			provider.getBlockNumber().then((bn) => {
				setBlockNumber(bn);
			});
			provider.on('block', setBlockNumber);
			return () => {
				provider.removeListener('block', setBlockNumber);
				setBlockNumber(undefined);
			};
		}
	}, [provider]);

	///////////////
	// Functions //
	///////////////
	const toggleAcceptBidModal = useCallback(() => {
		setIsAcceptBidModal(!isAcceptBidModal);
	}, [isAcceptBidModal]);

	const accept = (bid: Bid) => {
		if (onAccept && !isAccepting) {
			setAcceptingBid(bid);
			toggleAcceptBidModal();
		}
	};

	////////////
	// Render //
	////////////
	return (
		<>
			{isAcceptBidModal && onAccept ? (
				<AcceptBid
					acceptingBid={acceptingBid}
					domainMetadata={domainMetadata}
					refetch={onAccept}
					isLoading={isLoading}
					assetUrl={domainMetadata?.image ?? ''}
					creatorId={domain?.minter ?? ''}
					domainTitle={domainMetadata?.title ?? ''}
					domainId={domain?.id ?? ''}
					domainName={domain?.name ?? ''}
					walletAddress={acceptingBid?.bidder ?? ''}
					highestBid={highestBid ?? ''}
					onClose={toggleAcceptBidModal}
					paymentTokenInfo={paymentTokenInfo}
				/>
			) : (
				<aside className={`${styles.Container} border-rounded border-primary`}>
					<div className={styles.Header}>
						<h4>All bids</h4>
						<hr className="glow" />
					</div>
					{isAccepting && (
						<p className={styles.Pending}>Accept bid transaction pending.</p>
					)}
					<ul className={isAccepting ? styles.Accepting : ''}>
						{bidsToShow.map((bid: Bid, i: number) => (
							<li key={bid.bidNonce} className={styles.Bid}>
								<div>
									<label>{moment(Number(bid.timestamp)).fromNow()}</label>
									<span>
										{Number(
											ethers.utils.formatEther(bid.amount),
										).toLocaleString()}{' '}
										{paymentTokenInfo.symbol}
										{paymentTokenInfo.priceInUsd !== undefined &&
											Number(paymentTokenInfo.priceInUsd) > 0 && (
												<>
													($
													{(
														Number(ethers.utils.formatEther(bid.amount)) *
														Number(paymentTokenInfo.priceInUsd)
													)
														.toFixed(2)
														.toLocaleString()}{' '}
													USD)
												</>
											)}
									</span>
									<span>
										by{' '}
										<a
											className="alt-link"
											href={`https://etherscan.io/address/${bid.bidder}`}
											target="_blank"
											rel="noreferrer"
										>
											{bid.bidder.substring(0, 4)}...
											{bid.bidder.substring(bid.bidder.length - 4)}
										</a>
										{account === bid.bidder && MESSAGES.YOUR_WALLET}
									</span>
								</div>
								{blockNumber && (
									<>
										{Number(bid.expireBlock) > blockNumber &&
											onAccept !== undefined && (
												<FutureButton
													glow={!isAccepting}
													onClick={() => accept(bid)}
												>
													Accept
												</FutureButton>
											)}
										{Number(bid.expireBlock) <= blockNumber && (
											<div>Expired</div>
										)}
									</>
								)}
							</li>
						))}
					</ul>
				</aside>
			)}
		</>
	);
};

export default BidList;
