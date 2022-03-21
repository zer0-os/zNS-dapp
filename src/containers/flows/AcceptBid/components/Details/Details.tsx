//- Components Imports
import { Wizard } from 'components';

//- Types Imports
import { ethers } from 'ethers';
import { Step } from '../../AcceptBid.types';

//- Utils Imports
import {
	getFormattedBidAmount,
	getFormattedHighestBidAmount,
	truncatedAddress,
	truncatedDomain,
} from '../utils';

//- Constants
import { LABELS } from 'constants/labels';
import { CURRENCY } from 'constants/currency';
import {
	BUTTONS,
	getNFTConfirmDetailsText,
	MESSAGES,
} from '../../AcceptBid.constants';

//- Styles Imports
import styles from './Details.module.scss';

//-Library Imports
import { toFiat } from 'lib/currency';

type DetailsProps = {
	assetUrl: string;
	creator: string;
	domainName: string;
	title: string;
	walletAddress: string;
	bidAmount: string;
	wildPriceUsd?: number;
	highestBid?: string;
	onClose: () => void;
	onNext: () => void;
};

const Details = ({
	assetUrl,
	creator,
	domainName,
	title,
	walletAddress,
	bidAmount,
	wildPriceUsd,
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
	const formattedBidAmount = getFormattedBidAmount(bidAmount);
	const formattedDomainName = truncatedDomain(domainName);
	const formattedDomainAddress = truncatedAddress(walletAddress);

	return (
		<>
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
						value: formattedBidAmount,
					},
				]}
			/>
			<div className={styles.TextContainer}>
				{MESSAGES.CONFIRM_BID_AMOUNT}
				{` $${toFiat(Number(bidAmountUSD)) + ' ' + CURRENCY.USD} `}
				<div>
					{getNFTConfirmDetailsText(domainName)}
					{formattedDomainAddress}?
				</div>
			</div>
			<Wizard.Buttons
				primaryButtonText={BUTTONS[Step.Details].PRIMARY}
				secondaryButtonText={BUTTONS[Step.Details].SECONDARY}
				onClickPrimaryButton={onNext}
				onClickSecondaryButton={onClose}
			/>
		</>
	);
};

export default Details;
