import { formatEther } from '@ethersproject/units';
import { Bid } from '@zero-tech/zns-sdk/lib/zAuction';
import { Detail } from 'components';
import {
	BidButton,
	BuyNowButton,
	CancelBidButton,
	SetBuyNowButton,
} from 'containers';
import { toFiat } from 'lib/currency';
import styles from './Actions.module.scss';

type ActionsProps = {
	domainId?: string;
	buyNowPrice?: number;
	highestBid?: number;
	onMakeBid: () => void;
	yourBid?: Bid;
	isBiddable?: boolean;
	isOwnedByUser?: boolean;
	wildPriceUsd?: number;
	refetch: () => void;
};

const wrapFiat = (number: number) => {
	return '$' + toFiat(number);
};

const Actions = ({
	domainId,
	buyNowPrice,
	highestBid,
	onMakeBid,
	yourBid,
	isBiddable,
	isOwnedByUser,
	wildPriceUsd,
	refetch,
}: ActionsProps) => {
	const hasBuyNowPrice = (buyNowPrice ?? 0) > 0;

	return (
		<ul className={styles.Container}>
			{/* Bid */}
			{isBiddable && (
				<li>
					<Detail
						text={highestBid ? highestBid : '-'}
						subtext={'Highest Bid (WILD)'}
						bottomText={
							highestBid && wildPriceUsd
								? wrapFiat(highestBid * wildPriceUsd)
								: 'No bids placed'
						}
					/>
					{!isOwnedByUser && (
						<div className={styles.Action}>
							<BidButton glow onClick={onMakeBid}>
								Place A Bid
							</BidButton>
						</div>
					)}
				</li>
			)}

			{/* Buy Now - not owner */}
			{hasBuyNowPrice && !isOwnedByUser && domainId !== undefined && (
				<li>
					<Detail
						text={buyNowPrice + ' WILD'}
						subtext={'Buy Now'}
						bottomText={
							wildPriceUsd ? wrapFiat(buyNowPrice! * wildPriceUsd) : '-'
						}
					/>
					<div className={styles.Action}>
						<BuyNowButton
							onSuccess={refetch}
							buttonText="Buy Now"
							domainId={domainId ?? ''}
							isTextButton
							className={styles.TextButton}
						/>
					</div>
				</li>
			)}

			{/* Buy Now - owner */}
			{isOwnedByUser && domainId !== undefined && (
				<li>
					<Detail
						text={buyNowPrice ? buyNowPrice + ' WILD' : '-'}
						subtext={'Buy Now'}
						bottomText={
							wildPriceUsd && buyNowPrice
								? wrapFiat(buyNowPrice * wildPriceUsd)
								: 'No Buy Now set'
						}
					/>
					<div className={styles.Action}>
						<SetBuyNowButton
							onSuccess={refetch}
							buttonText={buyNowPrice ? 'Edit Buy Now' : undefined}
							domainId={domainId ?? ''}
							isTextButton
							className={styles.TextButton}
						/>
					</div>
				</li>
			)}

			{/* Your Bid */}
			{!isOwnedByUser && yourBid && (
				<li>
					<Detail
						text={formatEther(yourBid.amount) + ' WILD'}
						subtext={'Your Bid'}
						bottomText={
							wildPriceUsd
								? wrapFiat(Number(formatEther(yourBid.amount)) * wildPriceUsd)
								: '-'
						}
					/>
					<div className={styles.Action}>
						<CancelBidButton
							isTextButton
							bidNonce={yourBid!.bidNonce}
							domainId={domainId!}
							onSuccess={refetch}
							className={styles.TextButton}
						/>
					</div>
				</li>
			)}
		</ul>
	);
};

export default Actions;
