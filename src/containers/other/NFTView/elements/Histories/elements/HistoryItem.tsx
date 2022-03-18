import moment from 'moment';
import {
	DomainEventType,
	DomainTransferEvent,
	DomainMintEvent,
	DomainBidEvent,
	DomainSaleEvent,
} from '@zero-tech/zns-sdk/lib/types';
import { ethers } from 'ethers';
import { DomainEvents } from '../../../NFTView.types';
import styles from '../../../NFTView.module.scss';

type HistoryItemProps = {
	item: DomainEvents;
};

const HistoryItem = ({ item }: HistoryItemProps) => {
	if (item.type === DomainEventType.bid) {
		const history = item as DomainBidEvent;

		return (
			<li className={styles.Bid}>
				<div>
					<b>
						<a
							className="alt-link"
							href={`https://etherscan.io/address/${history.bidder!}`}
							target="_blank"
							rel="noreferrer"
						>{`${history.bidder!.substring(0, 4)}...${history.bidder!.substring(
							history.bidder!.length - 4,
						)}`}</a>
					</b>{' '}
					made an offer of{' '}
					<b>
						{Number(ethers.utils.formatEther(history.amount!)).toLocaleString()}{' '}
						WILD
					</b>
				</div>
				<div className={styles.From}>
					<b>{moment(Number(history!.timestamp)).fromNow()}</b>
				</div>
			</li>
		);
	} else if (item.type === DomainEventType.mint) {
		const history = item as DomainMintEvent;

		return (
			<li className={styles.Bid}>
				<div>
					<b>
						<a
							className="alt-link"
							href={`https://etherscan.io/address/${history.minter!}`}
							target="_blank"
							rel="noreferrer"
						>{`${history.minter!.substring(0, 4)}...${history.minter!.substring(
							history.minter!.length - 4,
						)}`}</a>
					</b>{' '}
					minted the domain
				</div>
				<div className={styles.From}>
					<b>{moment(Number(history.timestamp!) * 1000).fromNow()}</b>
				</div>
			</li>
		);
	} else if (item.type === DomainEventType.transfer) {
		const history = item as DomainTransferEvent;

		return (
			<li className={styles.Bid}>
				<div>
					<b>
						<a
							className="alt-link"
							href={`https://etherscan.io/address/${history.from!}`}
							target="_blank"
							rel="noreferrer"
						>{`${history.from!.substring(0, 4)}...${history.from!.substring(
							history.from!.length - 4,
						)}`}</a>
					</b>{' '}
					transferred ownership to{' '}
					<b>
						<a
							className="alt-link"
							href={`https://etherscan.io/address/${history.to!}`}
							target="_blank"
							rel="noreferrer"
						>{`${history.to!.substring(0, 4)}...${history.to!.substring(
							history.to!.length - 4,
						)}`}</a>
					</b>{' '}
				</div>
				<div className={styles.From}>
					<b>{moment(Number(history.timestamp) * 1000).fromNow()}</b>
				</div>
			</li>
		);
	} else if (item.type === DomainEventType.sale) {
		const history = item as DomainSaleEvent;

		return (
			<li className={styles.Bid}>
				<div>
					<b>
						3
						<a
							className="alt-link"
							href={`https://etherscan.io/address/${history.seller!}`}
							target="_blank"
							rel="noreferrer"
						>{`${history.seller!.substring(0, 4)}...${history.seller!.substring(
							history.seller!.length - 4,
						)}`}</a>
					</b>{' '}
					sold this NFT to{' '}
					<b>
						<a
							className="alt-link"
							href={`https://etherscan.io/address/${history.buyer!}`}
							target="_blank"
							rel="noreferrer"
						>{`${history.buyer!.substring(0, 4)}...${history.buyer!.substring(
							history.buyer!.length - 4,
						)}`}</a>
					</b>{' '}
					{history.amount && (
						<>
							for{' '}
							<b>
								{Number(
									ethers.utils.formatEther(history.amount!),
								).toLocaleString()}{' '}
								WILD
							</b>
						</>
					)}
				</div>
				<div className={styles.From}>
					<b>{moment(Number(history.timestamp) * 1000).fromNow()}</b>
				</div>
			</li>
		);
	} else {
		return <></>;
	}
};

export default HistoryItem;
