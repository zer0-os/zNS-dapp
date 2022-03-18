//- Components Imports
import { Wizard } from 'components';

//- Types Imports
import { ethers } from 'ethers';
import { Step } from '../../AcceptBid.types';

//- Constants
import { LABELS } from 'constants/labels';
import { CURRENCY } from 'constants/currency';
import { BUTTONS, MESSAGES } from '../../AcceptBid.constants';

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
	acceptingBid: string;
	highestBid: string;
	wildPriceUsd: string;
	onClose: () => void;
	onNext: () => void;
};

const Details = ({
	assetUrl,
	creator,
	domainName,
	title,
	walletAddress,
	acceptingBid,
	highestBid,
	wildPriceUsd,
	onClose,
	onNext,
}: DetailsProps) => {
	const acceptingBidUsd =
		acceptingBid && Number(acceptingBid) * Number(wildPriceUsd);

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
					// Accepting Bid
					{
						name: LABELS.SELECTED_BID_LABEL,
						value:
							ethers.utils.formatEther(acceptingBid).toString() +
							` ${CURRENCY.WILD}`,
					},
				]}
			/>
			<div className={styles.TextContainer}>
				<p>
					{MESSAGES.CONFIRM_BID_AMOUNT}
					<br />{' '}
					<b>
						{ethers.utils.formatEther(acceptingBid).toString() +
							` ${CURRENCY.WILD}`}
					</b>{' '}
					({toFiat(Number(acceptingBidUsd))} {CURRENCY.USD}) and transfer
					ownership of <b>0://{domainName}</b> to <b>{walletAddress}</b>?
				</p>
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
