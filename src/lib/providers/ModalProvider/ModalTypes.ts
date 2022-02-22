import { MintWheelsProps } from 'containers/flows/MintWheels/MintWheels';

export enum ModalType {
	NULL_MODAL_TYPE,
	CONNECT_WALLET_MODAL_TYPE,
	MINT_WHEELS_MODAL_TYPE,
}

export type MintWheelsContentProps = Omit<MintWheelsProps, 'closeModal'>;

interface NullContent {
	modalType: ModalType.NULL_MODAL_TYPE;
}

interface ConnectWalletContent {
	modalType: ModalType.CONNECT_WALLET_MODAL_TYPE;
}

interface MintWheelsContent {
	modalType: ModalType.MINT_WHEELS_MODAL_TYPE;
	contentProps: MintWheelsContentProps;
}

export type ModalContent =
	| NullContent
	| ConnectWalletContent
	| MintWheelsContent;

export interface ModalContextProps {
	openModal: (content: ModalContent) => void;
	closeModal: () => void;
	modalContent: ModalContent | null;
}
