import moment from 'moment';
import {
	DomainEventType,
	DomainTransferEvent,
	DomainMintEvent,
	DomainBidEvent,
	DomainSaleEvent,
	DomainBuyNowSaleEvent,
} from '@zero-tech/zns-sdk/lib/types';
import { URLS } from 'constants/urls';
import { ethers } from 'ethers';
import { truncateText } from '../../../NFTView.helpers';
import { DomainEvents } from '../../../NFTView.types';
import styles from '../../../NFTView.module.scss';

type HistoryItemProps = {
	item: DomainEvents;
};

const HistoryItem = ({ item }: HistoryItemProps) => {
	switch (item.type) {
		case DomainEventType.bid:
			item = item as DomainBidEvent;

			return (
				<li className={styles.Bid}>
					<div>
						<b>
							<a
								className="alt-link"
								href={URLS.ETHERSCAN + item.bidder!}
								target="_blank"
								rel="noreferrer"
							>
								{truncateText(item.bidder!, 4)}
							</a>
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

		case DomainEventType.mint:
			item = item as DomainMintEvent;

			return (
				<li className={styles.Bid}>
					<div>
						<b>
							<a
								className="alt-link"
								href={URLS.ETHERSCAN + item.minter!}
								target="_blank"
								rel="noreferrer"
							>
								{truncateText(item.minter!, 4)}
							</a>
						</b>{' '}
						minted the domain
					</div>
					<div className={styles.From}>
						<b>{moment(Number(item.timestamp!) * 1000).fromNow()}</b>
					</div>
				</li>
			);

		case DomainEventType.transfer:
			item = item as DomainTransferEvent;

			return (
				<li className={styles.Bid}>
					<div>
						<b>
							<a
								className="alt-link"
								href={URLS.ETHERSCAN + item.from!}
								target="_blank"
								rel="noreferrer"
							>
								{truncateText(item.from!, 4)}
							</a>
						</b>{' '}
						transferred ownership to{' '}
						<b>
							<a
								className="alt-link"
								href={URLS.ETHERSCAN + item.to!}
								target="_blank"
								rel="noreferrer"
							>
								{truncateText(item.to!, 4)}
							</a>
						</b>{' '}
					</div>
					<div className={styles.From}>
						<b>{moment(Number(item.timestamp) * 1000).fromNow()}</b>
					</div>
				</li>
			);

		case DomainEventType.buyNow:
			item = item as DomainSaleEvent;

			return (
				<li className={styles.Bid}>
					<div>
						<b>
							<a
								className="alt-link"
								href={URLS.ETHERSCAN + item.buyer!}
								target="_blank"
								rel="noreferrer"
							>
								{truncateText(item.buyer!, 4)}
							</a>
						</b>{' '}
						bought this NFT from{' '}
						<b>
							<a
								className="alt-link"
								href={URLS.ETHERSCAN + item.seller!}
								target="_blank"
								rel="noreferrer"
							>
								{truncateText(item.seller!, 4)}
							</a>
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

		case DomainEventType.sale:
			item = item as DomainBuyNowSaleEvent;

			return (
				<li className={styles.Bid}>
					<div>
						<b>
							<a
								className="alt-link"
								href={URLS.ETHERSCAN + item.seller!}
								target="_blank"
								rel="noreferrer"
							>
								{truncateText(item.seller!, 4)}
							</a>
						</b>{' '}
						sold this NFT to{' '}
						<b>
							<a
								className="alt-link"
								href={URLS.ETHERSCAN + item.buyer!}
								target="_blank"
								rel="noreferrer"
							>
								{truncateText(item.buyer!, 4)}
							</a>
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

		default:
			return <></>;
	}
};

export default HistoryItem;
