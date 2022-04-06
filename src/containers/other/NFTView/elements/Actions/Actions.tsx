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
import { Maybe, Metadata } from 'lib/types';
import { Domain } from '@zero-tech/zns-sdk/lib/types';
import { ethers } from 'ethers';

//- Types Imports
import { ActionBlock, ACTION_TYPES } from './Actions.types';

//- Constants Imports
import { LABELS } from 'constants/labels';
import { CURRENCY } from 'constants/currency';
import { TEST_ID, wrapFiat } from './Actions.constants';

// Styles
import styles from './Actions.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

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

	// Convert highest bid as wei
	const highestBidAsWei =
		highestBid && ethers.utils.parseEther(highestBid.toString()).toString();

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
		[ACTION_TYPES.Bid]: {
			amount: highestBid ?? '-',
			label: `${LABELS.HIGHEST_BID_LABEL} (${CURRENCY.WILD})`,
			amountUsd: highestBidTextValue,
			buttonComponent: (isTextButton?: boolean) => {
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
						bids={bidData}
						domain={domain}
						isTextButton={isTextButton}
						highestBidAsWei={String(highestBidAsWei)}
						refetch={refetch}
						isLoading={isLoading}
						className={cx({ TextButton: isTextButton })}
						domainMetadata={domainMetadata}
						setIsViewBidsOpen={setIsViewBidsOpen}
						isViewBidsOpen={isViewBidsOpen}
					/>
				);
			},
			isVisible: isPlaceBid || isViewBids,
			testId: TEST_ID.BID,
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
