//- Container Props Imports
import { MakeABidProps } from 'containers/flows/MakeABid/MakeABid';

export enum NFTViewModalType {
	NULL_MODAL_TYPE,
	MAKE_A_BID,
}

export type MakeABidContentProps = Omit<MakeABidProps, 'closeModal'>;

interface NullContent {
	modalType: NFTViewModalType.NULL_MODAL_TYPE;
}

interface MakeABidContent {
	modalType: NFTViewModalType.MAKE_A_BID;
	contentProps: MakeABidContentProps;
}

export type NFTViewModalContent = NullContent | MakeABidContent;

export interface NFTViewModalContextProps {
	openModal: (content: NFTViewModalContent) => void;
	closeModal: () => void;
	modalContent: NFTViewModalContent | null;
}
