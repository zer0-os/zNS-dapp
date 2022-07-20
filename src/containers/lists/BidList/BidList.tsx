// React Imports
import React from 'react';

// Component Imports
import { FutureButton } from 'components';

//- Library Imports
import { sortBidsByTime } from 'lib/utils/bids';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Bid } from '@zero-tech/zauction-sdk';
import { ConvertedTokenInfo } from '@zero-tech/zns-sdk';
import { ethers } from 'ethers';

//- Constants Imports
import { Labels } from './BidList.constants';

// Style Imports
import styles from './BidList.module.scss';
import classNames from 'classnames/bind';

const moment = require('moment');
const cx = classNames.bind(styles);

export type BidListProps = {
	bids: Bid[];
	paymentTokenInfo: ConvertedTokenInfo;
	isAcceptBidEnabled?: boolean;
	isAcceptBidProcessing?: boolean;
	openAcceptBid?: (bid: Bid) => void;
};

const BidList: React.FC<BidListProps> = ({
	bids,
	paymentTokenInfo,
	isAcceptBidEnabled = false,
	isAcceptBidProcessing,
	openAcceptBid,
}) => {
	//////////////////
	// Data & State //
	//////////////////

	const { account } = useWeb3React<Web3Provider>();

	// Sort bids by date
	const sortedBids = sortBidsByTime(bids);

	// Filter users bids when accepting enabled
	const bidsToShow = isAcceptBidEnabled
		? sortedBids.filter(
				(bid) => bid.bidder.toLowerCase() !== account?.toLowerCase(),
		  )
		: sortedBids;

	////////////
	// Render //
	////////////
	return (
		<aside
			className={classNames(styles.Container, 'border-rounded border-primary')}
		>
			<div className={styles.Header}>
				<h4>{Labels.ALL_BIDS}</h4>
				<hr className="glow" />
			</div>
			{isAcceptBidProcessing && (
				<p className={styles.Pending}>{Labels.TRANSACTION_PENDING}</p>
			)}
			<ul
				className={cx(styles.Accepting, {
					isProcessing: isAcceptBidProcessing,
				})}
			>
				{bidsToShow.map((bid: Bid, i: number) => (
					<li key={bid.bidNonce} className={styles.Bid}>
						<div>
							<label>{moment(Number(bid.timestamp)).fromNow()}</label>
							<span>
								{Number(ethers.utils.formatEther(bid.amount)).toLocaleString()}{' '}
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
								{account === bid.bidder && Labels.YOUR_WALLET}
							</span>
						</div>
						{
							<>
								{isAcceptBidEnabled && openAcceptBid && (
									<FutureButton
										glow={!isAcceptBidProcessing}
										onClick={() => openAcceptBid(bid)}
									>
										{Labels.BUTTON}
									</FutureButton>
								)}
							</>
						}
					</li>
				))}
			</ul>
		</aside>
	);
};

export default BidList;
