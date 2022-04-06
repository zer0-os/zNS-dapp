//- Component Imports
import { Overlay } from 'components';

//- Library Imports
import { DomainBidData } from 'lib/utils/bids';

//- Container Imports
import BidList from 'containers/lists/BidList/BidList';

interface getModalProps {
	setIsModalOpen: (state: boolean) => void;
	isModalOpen: boolean;
	bidData: DomainBidData | undefined;
	wildPriceUsd?: number;
}

export const Modals = ({
	setIsModalOpen,
	isModalOpen,
	bidData,
	wildPriceUsd,
}: getModalProps) => {
	if (isModalOpen && bidData?.bids !== undefined) {
		return (
			<Overlay open onClose={() => setIsModalOpen(false)} centered>
				<BidList bids={bidData.bids} wildPriceUsd={wildPriceUsd} />
			</Overlay>
		);
	} else {
		return <></>;
	}
};

export default Modals;
