//- Component Imports
import { Overlay } from 'components';

//- Library Imports
import { DomainBidData } from 'lib/utils/bids';

//- Container Imports
import BidList from 'containers/lists/BidList/BidList';
import { TokenPriceInfo } from '@zero-tech/zns-sdk';

interface getModalProps {
	setIsModalOpen: (state: boolean) => void;
	isModalOpen: boolean;
	bidData: DomainBidData | undefined;
	paymentTokenInfo: TokenPriceInfo;
}

export const Modals = ({
	setIsModalOpen,
	isModalOpen,
	bidData,
	paymentTokenInfo,
}: getModalProps) => {
	if (isModalOpen && bidData?.bids !== undefined) {
		return (
			<Overlay open onClose={() => setIsModalOpen(false)} centered>
				<BidList bids={bidData.bids} paymentTokenInfo={paymentTokenInfo} />
			</Overlay>
		);
	} else {
		return <></>;
	}
};

export default Modals;
