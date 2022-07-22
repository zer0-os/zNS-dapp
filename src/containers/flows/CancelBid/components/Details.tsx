import { ConvertedTokenInfo } from '@zero-tech/zns-sdk';
import { Wizard } from 'components';
import { ethers } from 'ethers';
import { BidData } from '../CancelBid.types';
import styles from './Details.module.scss';

type DetailsProps = {
	bidData: BidData;
	paymentTokenInfo: ConvertedTokenInfo;
	onClose: () => void;
	onNext: () => void;
};

const Details = ({
	bidData,
	onClose,
	onNext,
	paymentTokenInfo,
}: DetailsProps) => (
	<div className={styles.NFTDetailsContainer}>
		<Wizard.NFTDetails
			assetUrl={bidData.assetUrl}
			creator={bidData.creator}
			domain={bidData.domainName}
			title={bidData.title}
			otherDetails={[
				{
					name: 'Highest Bid',
					value:
						ethers.utils.formatEther(bidData.highestBid).toString() +
						' ' +
						paymentTokenInfo.symbol,
				},
				{
					name: 'Your Bid',
					value:
						ethers.utils.formatEther(bidData.yourBid).toString() +
						' ' +
						paymentTokenInfo.symbol,
				},
			]}
		/>
		<Wizard.Buttons
			primaryButtonText="Confirm"
			onClickPrimaryButton={onNext}
			onClickSecondaryButton={onClose}
		/>
	</div>
);

export default Details;
