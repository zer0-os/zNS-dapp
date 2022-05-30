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
import { truncateWalletAddress } from 'lib/utils';
import { DomainEvents } from '../../../NFTView.types';
import styles from '../../../NFTView.module.scss';
import { PaymentTokenInfo } from 'lib/types';

type HistoryItemProps = {
	item: DomainEvents;
	paymentTokenInfo: PaymentTokenInfo;
};

const HistoryItem = ({ item, paymentTokenInfo }: HistoryItemProps) => {
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
								{truncateWalletAddress(item.bidder!)}
							</a>
						</b>{' '}
						made an offer of{' '}
						<b>
							{Number(ethers.utils.formatEther(item.amount!)).toLocaleString()}{' '}
							{paymentTokenInfo.name}
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
								{truncateWalletAddress(item.minter!)}
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
								{truncateWalletAddress(item.from!)}
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
								{truncateWalletAddress(item.to!)}
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
								{truncateWalletAddress(item.buyer!)}
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
								{truncateWalletAddress(item.seller!)}
							</a>
						</b>{' '}
						{item.amount && (
							<>
								for{' '}
								<b>
									{Number(
										ethers.utils.formatEther(item.amount!),
									).toLocaleString()}{' '}
									{paymentTokenInfo.name}
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
								{truncateWalletAddress(item.seller!)}
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
								{truncateWalletAddress(item.buyer!)}
							</a>
						</b>{' '}
						{item.amount && (
							<>
								for{' '}
								<b>
									{Number(
										ethers.utils.formatEther(item.amount!),
									).toLocaleString()}{' '}
									{paymentTokenInfo.name}
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
