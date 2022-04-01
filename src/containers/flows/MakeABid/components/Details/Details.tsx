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
import { formatBidAmount } from 'lib/utils';
import { DomainBidData } from 'lib/utils/bids';
import { toFiat } from 'lib/currency';

//- Utils Imports
import { getBidToHighWarning, getUsdFiatEstimation } from './Details.utils';

type DetailsProps = {
	stepContent: StepContent;
	bidData?: DomainBidData | undefined;
	assetUrl: string;
	creator: string;
	domainName: string;
	title: string;
	wildBalance: number;
	isModalOpen?: boolean;
	wildPriceUsd?: number;
	walletAddress?: string;
	highestBid?: string;
	error?: string;
	bid: string;
	isBidValid?: boolean;
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
	wildBalance,
	wildPriceUsd,
	highestBid,
	error,
	bid,
	isBidValid,
	setBid,
	onClose,
	onConfirm,
}: DetailsProps) => {
	// State
	const [isModalOpen, setIsModalOpen] = useState(false);
	// Format numbers
	const formattedHighestBidAmount = formatBidAmount(highestBid);
	const formattedBidAmountWILD = getBidAmountText(bid);
	// Balance loading
	const loadingWildBalance = wildBalance === undefined;
	// Step content
	const onSubmitButtonText =
		stepContent === StepContent.Details
			? error
				? BUTTONS[StepContent.Details].TERTIARY
				: BUTTONS[StepContent.Details].PRIMARY
			: BUTTONS[StepContent.Success];
	const bidString =
		isBidValid && wildPriceUsd
			? toFiat(parseFloat(bid) * wildPriceUsd)
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
					wildPriceUsd={wildPriceUsd}
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
								stepContent === StepContent.Success
									? formattedBidAmountWILD
									: '',
						},
					]}
				/>
			</div>

			{/* Details Step */}
			{stepContent === StepContent.Details && (
				<div className={styles.PlaceBidContainer}>
					<div className={styles.TextContainer}>{MESSAGES.ENTER_AMOUNT}</div>
					<span className={styles.Estimate}>{getWildBalance(wildBalance)}</span>
					<form onSubmit={onConfirm}>
						<TextInput
							numeric
							text={bid}
							error={Boolean(error)}
							className={styles.TextInput}
							onChange={(text: string) => setBid && setBid(text)}
							placeholder={PLACE_BID_LABELS.INPUT_PLACEHOLDER}
						/>
					</form>
					{getUsdFiatEstimation(bidString, wildPriceUsd)}
					{getBidToHighWarning(loadingWildBalance, bid, wildBalance)}
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
						<FutureButton alt glow onClick={onClose}>
							{BUTTONS[StepContent.Details].SECONDARY}
						</FutureButton>

						<FutureButton
							glow={isBidValid && Number(bid) < wildBalance!}
							disabled={isBidValid && Number(bid) > wildBalance!}
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
