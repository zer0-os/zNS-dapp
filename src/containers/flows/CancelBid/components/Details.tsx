import { Wizard } from 'components';
import { ethers } from 'ethers';
import { PaymentTokenInfo } from 'lib/types';
import { BidData } from '../CancelBid.types';

type DetailsProps = {
	bidData: BidData;
	paymentTokenInfo: PaymentTokenInfo;
	onClose: () => void;
	onNext: () => void;
};

const Details = ({
	bidData,
	onClose,
	onNext,
	paymentTokenInfo,
}: DetailsProps) => (
	<>
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
						paymentTokenInfo.name,
				},
				{
					name: 'Your Bid',
					value:
						ethers.utils.formatEther(bidData.yourBid).toString() +
						' ' +
						paymentTokenInfo.name,
				},
			]}
		/>
		<Wizard.Buttons
			primaryButtonText="Confirm"
			onClickPrimaryButton={onNext}
			onClickSecondaryButton={onClose}
		/>
	</>
);

export default Details;
