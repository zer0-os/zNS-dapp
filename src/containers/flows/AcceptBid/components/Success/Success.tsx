//- Components Imports
import { Wizard, FutureButton } from 'components';

//- Types Imports
import { Step } from '../../AcceptBid.types';

//- Constants
import { LABELS } from 'constants/labels';
import { BUTTONS, MESSAGES } from '../../AcceptBid.constants';

//- Styles Imports
import styles from './Success.module.scss';
import {
	getFormattedBidAmount,
	getFormattedHighestBidAmount,
	truncatedDomain,
} from '../utils';

type DetailsProps = {
	assetUrl: string;
	creator: string;
	domainName: string;
	title: string;
	bidAmount: string;
	highestBid?: string;
	onClose: () => void;
};

const Details = ({
	assetUrl,
	creator,
	domainName,
	title,
	bidAmount,
	highestBid,
	onClose,
}: DetailsProps) => {
	// Formatted price
	const formattedHighestBidAmount = getFormattedHighestBidAmount(highestBid);
	const formattedBidAmount = getFormattedBidAmount(bidAmount);

	const formattedDomainName = truncatedDomain(domainName);

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
			<div className={styles.SuccessConfirmation}>
				{MESSAGES.SUCCESS_CONFIRMATION}
			</div>
			<div className={styles.CloseButton}>
				<FutureButton glow onClick={() => onClose()}>
					{BUTTONS[Step.Success].PRIMARY}
				</FutureButton>
			</div>
		</>
	);
};

export default Details;
