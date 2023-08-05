//- Components Imports
import { FutureButton, Wizard } from 'components';

//- Types Imports
import { ethers } from 'ethers';
import { StepContent } from '../../AcceptBid.types';

//- Constants
import { Labels } from 'constants/labels';
import {
	BUTTONS,
	getConfirmNFTDomainDetails,
	getConfirmNFTPriceDetails,
	MESSAGES,
} from '../../AcceptBid.constants';

//- Styles Imports
import styles from './Details.module.scss';

//-Library Imports
import { toFiat } from 'lib/currency';
import { formatBidAmount } from 'lib/utils';
import { ConvertedTokenInfo } from '@zero-tech/zns-sdk';

type DetailsProps = {
	stepContent: StepContent;
	assetUrl: string;
	creator: string;
	domainName: string;
	title: string;
	bidAmount: string;
	walletAddress?: string;
	highestBid?: string;
	error?: string;
	paymentTokenInfo: ConvertedTokenInfo;
	onClose: () => void;
	onNext?: () => void;
};

const Details = ({
	stepContent,
	assetUrl,
	creator,
	domainName,
	title,
	bidAmount,
	walletAddress,
	highestBid,
	error,
	onClose,
	onNext,
	paymentTokenInfo,
}: DetailsProps) => {
	// Price formatting
	const bidAmountUSD =
		bidAmount &&
		paymentTokenInfo.priceInUsd &&
		Number(ethers.utils.formatEther(bidAmount)) *
			Number(paymentTokenInfo.priceInUsd);

	///////////////
	// Functions //
	///////////////
	const formattedHighestBidAmount = formatBidAmount(
		highestBid,
		paymentTokenInfo.symbol,
	);
	const formattedBidAmount = formatBidAmount(
		bidAmount,
		paymentTokenInfo.symbol,
	);
	const formattedBidAmountUSD = toFiat(Number(bidAmountUSD));
	const onSubmit = stepContent === StepContent.Details ? onNext : onClose;
	const onSubmitButtonText =
		stepContent === StepContent.Details
			? error
				? BUTTONS[StepContent.Details].TERTIARY
				: BUTTONS[StepContent.Details].PRIMARY
			: BUTTONS[StepContent.Success];

	return (
		<>
			<div className={styles.NFTDetailsContainer}>
				<Wizard.NFTDetails
					assetUrl={assetUrl}
					creator={creator}
					domain={domainName}
					title={title}
					otherDetails={[
						// Highest Bid
						{
							name: Labels.HIGHEST_BID_LABEL,
							value: formattedHighestBidAmount,
						},
						// Accepting Bid
						{
							name:
								stepContent === StepContent.Details
									? Labels.SELECTED_BID_LABEL
									: Labels.ACCEPTED_BID_LABEL,
							value: formattedBidAmount,
						},
					]}
				/>
			</div>

			{/* Details Step */}
			{stepContent === StepContent.Details && (
				<div className={styles.TextContainer}>
					{getConfirmNFTPriceDetails(formattedBidAmount, formattedBidAmountUSD)}
					{walletAddress &&
						getConfirmNFTDomainDetails(domainName, walletAddress)}
				</div>
			)}

			{/* Success Step */}
			{stepContent === StepContent.Success && (
				<div className={styles.SuccessConfirmation}>
					{MESSAGES.SUCCESS_CONFIRMATION}
				</div>
			)}

			{error && error !== undefined && (
				<div className={styles.Error}>{error}</div>
			)}

			{/* Buttons */}
			<div className={styles.Buttons}>
				{stepContent === StepContent.Details && (
					<FutureButton alt glow onClick={onClose}>
						{BUTTONS[StepContent.Details].SECONDARY}
					</FutureButton>
				)}
				<FutureButton glow onClick={onSubmit}>
					{onSubmitButtonText}
				</FutureButton>
			</div>
		</>
	);
};

export default Details;
