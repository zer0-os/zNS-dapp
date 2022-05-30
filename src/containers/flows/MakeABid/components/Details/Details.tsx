//- React Imports
import { useState } from 'react';

//- Components Imports
import { Wizard, FutureButton, TextInput } from 'components';
import { Modals } from '../Modals';

//- Types Imports
import { StepContent } from '../../MakeABid.types';

//- Constants
import { LABELS } from 'constants/labels';

import {
	MESSAGES,
	BUTTONS,
	PLACE_BID_LABELS,
	getWildBalance,
	getBidAmountText,
} from '../../MakeABid.constants';

//- Styles Imports
import styles from './Details.module.scss';

//-Library Imports
import { formatBidAmount, replaceWildWithProperToken } from 'lib/utils';
import { DomainBidData } from 'lib/utils/bids';
import { toFiat } from 'lib/currency';

//- Utils Imports
import { getBidTooHighWarning, getUsdFiatEstimation } from './Details.utils';
import { PaymentTokenInfo } from 'lib/types';

type DetailsProps = {
	stepContent: StepContent;
	bidData?: DomainBidData | undefined;
	assetUrl: string;
	creator: string;
	domainName: string;
	title: string;
	tokenBalance: number;
	isModalOpen?: boolean;
	walletAddress?: string;
	highestBid?: string;
	error?: string;
	bid: string;
	isBidValid?: boolean;
	paymentTokenInfo: PaymentTokenInfo;
	setBid?: (bid: string) => void;
	onClose: () => void;
	onConfirm?: () => void;
};

const Details = ({
	stepContent,
	bidData,
	assetUrl,
	creator,
	domainName,
	title,
	tokenBalance,
	highestBid,
	error,
	bid,
	isBidValid,
	paymentTokenInfo,
	setBid,
	onClose,
	onConfirm,
}: DetailsProps) => {
	// State
	const [isModalOpen, setIsModalOpen] = useState(false);
	// Format numbers
	const formattedHighestBidAmount = formatBidAmount(
		highestBid,
		paymentTokenInfo.name,
	);
	const formattedBidAmount = getBidAmountText(bid, paymentTokenInfo.name);
	// Balance loading
	const loadingTokenBalance = tokenBalance === undefined;
	// Step content
	const onSubmitButtonText =
		stepContent === StepContent.Details
			? error
				? BUTTONS[StepContent.Details].TERTIARY
				: BUTTONS[StepContent.Details].PRIMARY
			: BUTTONS[StepContent.Success];
	const bidString =
		isBidValid && paymentTokenInfo.price
			? toFiat(parseFloat(bid) * paymentTokenInfo.price)
			: PLACE_BID_LABELS.ZERO_VALUE;
	const onSubmit = stepContent === StepContent.Details ? onConfirm : onClose;

	/////////////////////
	// React Fragments //
	/////////////////////

	return (
		<>
			{isModalOpen && (
				<Modals
					setIsModalOpen={setIsModalOpen}
					isModalOpen={isModalOpen}
					bidData={bidData}
					paymentTokenInfo={paymentTokenInfo}
				/>
			)}
			<div className={styles.NFTDetailsContainer}>
				<Wizard.NFTDetails
					assetUrl={assetUrl}
					creator={creator}
					domain={domainName}
					title={title}
					hasViewAllBids
					setIsModalOpen={setIsModalOpen}
					bidData={bidData}
					otherDetails={[
						// Highest Bid
						{
							name: LABELS.HIGHEST_BID_LABEL,
							value: formattedHighestBidAmount,
						},
						{
							name:
								stepContent === StepContent.Success
									? PLACE_BID_LABELS.YOUR_BID
									: '',
							value:
								stepContent === StepContent.Success ? formattedBidAmount : '',
						},
					]}
				/>
			</div>

			{stepContent === StepContent.Details && tokenBalance === 0 && (
				<div className={styles.Error}>
					You do not have enough {paymentTokenInfo.name} tokens to place a bid
					on this domain.
				</div>
			)}

			{/* Details Step */}
			{stepContent === StepContent.Details && tokenBalance > 0 && (
				<div className={styles.PlaceBidContainer}>
					<div className={styles.TextContainer}>{MESSAGES.ENTER_AMOUNT}</div>
					<span className={styles.Estimate}>
						{getWildBalance(tokenBalance, paymentTokenInfo.name)}
					</span>
					<form onSubmit={onConfirm}>
						<TextInput
							numeric
							text={bid}
							error={Boolean(error)}
							className={styles.TextInput}
							onChange={(text: string) => setBid && setBid(text)}
							placeholder={replaceWildWithProperToken(
								PLACE_BID_LABELS.INPUT_PLACEHOLDER,
								paymentTokenInfo.name,
							)}
						/>
					</form>
					{getUsdFiatEstimation(bidString, paymentTokenInfo.price)}
					{getBidTooHighWarning(
						loadingTokenBalance,
						bid,
						tokenBalance,
						paymentTokenInfo.name,
					)}
				</div>
			)}

			{/* Success Step */}
			{stepContent === StepContent.Success && (
				<div className={styles.SuccessConfirmation}>
					{MESSAGES.SUCCESSFUL_BID}
				</div>
			)}

			{error !== undefined && <div className={styles.Error}>{error}</div>}

			{/* Buttons */}
			<div className={styles.Buttons}>
				{stepContent === StepContent.Details && (
					<>
						<FutureButton
							glow={isBidValid && Number(bid) < tokenBalance!}
							disabled={isBidValid && Number(bid) > tokenBalance!}
							onClick={onSubmit}
						>
							{onSubmitButtonText}
						</FutureButton>
					</>
				)}
				{stepContent === StepContent.Success && (
					<>
						<FutureButton glow onClick={onSubmit}>
							{onSubmitButtonText}
						</FutureButton>
					</>
				)}
			</div>
		</>
	);
};

export default Details;
