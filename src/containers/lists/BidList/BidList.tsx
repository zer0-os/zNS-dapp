// React Imports
import React, { useEffect, useState } from 'react';

// Style Imports
import styles from './BidList.module.scss';

// Component Imports
import { FutureButton, Wizard } from 'components';

// Type Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Bid } from '@zero-tech/zauction-sdk';
import { ethers } from 'ethers';

const moment = require('moment');

type BidListProps = {
	bids: Bid[];
	onAccept?: (bid: Bid) => void;
	wildPriceUsd?: number;
	isAccepting?: boolean;
};

const BidList: React.FC<BidListProps> = ({
	bids,
	onAccept,
	wildPriceUsd,
	isAccepting,
}) => {
	//////////////////
	// Data & State //
	//////////////////

	const [blockNumber, setBlockNumber] = useState<number>();
	const { library } = useWeb3React<Web3Provider>();

	useEffect(() => {
		if (library) {
			library.getBlockNumber().then((bn) => {
				setBlockNumber(bn);
			});
			library.on('block', setBlockNumber);
			return () => {
				library.removeListener('block', setBlockNumber);
				setBlockNumber(undefined);
			};
		}
	}, [library]);

	const sorted = bids
		.slice()
		.sort((a: Bid, b: Bid) => Number(b.timestamp) - Number(a.timestamp));

	///////////////
	// Functions //
	///////////////

	const accept = (bid: Bid) => {
		if (onAccept && !isAccepting) onAccept(bid);
	};

	////////////
	// Render //
	////////////

	return (
		<aside className={`${styles.Container} border-rounded border-primary`}>
			<div className={styles.Header}>
				<h4>All bids</h4>
				<hr className="glow" />
			</div>
			{isAccepting && (
				<p className={styles.Pending}>Accept bid transaction pending.</p>
			)}
			<ul className={isAccepting ? styles.Accepting : ''}>
				{sorted.map((bid: Bid, i: number) => (
					<li key={bid.auctionId} className={styles.Bid}>
						<div>
							<label>{moment(Number(bid.timestamp)).fromNow()}</label>
							<span>
								{Number(ethers.utils.formatEther(bid.amount)).toLocaleString()}{' '}
								WILD{' '}
								{wildPriceUsd !== undefined && wildPriceUsd > 0 && (
									<>
										($
										{(
											Number(ethers.utils.formatEther(bid.amount)) *
											wildPriceUsd
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
								{Number(bid.expireBlock) <= blockNumber && <div>Expired</div>}
							</>
						)}
					</li>
				))}
			</ul>
		</aside>
	);
};

export default BidList;
