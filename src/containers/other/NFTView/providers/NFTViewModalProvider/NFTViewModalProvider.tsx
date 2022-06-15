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
import ClaimNFT from 'containers/flows/ClaimNFT';
import MakeABid from 'containers/flows/MakeABid/MakeABid';
import SetBuyNow from 'containers/flows/SetBuyNow';
import { BidList } from 'containers';
import { DomainSettings } from '../../elements';

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
				{modalContent?.modalType === NFTViewModalType.SET_BUY_NOW && (
					<SetBuyNow
						domainId={modalContent.contentProps.domainId}
						onCancel={closeModal}
						onSuccess={modalContent.contentProps.onSuccess}
					/>
				)}
				{modalContent?.modalType === NFTViewModalType.BID_LIST && (
					<BidList
						bids={modalContent.contentProps.bids}
						domain={modalContent.contentProps.domain}
						domainMetadata={modalContent.contentProps.domainMetadata}
						onAccept={modalContent.contentProps.onAccept}
						highestBid={modalContent.contentProps.highestBid}
						isLoading={modalContent.contentProps.isLoading}
					/>
				)}
				{modalContent?.modalType === NFTViewModalType.CLAIM_NFT && (
					<ClaimNFT
						privateSaleEndTime={modalContent.contentProps.privateSaleEndTime}
					/>
				)}
			</Overlay>

			{modalContent?.modalType === NFTViewModalType.DOMAIN_SETTINGS && (
				<DomainSettings
					domainId={modalContent.contentProps.domainId}
					onClose={closeModal}
				/>
			)}
		</NFTViewModalContext.Provider>
	);
};
