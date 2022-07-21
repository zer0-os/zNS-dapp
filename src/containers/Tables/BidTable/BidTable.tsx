//- React Imports
import { memo, useState } from 'react';

//- Component Imports
import BidTableRow from './BidTableRow/BidTableRow';
import { GenericTable, Overlay } from 'components';
import BidTableCard from './BidTableCard/BidTableCard';

//- Containers Imports
import { CancelBid, MakeABid } from 'containers';

//- Hooks Import
import useBidTableData from './hooks/useBidTableData';

//- Types Imports
import { BidTableData } from './BidTable.types';

//- Constants Imports
import { Messages, Headers, Modal } from './BidTable.constants';

const BidTable = () => {
	const { isLoading, bidData, refetch } = useBidTableData();
	const [modal, setModal] = useState<Modal | undefined>();
	const [selectedBid, setSelectedBid] = useState<BidTableData>();

	const openMakeBid = (bid: BidTableData) => {
		setSelectedBid(bid);
		setModal(Modal.MAKE_A_BID);
	};

	const openCancelBid = (bid: BidTableData) => {
		setSelectedBid(bid);
		setModal(Modal.CANCEL);
	};

	const closeModal = () => {
		setModal(undefined);
		setSelectedBid(undefined);
	};

	return (
		<>
			{modal === Modal.MAKE_A_BID && selectedBid && (
				<MakeABid
					domain={selectedBid.domain}
					onBid={refetch}
					onClose={() => setModal(undefined)}
					paymentTokenInfo={selectedBid.paymentTokenInfo}
				/>
			)}
			{modal === Modal.CANCEL && selectedBid && (
				<Overlay onClose={() => setModal(undefined)} open>
					<CancelBid
						bidNonce={selectedBid.bidNonce}
						domainId={selectedBid.domainId}
						onSuccess={refetch}
						onClose={closeModal}
						paymentTokenInfo={selectedBid.paymentTokenInfo}
					/>
				</Overlay>
			)}
			<GenericTable
				alignments={[0, 1, 1, 1, 1, 0, 0]}
				data={bidData}
				headers={Headers}
				infiniteScroll
				isLoading={isLoading}
				itemKey={'id'}
				loadingText={Messages.LOADING}
				emptyText={Messages.EMPTY}
				isSingleGridColumn
				notSearchable
				rowComponent={(props: any) => (
					<BidTableRow
						{...props}
						openMakeBid={openMakeBid}
						openCancelBid={openCancelBid}
						refetch={refetch}
					/>
				)}
				gridComponent={(props: any) => (
					<BidTableCard
						{...props}
						openMakeBid={openMakeBid}
						openCancelBid={openCancelBid}
						refetch={refetch}
					/>
				)}
				refetch={refetch}
			/>
		</>
	);
};

export default memo(BidTable);
