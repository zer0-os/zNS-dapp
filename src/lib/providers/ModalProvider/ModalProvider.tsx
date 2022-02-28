//- React Imports
import { ReactNode, useState } from 'react';

//- Context Imports
import { ModalContext } from './ModalContext';

//- Component Imports
import { ConnectToWallet } from 'components';

//- Container Imports
import { MintNewNFT } from 'containers';

//- Modal Type Imports
import { ModalContent, ModalType } from './ModalTypes';

interface ModalProviderProps {
	children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
	const [modalContent, setModalContent] = useState<ModalContent | null>(null);

	const closeModal = () => {
		setModalContent(null);
	};

	const openModal = (state: ModalContent) => {
		setModalContent(state);
	};

	return (
		<ModalContext.Provider value={{ closeModal, modalContent, openModal }}>
			{children}

			{modalContent?.modalType === ModalType.MINT_NEW_NFT && (
				<MintNewNFT
					onMint={modalContent?.contentProps.onMint}
					closeModal={closeModal}
					domainName={modalContent?.contentProps.domainName}
					domainId={modalContent?.contentProps.domainId}
					domainOwner={modalContent?.contentProps.domainOwner}
					subdomains={modalContent?.contentProps.subdomains}
				/>
			)}

			{modalContent?.modalType === ModalType.CONNECT_TO_WALLET && (
				<ConnectToWallet onConnect={closeModal} closeModal={closeModal} />
			)}
		</ModalContext.Provider>
	);
};
