import React from 'react';

import styles from './BidList.module.css';

import { Bid } from 'lib/types';

type BidListProps = {
	bids: Bid[];
	wildPriceUsd?: number;
};

const BidList: React.FC<BidListProps> = ({ bids, wildPriceUsd }) => {
	const sorted = bids.sort((a: Bid, b: Bid) => b.amount - a.amount);

	return (
		<aside className={`${styles.Container} border-rounded border-primary`}>
			<h4>All bids</h4>
			<hr className="glow" />
			<ul>
				{sorted.map((bid: Bid, i: number) => (
					<li key={bid.auctionId} className={styles.Bid}>
						<label>{i + 1}</label>
						<div>
							<span>
								{bid.amount.toLocaleString()} WILD{' '}
								{wildPriceUsd && (
									<>
										(${(bid.amount * wildPriceUsd).toFixed(2).toLocaleString()}{' '}
										USD)
									</>
								)}
							</span>
							<span>
								by{' '}
								<a
									className="alt-link"
									href={`https://etherscan.io/address/${bid.bidderAccount}`}
									target="_blank"
									rel="noreferrer"
								>
									{bid.bidderAccount.substring(0, 4)}...
									{bid.bidderAccount.substring(bid.bidderAccount.length - 4)}
								</a>
							</span>
						</div>
					</li>
				))}
			</ul>
		</aside>
	);
};

export default BidList;
