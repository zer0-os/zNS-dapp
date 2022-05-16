//-Components Imports
import { Wizard } from 'components';

//-Constants Imports
import { ROOT_DOMAIN } from 'constants/domains';

//-Library Imports
import { ethers } from 'ethers';
import { getNetworkZNA } from 'lib/utils';

//- Types Imports
import { BidData } from '../CancelBid.types';

type DetailsProps = {
	bidData: BidData;
	onClose: () => void;
	onNext: () => void;
};

const Details = ({ bidData, onClose, onNext }: DetailsProps) => {
	const networkDomainName = getNetworkZNA(ROOT_DOMAIN, bidData.domainName);
	return (
		<>
			<Wizard.NFTDetails
				assetUrl={bidData.assetUrl}
				creator={bidData.creator}
				domain={networkDomainName}
				title={bidData.title}
				otherDetails={[
					{
						name: 'Highest Bid',
						value:
							ethers.utils.formatEther(bidData.highestBid).toString() + ' WILD',
					},
					{
						name: 'Your Bid',
						value:
							ethers.utils.formatEther(bidData.yourBid).toString() + ' WILD',
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
};

export default Details;
