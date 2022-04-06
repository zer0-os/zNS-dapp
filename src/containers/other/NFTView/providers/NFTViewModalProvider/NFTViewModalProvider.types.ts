//- Container Props Imports
import { MakeABidProps } from 'containers/flows/MakeABid/MakeABid';
import { SetBuyNowContainerProps } from 'containers/flows/SetBuyNow';
import { TransferOwnershipProps } from 'containers/flows/TransferOwnership/TransferOwnership';
import { BidListProps } from 'containers/lists/BidList/BidList';
import { DomainSettingsProps } from 'containers/other/NFTView/elements/DomainSettings/DomainSettings';

export enum NFTViewModalType {
	NULL_MODAL_TYPE,
	MAKE_A_BID,
	DOMAIN_SETTINGS,
	TRANSFER_OWNERSHIP,
	SET_BUY_NOW,
	BID_LIST,
}

export type MakeABidContentProps = Omit<MakeABidProps, 'closeModal'>;

export type DomainSettingsContentProps = Omit<
	DomainSettingsProps,
	'closeModal'
>;

export type TransferOwnershipContentProps = Omit<
	TransferOwnershipProps,
	'closeModal'
>;

export type SetBuyNowContentProps = Omit<SetBuyNowContainerProps, 'closeModal'>;

export type BidListContentProps = Omit<BidListProps, 'closeModal'>;

interface NullContent {
	modalType: NFTViewModalType.NULL_MODAL_TYPE;
}

interface MakeABidContent {
	modalType: NFTViewModalType.MAKE_A_BID;
	contentProps: MakeABidContentProps;
}

interface DomainSettingsContent {
	modalType: NFTViewModalType.DOMAIN_SETTINGS;
	contentProps: DomainSettingsContentProps;
}

interface TransferOwnershipContent {
	modalType: NFTViewModalType.TRANSFER_OWNERSHIP;
	contentProps: TransferOwnershipContentProps;
}

interface SetBuyNowContent {
	modalType: NFTViewModalType.SET_BUY_NOW;
	contentProps: SetBuyNowContentProps;
}

interface BidListContent {
	modalType: NFTViewModalType.BID_LIST;
	contentProps: BidListContentProps;
}

export type NFTViewModalContent =
	| NullContent
	| MakeABidContent
	| DomainSettingsContent
	| TransferOwnershipContent
	| SetBuyNowContent
	| BidListContent;

export interface NFTViewModalContextProps {
	openModal: (content: NFTViewModalContent) => void;
	closeModal: () => void;
	modalContent: NFTViewModalContent | null;
}
