//- Components Imports
import { Member, Wizard } from 'components';

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
	getConfirmNFTPriceDetails,
	getConfirmNFTDomainDetails,
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
	const formattedBidAmountWILD = getFormattedBidAmount(bidAmount);
	const formattedDomainName = truncatedDomain(domainName);
	const formattedBidAmountUSD = toFiat(Number(bidAmountUSD));

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
						value: formattedBidAmountWILD,
					},
				]}
			/>
			<div className={styles.TextContainer}>
				{getConfirmNFTPriceDetails(
					formattedBidAmountWILD,
					formattedBidAmountUSD,
				)}

				{getConfirmNFTDomainDetails(domainName, walletAddress)}
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
