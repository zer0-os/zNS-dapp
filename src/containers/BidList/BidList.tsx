// React Imports
import React from 'react';

// Style Imports
import styles from './BidList.module.css';

// Component Imports
import { FutureButton } from 'components';

// Type Imports
import { Bid } from 'lib/types';

type BidListProps = {
	bids: Bid[];
	onAccept?: (bid: Bid) => void;
	wildPriceUsd?: number;
};

const BidList: React.FC<BidListProps> = ({ bids, onAccept, wildPriceUsd }) => {
	//////////////////
	// Data & State //
	//////////////////

	const sorted = bids.sort((a: Bid, b: Bid) => b.amount - a.amount);

	///////////////
	// Functions //
	///////////////

	const accept = (bid: Bid) => {
		if (onAccept) onAccept(bid);
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
						{onAccept !== undefined && (
							<FutureButton glow onClick={() => accept(bid)}>
								Accept
							</FutureButton>
						)}
					</li>
				))}
			</ul>
		</aside>
	);
};

export default BidList;
