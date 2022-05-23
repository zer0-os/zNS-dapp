// Components
import { Detail } from 'components';
import {
	BidButton,
	BuyNowButton,
	CancelBidButton,
	SetBuyNowButton,
	ViewBidsButton,
} from 'containers';

// Library
import { formatEther } from '@ethersproject/units';
import { Bid } from '@zero-tech/zns-sdk/lib/zAuction';

//- Types Imports
import { ActionBlock, ACTION_TYPES } from './Actions.types';

//- Constants Imports
import { LABELS } from 'constants/labels';
import { TEST_ID, wrapFiat } from './Actions.constants';

// Styles
import styles from './Actions.module.scss';
import classNames from 'classnames/bind';
import { TokenPriceInfo } from '@zero-tech/zns-sdk';

const cx = classNames.bind(styles);

type ActionsProps = {
	domainId?: string;
	buyNowPrice?: number;
	highestBid?: number;
	onMakeBid: () => void;
	onViewBids: () => void;
	yourBid?: Bid;
	isBiddable?: boolean;
	isOwnedByUser?: boolean;
	refetch: () => void;
	bidData?: Bid[];
	paymentTokenInfo: TokenPriceInfo;
};

const Actions = ({
	domainId,
	buyNowPrice,
	highestBid,
	onMakeBid,
	onViewBids,
	yourBid,
	isBiddable,
	isOwnedByUser,
	refetch,
	bidData,
	paymentTokenInfo,
}: ActionsProps) => {
	//- Condition helpers
	const isBidData = bidData && bidData?.length > 0;
	const isYourBids = !isOwnedByUser && Boolean(yourBid);
	const isSetBuyNow = isOwnedByUser === true && Boolean(domainId);
	const isBuyNow = Boolean(buyNowPrice) && !isOwnedByUser && Boolean(domainId);
	const isViewBids =
		isOwnedByUser !== undefined && isBiddable === true && Boolean(isBidData);
	const tokenPriceUsd = paymentTokenInfo.price;

	const highestBidTextValue =
		Boolean(highestBid) && Boolean(tokenPriceUsd)
			? wrapFiat(highestBid! * tokenPriceUsd!)
			: LABELS.NO_BIDS_PLACED;

	const yourBidTextValue =
		yourBid && tokenPriceUsd
			? wrapFiat(Number(formatEther(yourBid.amount)) * tokenPriceUsd)
			: '';

	const placeBidButtonTextValue =
		!yourBid || (yourBid && Number(formatEther(yourBid.amount)) === highestBid)!
			? LABELS.PLACE_A_BID
			: LABELS.REBID;

	const buyNowPriceValue =
		buyNowPrice && tokenPriceUsd
			? wrapFiat(buyNowPrice * tokenPriceUsd)
			: LABELS.NO_BUY_NOW;

	const actions: { [action in ACTION_TYPES]: ActionBlock } = {
		[ACTION_TYPES.BuyNow]: {
			amount: buyNowPrice,
			label: `${LABELS.BUY_NOW} (${paymentTokenInfo.name})`,
			amountUsd: buyNowPriceValue,
			buttonComponent: (isTextButton?: boolean) => (
				<BuyNowButton
					onSuccess={refetch}
					buttonText={LABELS.BUY_NOW}
					domainId={domainId ?? ''}
					paymentTokenInfo={paymentTokenInfo}
					isTextButton={isTextButton}
					className={cx({ TextButton: isTextButton })}
				/>
			),
			isVisible: isBuyNow,
			testId: TEST_ID.BUY_NOW,
		},
		[ACTION_TYPES.SetBuyNow]: {
			amount: buyNowPrice ? buyNowPrice : '-',
			label: `${LABELS.BUY_NOW} (${paymentTokenInfo.name})`,
			amountUsd: buyNowPriceValue,
			buttonComponent: (isTextButton?: boolean) => (
				<SetBuyNowButton
					onSuccess={refetch}
					buttonText={buyNowPrice ? LABELS.EDIT_BUY_NOW : LABELS.SET_BUY_NOW}
					domainId={domainId ?? ''}
					isTextButton={isTextButton}
					className={cx({ TextButton: isTextButton })}
					paymentTokenInfo={paymentTokenInfo}
				/>
			),
			isVisible: isSetBuyNow,
			testId: TEST_ID.SET_BUY_NOW,
		},
		[ACTION_TYPES.Bid]: {
			amount: highestBid ?? '-',
			label: `${LABELS.HIGHEST_BID_LABEL} (${paymentTokenInfo.name})`,
			amountUsd: highestBidTextValue,
			buttonComponent: (isTextButton?: boolean) => {
				if (isOwnedByUser && !isViewBids) return <></>;

				return !isOwnedByUser ? (
					<BidButton
						className={cx({ TextButton: isTextButton })}
						isTextButton={isTextButton}
						glow
						onClick={onMakeBid}
					>
						{placeBidButtonTextValue}
					</BidButton>
				) : (
					<ViewBidsButton
						isTextButton={isTextButton}
						onClick={onViewBids}
						className={cx({ TextButton: isTextButton })}
					/>
				);
			},
			isVisible: isBiddable || isViewBids,
			testId: TEST_ID.BID,
		},
		[ACTION_TYPES.YourBid]: {
			amount: yourBid ? Number(formatEther(yourBid.amount)) : '-',
			label: `${LABELS.YOUR_BID} (${paymentTokenInfo.name})`,
			amountUsd: yourBidTextValue,
			buttonComponent: (isTextButton?: boolean) => (
				<CancelBidButton
					isTextButton
					bidNonce={yourBid?.bidNonce ?? ''}
					paymentTokenInfo={paymentTokenInfo}
					domainId={domainId!}
					onSuccess={refetch}
					className={cx({ TextButton: isTextButton })}
				/>
			),
			isVisible: isYourBids,
			testId: TEST_ID.YOUR_BID,
		},
	};

	/**
	 * Needs to be ordered based on what is important to the user
	 * i.e. Buy Now first for buyers, highest bid for owner
	 */
	const ordered = isOwnedByUser
		? [
				actions[ACTION_TYPES.Bid],
				actions[ACTION_TYPES.BuyNow],
				actions[ACTION_TYPES.SetBuyNow],
		  ]
		: [
				actions[ACTION_TYPES.BuyNow],
				actions[ACTION_TYPES.Bid],
				actions[ACTION_TYPES.YourBid],
		  ];

	const toRender = ordered.filter((a: ActionBlock) => Boolean(a.isVisible));

	return (
		<ul className={styles.Container} data-testid={TEST_ID.CONTAINER}>
			{toRender.map((a: ActionBlock, index: number) => (
				<li
					className={cx({ Border: index === 0 && toRender.length > 2 })}
					data-testid={a.testId}
					key={a.testId}
				>
					<Detail
						text={
							!isNaN(Number(a.amount))
								? Number(a.amount).toLocaleString()
								: a.amount
						}
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
