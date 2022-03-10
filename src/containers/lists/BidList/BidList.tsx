// React Imports
import React, { useEffect, useState } from 'react';

// Style Imports
import styles from './BidList.module.scss';

// Component Imports
import { FutureButton, Wizard } from 'components';

// Type Imports
import { Bid } from 'lib/types';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

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

	// useEffect(() => {
	// 	console.log({ blockNumber });
	// }, [blockNumber]);

	const sorted = bids
		.slice()
		.sort((a: Bid, b: Bid) => b.date.getTime() - a.date.getTime());

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
							<label>{moment(bid.date).fromNow()}</label>
							<span>
								{bid.amount.toLocaleString()} WILD{' '}
								{wildPriceUsd !== undefined && wildPriceUsd > 0 && (
									<>
										($
										{(bid.amount * wildPriceUsd)
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
									href={`https://etherscan.io/address/${bid.bidderAccount}`}
									target="_blank"
									rel="noreferrer"
								>
									{bid.bidderAccount.substring(0, 4)}...
									{bid.bidderAccount.substring(bid.bidderAccount.length - 4)}
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
