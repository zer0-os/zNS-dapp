import styles from '../NFTView.module.scss';
import { DomainEvent } from '@zero-tech/zns-sdk/lib/types';
import { ethers } from 'ethers';

const moment = require('moment');

interface DomainEvents extends DomainEvent {
	from?: string;
	to?: string;
	minter?: string;
	buyer?: string;
	seller?: string;
	amount?: string;
	bidder?: string;
}

type HistoryItemProps = {
	item: DomainEvents;
};

const HistoryItem = ({ item }: HistoryItemProps) => {
	if (item.type === 2) {
		return (
			<li className={styles.Bid}>
				<div>
					<b>
						<a
							className="alt-link"
							href={`https://etherscan.io/address/${item.bidder!}`}
							target="_blank"
							rel="noreferrer"
						>{`${item.bidder!.substring(0, 4)}...${item.bidder!.substring(
							item.bidder!.length - 4,
						)}`}</a>
					</b>{' '}
					made an offer of{' '}
					<b>
						{Number(ethers.utils.formatEther(item.amount!)).toLocaleString()}{' '}
						WILD
					</b>
				</div>
				<div className={styles.From}>
					<b>{moment(Number(item!.timestamp)).fromNow()}</b>
				</div>
			</li>
		);
	} else if (item.type === 0) {
		return (
			<li className={styles.Bid}>
				<div>
					<b>
						<a
							className="alt-link"
							href={`https://etherscan.io/address/${item.minter!}`}
							target="_blank"
							rel="noreferrer"
						>{`${item.minter!.substring(0, 4)}...${item.minter!.substring(
							item.minter!.length - 4,
						)}`}</a>
					</b>{' '}
					minted the domain
				</div>
				<div className={styles.From}>
					<b>{moment(Number(item.timestamp!) * 1000).fromNow()}</b>
				</div>
			</li>
		);
	} else if (item.type === 1) {
		return (
			<li className={styles.Bid}>
				<div>
					<b>
						<a
							className="alt-link"
							href={`https://etherscan.io/address/${item.from!}`}
							target="_blank"
							rel="noreferrer"
						>{`${item.from!.substring(0, 4)}...${item.from!.substring(
							item.from!.length - 4,
						)}`}</a>
					</b>{' '}
					transferred ownership to{' '}
					<b>
						<a
							className="alt-link"
							href={`https://etherscan.io/address/${item.to!}`}
							target="_blank"
							rel="noreferrer"
						>{`${item.to!.substring(0, 4)}...${item.to!.substring(
							item.to!.length - 4,
						)}`}</a>
					</b>{' '}
				</div>
				<div className={styles.From}>
					<b>{moment(Number(item.timestamp) * 1000).fromNow()}</b>
				</div>
			</li>
		);
	} else if (item.type === 3) {
		return (
			<li className={styles.Bid}>
				<div>
					<b>
						3
						<a
							className="alt-link"
							href={`https://etherscan.io/address/${item.seller!}`}
							target="_blank"
							rel="noreferrer"
						>{`${item.seller!.substring(0, 4)}...${item.seller!.substring(
							item.seller!.length - 4,
						)}`}</a>
					</b>{' '}
					sold this NFT to{' '}
					<b>
						<a
							className="alt-link"
							href={`https://etherscan.io/address/${item.buyer!}`}
							target="_blank"
							rel="noreferrer"
						>{`${item.buyer!.substring(0, 4)}...${item.buyer!.substring(
							item.buyer!.length - 4,
						)}`}</a>
					</b>{' '}
					{item.amount && (
						<>
							for{' '}
							<b>
								{Number(
									ethers.utils.formatEther(item.amount!),
								).toLocaleString()}{' '}
								WILD
							</b>
						</>
					)}
				</div>
				<div className={styles.From}>
					<b>{moment(Number(item.timestamp) * 1000).fromNow()}</b>
				</div>
			</li>
		);
	} else {
		return <></>;
	}
};

export default HistoryItem;
