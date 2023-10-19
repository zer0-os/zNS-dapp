// React-Imports
import React, { useCallback, useMemo, useState } from 'react';

// Container-Imports
import { MintNewNFT } from 'containers';

// Component-Imports
import { Overlay } from 'components';

//-Library Imports
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import { useNavbar } from 'lib/hooks/useNavbar';

//- Constants Imports
import {
	Modal,
	MODAL_VISIBILITY_WINDOW_MIN_WIDTH,
} from '../../PageContainer.constants';

interface UseModalReturn {
	modal?: Modal;
	openModal: (modal?: Modal) => () => void;
	closeModal: () => void;
}

export const useModal = (): UseModalReturn => {
	const [modal, setModal] = useState<Modal | undefined>();

	const openModal = useCallback(
		(modal?: Modal) => () => setModal(modal),
		[setModal],
	);

	const closeModal = () => {
		setModal(undefined);
	};

	return {
		modal,
		openModal,
		closeModal,
	};
};

interface ModalsProps {
	pageWidth: number;
	modal?: Modal;
	closeModal: () => void;
}

export const Modals: React.FC<ModalsProps> = ({
	pageWidth,
	modal,
	closeModal,
}) => {
	const { domain } = useCurrentDomain();
	const { isSearching } = useNavbar();

	const { domainId, domainName, domainOwner, subDomains } = useMemo(() => {
		const domainName = domain?.name ?? '';
		const domainId = domain?.id ?? '';
		const domainOwner = domain?.owner.id ?? '';
		const subDomains = domain?.subdomains.map(({ name }) => name) ?? [];

		return {
			domainId,
			domainName,
			domainOwner,
			subDomains,
		};
	}, [domain]);

	if (pageWidth < MODAL_VISIBILITY_WINDOW_MIN_WIDTH) {
		return null;
	}

	return (
		<>
			{/* Backdrop of header searching */}
			<Overlay
				style={{ zIndex: 3 }}
				hasCloseButton={false}
				open={isSearching}
				onClose={() => {}}
			/>

			{/* Mint Modal */}
			{modal === Modal.Mint && (
				<Overlay open onClose={closeModal}>
					<MintNewNFT
						onMint={closeModal}
						domainName={domainName}
						domainId={domainId}
						domainOwner={domainOwner}
						subdomains={subDomains}
					/>
				</Overlay>
			)}
		</>
	);
};
