import BidTableRow, { BidTableRowData } from './BidTableRow';
import { GenericTable, Overlay } from 'components';
import { useMemo, useState } from 'react';
import { CancelBid, MakeABid } from 'containers';

type BidTableProps = {
	bidData?: BidTableRowData[];
	isLoading: boolean;
	refetch: () => void;
};

export const HEADERS = [
	{
		label: 'Domain',
		accessor: '',
		className: 'domain',
	},
	{
		label: 'Your Bid',
		accessor: '',
		className: '',
	},
	{
		label: 'Top Bid',
		accessor: '',
		className: '',
	},
	{
		label: '',
		accessor: '',
		className: '',
	},
];

export enum Modal {
	Bid,
	Cancel,
}

const BidTable = ({ bidData, isLoading, refetch }: BidTableProps) => {
	/**
	 * NOTE: Modals are currently in this file - they were previously
	 * in the row, but refetch was killing any modal.
	 */
	const [modal, setModal] = useState<Modal | undefined>();
	const [selectedBid, setSelectedBid] = useState<BidTableRowData | undefined>();

	const openMakeBid = (bid: BidTableRowData) => {
		setSelectedBid(bid);
		setModal(Modal.Bid);
	};

	const openCancelBid = (bid: BidTableRowData) => {
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
				headers={HEADERS}
				infiniteScroll
				isLoading={isLoading}
				itemKey={'id'}
				loadingText={'Loading Your Bids'}
				notSearchable
				rowComponent={(props: any) => (
					<BidTableRow
						{...props}
						onRefetch={refetch}
						openMakeBid={openMakeBid}
						openCancelBid={openCancelBid}
					/>
				)}
				emptyText={'You have not placed any bids.'}
			/>
		</>
	);
};

export default BidTable;
