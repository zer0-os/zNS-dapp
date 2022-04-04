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
import { toFiat } from 'lib/currency';
import { formatEther } from '@ethersproject/units';
import { Bid } from '@zero-tech/zns-sdk/lib/zAuction';
import { Maybe, Metadata } from 'lib/types';
import { Domain } from '@zero-tech/zns-sdk/lib/types';

//- Constants Imports
import { LABELS } from 'constants/labels';
import { CURRENCY } from 'constants/currency';

// Styles
import styles from './Actions.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

enum ACTION_TYPES {
	BuyNow,
	SetBuyNow,
	PlaceBid,
	YourBid,
	ViewBids,
}

export const TEST_ID = {
	CONTAINER: 'actions-container',
	BUY_NOW: 'actions-buy-now',
	SET_BUY_NOW: 'actions-set-buy-now',
	PLACE_BID: 'actions-place-bid',
	YOUR_BID: 'actions-your-bid',
	VIEW_BIDS: 'actions-view-bids',
};

type ActionBlock = {
	amount: number | string | undefined;
	label: string;
	amountUsd: string;
	buttonComponent: (isTextButton?: boolean) => JSX.Element;
	isVisible: boolean;
	shouldShowBorder?: boolean;
	testId: string;
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
	bidData?: Bid[];
	isLoading?: boolean;
	domainMetadata?: Maybe<Metadata>;
	domain?: Domain;
	setIsViewBidsOpen?: (state: boolean) => void;
	isViewBidsOpen?: boolean;
	setIsSetBuyNowOpen?: (state: boolean) => void;
	isSetBuyNowOpen?: boolean;
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
	bidData,
	isLoading,
	domainMetadata,
	domain,
	setIsViewBidsOpen,
	isViewBidsOpen,
	setIsSetBuyNowOpen,
	isSetBuyNowOpen,
}: ActionsProps) => {
	//- Condition helpers
	const isBidData = bidData && bidData?.length > 0;
	const isYourBids = !isOwnedByUser && Boolean(yourBid);
	const isPlaceBid = !isOwnedByUser && isBiddable === true;
	const isSetBuyNow = isOwnedByUser === true && Boolean(domainId);
	const isBuyNow = Boolean(buyNowPrice) && !isOwnedByUser && Boolean(domainId);
	const isViewBids =
		isOwnedByUser !== undefined && isBiddable === true && Boolean(isBidData);

	const highestBidTextValue =
		Boolean(highestBid) && Boolean(wildPriceUsd)
			? wrapFiat(highestBid! * wildPriceUsd!)
			: LABELS.NO_BIDS_PLACED;

	const yourBidTextValue =
		yourBid && wildPriceUsd
			? wrapFiat(Number(formatEther(yourBid.amount)) * wildPriceUsd)
			: '';

	const placeBidButtonTextValue =
		!yourBid || (yourBid && Number(formatEther(yourBid.amount)) === highestBid)!
			? LABELS.PLACE_A_BID
			: LABELS.REBID;

	const buyNowPriceValue =
		buyNowPrice && wildPriceUsd
			? wrapFiat(buyNowPrice * wildPriceUsd)
			: LABELS.NO_BUY_NOW;

	/**
	 * This is a pretty messy structure - could be refactored moving forward
	 */
	const actions: { [action in ACTION_TYPES]: ActionBlock } = {
		[ACTION_TYPES.BuyNow]: {
			amount: buyNowPrice,
			label: `${LABELS.BUY_NOW} (${CURRENCY.WILD})`,
			amountUsd: buyNowPriceValue,
			buttonComponent: (isTextButton?: boolean) => (
				<BuyNowButton
					onSuccess={refetch}
					buttonText={LABELS.BUY_NOW}
					domainId={domainId ?? ''}
					isTextButton={isTextButton}
					className={cx({ TextButton: isTextButton })}
				/>
			),
			isVisible: isBuyNow,
			testId: TEST_ID.BUY_NOW,
		},
		[ACTION_TYPES.SetBuyNow]: {
			amount: buyNowPrice ? buyNowPrice : '-',
			label: `${LABELS.BUY_NOW} (${CURRENCY.WILD})`,
			amountUsd: buyNowPriceValue,
			buttonComponent: (isTextButton?: boolean) => (
				<SetBuyNowButton
					onSuccess={refetch}
					buttonText={buyNowPrice ? LABELS.EDIT_BUY_NOW : LABELS.SET_BUY_NOW}
					domainId={domainId ?? ''}
					isTextButton={isTextButton}
					className={cx({ TextButton: isTextButton })}
					setIsSetBuyNowOpen={setIsSetBuyNowOpen}
					isSetBuyNowOpen={isSetBuyNowOpen}
				/>
			),
			isVisible: isSetBuyNow,
			testId: TEST_ID.SET_BUY_NOW,
		},
		[ACTION_TYPES.PlaceBid]: {
			amount: highestBid ?? '-',
			label: `${LABELS.HIGHEST_BID_LABEL} (${CURRENCY.WILD})`,
			amountUsd: highestBidTextValue,
			buttonComponent: (isTextButton?: boolean) => (
				<BidButton
					className={cx({ TextButton: isTextButton })}
					isTextButton={isTextButton}
					glow
					onClick={onMakeBid}
				>
					{placeBidButtonTextValue}
				</BidButton>
			),
			isVisible: isPlaceBid,
			testId: TEST_ID.PLACE_BID,
		},
		[ACTION_TYPES.YourBid]: {
			amount: yourBid ? Number(formatEther(yourBid.amount)) : '-',
			label: `${LABELS.YOUR_BID} (${CURRENCY.WILD})`,
			amountUsd: yourBidTextValue,
			buttonComponent: (isTextButton?: boolean) => (
				<CancelBidButton
					isTextButton
					bidNonce={yourBid?.bidNonce ?? ''}
					domainId={domainId!}
					onSuccess={refetch}
					className={cx({ TextButton: isTextButton })}
				/>
			),
			isVisible: isYourBids,
			testId: TEST_ID.YOUR_BID,
		},
		[ACTION_TYPES.ViewBids]: {
			amount: highestBid ?? '-',
			label: `${LABELS.HIGHEST_BID_LABEL} (${CURRENCY.WILD})`,
			amountUsd: highestBidTextValue,
			buttonComponent: (isTextButton?: boolean) => (
				<ViewBidsButton
					bids={bidData}
					domain={domain}
					isTextButton={isTextButton}
					highestBid={highestBid}
					refetch={refetch}
					isLoading={isLoading}
					className={cx({ TextButton: isTextButton })}
					domainMetadata={domainMetadata}
					setIsViewBidsOpen={setIsViewBidsOpen}
					isViewBidsOpen={isViewBidsOpen}
				/>
			),
			isVisible: isViewBids,
			testId: TEST_ID.VIEW_BIDS,
		},
	};

	/**
	 * Needs to be ordered based on what is important to the user
	 * i.e. Buy Now first for buyers, highest bid for owner
	 */
	const ordered = isOwnedByUser
		? [
				actions[ACTION_TYPES.ViewBids],
				actions[ACTION_TYPES.BuyNow],
				actions[ACTION_TYPES.SetBuyNow],
		  ]
		: [
				actions[ACTION_TYPES.BuyNow],
				actions[ACTION_TYPES.PlaceBid],
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
