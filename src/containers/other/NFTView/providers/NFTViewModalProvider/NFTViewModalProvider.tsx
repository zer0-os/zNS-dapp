//- React Imports
import { ReactNode, useState } from 'react';

//- Context Imports
import { NFTViewModalContext } from './NFTViewModalProvider.context';

//- Modal Type Imports
import {
	NFTViewModalContent,
	NFTViewModalType,
} from './NFTViewModalProvider.types';

//- Components Imports
import { Overlay } from 'components';

//- Containers Imports
import MakeABid from 'containers/flows/MakeABid/MakeABid';

interface NFTViewModalProviderProps {
	children: ReactNode;
}

export const NFTViewModalProvider = ({
	children,
}: NFTViewModalProviderProps) => {
	const [modalContent, setModalContent] = useState<NFTViewModalContent | null>(
		null,
	);

	const closeModal = () => {
		setModalContent(null);
	};

	const openModal = (state: NFTViewModalContent) => {
		setModalContent(state);
	};

	return (
		<NFTViewModalContext.Provider
			value={{ closeModal, modalContent, openModal }}
		>
			{children}

			<Overlay onClose={closeModal} open={modalContent !== null}>
				{modalContent?.modalType === NFTViewModalType.MAKE_A_BID && (
					<MakeABid
						domain={modalContent.contentProps.domain!}
						onBid={modalContent.contentProps.onBid}
						onClose={closeModal}
					/>
				)}
			</Overlay>
		</NFTViewModalContext.Provider>
	);
};
