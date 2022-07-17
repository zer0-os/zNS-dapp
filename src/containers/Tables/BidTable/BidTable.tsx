//- React Imports
import { useMemo, useState } from 'react';

//- Component Imports
import BidTableRow from './BidTableRow/BidTableRow';
import { GenericTable, Overlay } from 'components';
import BidTableCard from './BidTableCard/BidTableCard';

//- Container Imports
import { CancelBid, MakeABid } from 'containers';

//- Types Imports
import { BidTableData } from './BidTable.types';

//- Constants Imports
import { Messages, Modal, Headers } from './BidTable.constants';

type BidTableProps = {
	bidData?: BidTableData[];
	isLoading: boolean;
	refetch: () => void;
};

const BidTable = ({ bidData, isLoading, refetch }: BidTableProps) => {
	/**
	 * NOTE: Modals are currently in this file - they were previously
	 * in the row, but refetch was killing any modal.
	 */
	const [modal, setModal] = useState<Modal | undefined>();
	const [selectedBid, setSelectedBid] = useState<BidTableData | undefined>();

	const openMakeBid = (bid: BidTableData) => {
		setSelectedBid(bid);
		setModal(Modal.Bid);
	};

	const openCancelBid = (bid: BidTableData) => {
		setSelectedBid(bid);
		setModal(Modal.Cancel);
	};

	const closeModal = () => {
		setModal(undefined);
		setSelectedBid(undefined);
	};

	const ModalElement = useMemo(() => {
		if (!selectedBid) {
			return;
		}
		switch (modal) {
			case Modal.Bid:
				return (
					<MakeABid
						domain={selectedBid.domain}
						paymentTokenInfo={selectedBid.paymentTokenInfo}
						onBid={refetch}
						onClose={closeModal}
					/>
				);
			case Modal.Cancel:
				return (
					<Overlay centered open onClose={closeModal}>
						<CancelBid
							bidNonce={selectedBid.bidNonce}
							domainId={selectedBid.domainId}
							onSuccess={refetch}
							onClose={closeModal}
							paymentTokenInfo={selectedBid.paymentTokenInfo}
						/>
					</Overlay>
				);
		}
	}, [selectedBid, modal, refetch]);

	return (
		<>
			{ModalElement}
			<GenericTable
				alignments={[0, 1, 1, 1, 1, 0, 0]}
				data={bidData}
				headers={Headers}
				infiniteScroll
				isLoading={isLoading}
				itemKey="id"
				loadingText={Messages.LOADING}
				emptyText={Messages.EMPTY}
				isSingleGridColumn
				notSearchable
				rowComponent={(props: any) => (
					<BidTableRow
						{...props}
						onRefetch={refetch}
						openMakeBid={openMakeBid}
						openCancelBid={openCancelBid}
					/>
				)}
				gridComponent={(props: any) => (
					<BidTableCard
						{...props}
						onRefetch={refetch}
						openMakeBid={openMakeBid}
						openCancelBid={openCancelBid}
					/>
				)}
			/>
		</>
	);
};

export default BidTable;
