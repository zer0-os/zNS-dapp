//- Components Imports
import { Wizard, FutureButton } from 'components';

//- Types Imports
import { ethers } from 'ethers';
import { Step } from '../../AcceptBid.types';

//- Constants
import { LABELS } from 'constants/labels';
import { CURRENCY } from 'constants/currency';
import { BUTTONS, MESSAGES } from '../../AcceptBid.constants';

//- Styles Imports
import styles from './Success.module.scss';

type DetailsProps = {
	assetUrl: string;
	creator: string;
	domainName: string;
	title: string;
	highestBid: string;
	onClose: () => void;
};

const Details = ({
	assetUrl,
	creator,
	domainName,
	title,
	highestBid,
	onClose,
}: DetailsProps) => {
	return (
		<>
			<Wizard.NFTDetails
				assetUrl={assetUrl}
				creator={creator}
				domain={domainName}
				title={title}
				otherDetails={[
					// Highest Bid
					{
						name: LABELS.HIGHEST_BID_LABEL,
						value:
							ethers.utils.formatEther(highestBid).toString() +
							` ${CURRENCY.WILD}`,
					},
				]}
			/>
			<div className={styles.SuccessConfirmation}>
				{MESSAGES.SUCCESS_CONFIRMATION}
			</div>
			<div className={styles.CloseButton}>
				<FutureButton glow onClick={() => onClose()}>
					{BUTTONS[Step.Details].PRIMARY}
				</FutureButton>
			</div>
		</>
	);
};

export default Details;
