//- Containers & Components Imports
import { MintNewNFTProps } from 'containers/flows/MintNewNFT/MintNewNFT';

export enum ModalType {
	NULL_MODAL_TYPE,
	MINT_NEW_NFT,
	CONNECT_TO_WALLET,
}

export type MintNewNFTContentProps = Omit<MintNewNFTProps, 'closeModal'>;

interface NullContent {
	modalType: ModalType.NULL_MODAL_TYPE;
}

interface MintNewNFTContent {
	modalType: ModalType.MINT_NEW_NFT;
	contentProps: MintNewNFTContentProps;
}

interface ConnectToWalletContent {
	modalType: ModalType.CONNECT_TO_WALLET;
}

export type ModalContent =
	| NullContent
	| MintNewNFTContent
	| ConnectToWalletContent;

export interface ModalContextProps {
	openModal: (content: ModalContent) => void;
	closeModal: () => void;
	modalContent: ModalContent | null;
}
