//- Components Imports
import { Wizard, FutureButton } from 'components';

//- Types Imports
import { ethers } from 'ethers';
import { Step } from '../../AcceptBid.types';

//- Constants
import { LABELS } from 'constants/labels';
import {
	MESSAGES,
	BUTTONS,
	getConfirmNFTPriceDetails,
	getConfirmNFTDomainDetails,
} from '../../AcceptBid.constants';

//- Styles Imports
import styles from './Details.module.scss';

//-Library Imports
import { toFiat } from 'lib/currency';
import {
	getFormattedHighestBidAmount,
	getFormattedBidAmount,
	truncatedDomain,
} from 'lib/utils';

type DetailsProps = {
	currentStep: Step;
	assetUrl: string;
	creator: string;
	domainName: string;
	title: string;
	bidAmount: string;
	wildPriceUsd?: number;
	walletAddress?: string;
	highestBid?: string;
	onClose: () => void;
	onNext?: () => void;
};

const Details = ({
	currentStep,
	assetUrl,
	creator,
	domainName,
	title,
	bidAmount,
	wildPriceUsd,
	walletAddress,
	highestBid,
	onClose,
	onNext,
}: DetailsProps) => {
	// Price formatting
	const bidAmountUSD =
		bidAmount &&
		wildPriceUsd &&
		Number(ethers.utils.formatEther(bidAmount)) * wildPriceUsd;

	///////////////
	// Functions //
	///////////////
	const formattedHighestBidAmount = getFormattedHighestBidAmount(highestBid);
	const formattedBidAmountWILD = getFormattedBidAmount(bidAmount);
	const formattedDomainName = truncatedDomain(domainName);
	const formattedBidAmountUSD = toFiat(Number(bidAmountUSD));
	const onSubmit = currentStep === Step.Details ? onNext : onClose;
	const onSubmitButtonText =
		currentStep === Step.Details
			? BUTTONS[Step.Details].PRIMARY
			: BUTTONS[Step.Success];

	return (
		<>
			<div className={styles.NFTDetailsContainer}>
				<Wizard.NFTDetails
					assetUrl={assetUrl}
					creator={creator}
					domain={formattedDomainName}
					title={title}
					otherDetails={[
						// Highest Bid
						{
							name: LABELS.HIGHEST_BID_LABEL,
							value: formattedHighestBidAmount,
						},
						// Accepting Bid
						{
							name: LABELS.SELECTED_BID_LABEL,
							value: formattedBidAmountWILD,
						},
					]}
				/>
			</div>

			{/* Details Step */}
			{currentStep === Step.Details && (
				<div className={styles.TextContainer}>
					{getConfirmNFTPriceDetails(
						formattedBidAmountWILD,
						formattedBidAmountUSD,
					)}
					{walletAddress &&
						getConfirmNFTDomainDetails(domainName, walletAddress)}
				</div>
			)}

			{/* Success Step */}
			{currentStep === Step.Success && (
				<div className={styles.SuccessConfirmation}>
					{MESSAGES.SUCCESS_CONFIRMATION}
				</div>
			)}

			{/* Buttons */}
			<div className={styles.Buttons}>
				{currentStep === Step.Details && (
					<FutureButton alt glow onClick={onClose}>
						{BUTTONS[Step.Details].SECONDARY}
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
