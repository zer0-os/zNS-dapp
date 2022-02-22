//- React Imports
import { ReactNode, useState } from 'react';

//- Context Imports
import { ModalContext } from './ModalContext';

//- Component Imports
import { ConnectToWallet } from 'components';

//- Modal Type Imports
import { ModalContent, ModalType } from './ModalTypes';
import MintWheels from 'containers/flows/MintWheels/MintWheels';

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

			{modalContent?.modalType === ModalType.CONNECT_WALLET_MODAL_TYPE && (
				<ConnectToWallet onConnect={closeModal} closeOverlay={closeModal} />
			)}

			{modalContent?.modalType === ModalType.MINT_WHEELS_MODAL_TYPE && (
				<MintWheels
					closeOverlay={closeModal}
					balanceEth={modalContent?.contentProps.balanceEth}
					contract={modalContent?.contentProps.contract}
					dropStage={modalContent?.contentProps.dropStage}
					isUserWhitelisted={modalContent?.contentProps.isUserWhitelisted}
					maxPurchasesPerUser={modalContent?.contentProps.maxPurchasesPerUser}
					numberPurchasedByUser={
						modalContent?.contentProps.numberPurchasedByUser
					}
					onClose={modalContent?.contentProps.onClose}
					onFinish={modalContent?.contentProps.onFinish}
					onSubmitTransaction={modalContent?.contentProps.onSubmitTransaction}
					userId={modalContent?.contentProps.userId}
					wheelsMinted={modalContent?.contentProps.wheelsMinted}
					wheelsTotal={modalContent?.contentProps.wheelsTotal}
					token={modalContent?.contentProps.token}
				/>
			)}
		</ModalContext.Provider>
	);
};
