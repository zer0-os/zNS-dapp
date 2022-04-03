// Components
import { Detail } from 'components';
import {
	BidButton,
	BuyNowButton,
	CancelBidButton,
	SetBuyNowButton,
} from 'containers';

// Library
import { toFiat } from 'lib/currency';
import { formatEther } from '@ethersproject/units';
import { Bid } from '@zero-tech/zns-sdk/lib/zAuction';

// Styles
import styles from './Actions.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

enum ACTION_TYPES {
	BuyNow,
	SetBuyNow,
	PlaceBid,
	YourBid,
}

type ActionBlock = {
	amount: number | string | undefined;
	label: string;
	amountUsd: string;
	buttonComponent: (isTextButton?: boolean) => JSX.Element;
	isVisible: boolean;
	shouldShowBorder?: boolean;
};

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
	/**
	 * This is a pretty messy structure - could be refactored moving forward
	 */
	const actions: { [action in ACTION_TYPES]: ActionBlock } = {
		[ACTION_TYPES.BuyNow]: {
			amount: buyNowPrice,
			label: 'Buy Now (WILD)',
			amountUsd:
				buyNowPrice && wildPriceUsd
					? wrapFiat(buyNowPrice * wildPriceUsd)
					: '-',
			buttonComponent: (isTextButton?: boolean) => (
				<BuyNowButton
					onSuccess={refetch}
					buttonText="Buy Now"
					domainId={domainId ?? ''}
					isTextButton={isTextButton}
					className={cx({ TextButton: isTextButton })}
				/>
			),
			isVisible: Boolean(buyNowPrice) && !isOwnedByUser && Boolean(domainId),
		},
		[ACTION_TYPES.SetBuyNow]: {
			amount: buyNowPrice,
			label: 'Buy Now (WILD)',
			amountUsd:
				buyNowPrice && wildPriceUsd
					? wrapFiat(buyNowPrice * wildPriceUsd)
					: '-',
			buttonComponent: (isTextButton?: boolean) => (
				<SetBuyNowButton
					onSuccess={refetch}
					buttonText={buyNowPrice ? 'Edit Buy Now' : undefined}
					domainId={domainId ?? ''}
					isTextButton={isTextButton}
					className={cx({ TextButton: isTextButton })}
				/>
			),
			isVisible:
				isOwnedByUser === true && Boolean(domainId) && Boolean(buyNowPrice),
		},
		[ACTION_TYPES.PlaceBid]: {
			amount: highestBid ?? '-',
			label: 'Highest Bid (WILD)',
			amountUsd:
				Boolean(highestBid) && Boolean(wildPriceUsd)
					? wrapFiat(highestBid! * wildPriceUsd!)
					: 'No bids placed',
			buttonComponent: (isTextButton?: boolean) => {
				return !isOwnedByUser ? (
					<BidButton
						className={cx({ TextButton: isTextButton })}
						isTextButton={isTextButton}
						glow
						onClick={onMakeBid}
					>
						{!yourBid || Number(yourBid.amount) <= highestBid!
							? 'Place A Bid'
							: 'Rebid'}
					</BidButton>
				) : (
					<></>
				);
			},
			isVisible: isBiddable === true,
		},
		[ACTION_TYPES.YourBid]: {
			amount: yourBid ? Number(formatEther(yourBid.amount)) : '-',
			label: 'Your Bid (WILD)',
			amountUsd: wrapFiat(100),
			buttonComponent: (isTextButton?: boolean) => (
				<CancelBidButton
					isTextButton
					bidNonce={yourBid?.bidNonce ?? ''}
					domainId={domainId!}
					onSuccess={refetch}
					className={cx({ TextButton: isTextButton })}
				/>
			),
			isVisible: !isOwnedByUser && Boolean(yourBid),
		},
	};

	/**
	 * Needs to be ordered based on what is important to the user
	 * i.e. Buy Now first for buyers, highest bid for owner
	 */
	const ordered = isOwnedByUser
		? [
				actions[ACTION_TYPES.BuyNow],
				actions[ACTION_TYPES.SetBuyNow],
				actions[ACTION_TYPES.PlaceBid],
		  ]
		: [
				actions[ACTION_TYPES.BuyNow],
				actions[ACTION_TYPES.PlaceBid],
				actions[ACTION_TYPES.YourBid],
		  ];

	const toRender = ordered.filter((a: ActionBlock) => Boolean(a.isVisible));

	return (
		<ul className={styles.Container}>
			{toRender.map((a: ActionBlock, index: number) => (
				<li className={cx({ Border: index === 0 && toRender.length > 2 })}>
					<Detail
						text={a.amount ?? ''}
						subtext={a.label ?? ''}
						bottomText={a.amountUsd ?? ''}
						mainClassName={styles.Label}
					/>
					<div className={styles.Action}>{a.buttonComponent(index !== 0)}</div>
				</li>
			))}
		</ul>
	);
};

export default Actions;
