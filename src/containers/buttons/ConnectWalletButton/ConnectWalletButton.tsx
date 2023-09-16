import { useState } from 'react';

import { useWeb3 } from 'lib/web3-connection/useWeb3';

import { ConnectToWallet, FutureButton, Overlay } from 'components';

// @todo change props from any type
const ConnectWalletButton = (props: any) => {
	const { isActive } = useWeb3();

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			{isModalOpen && (
				<Overlay centered open onClose={closeModal}>
					<ConnectToWallet onConnect={closeModal} />
				</Overlay>
			)}
			<FutureButton {...props} glow={!isActive} onClick={openModal} />
		</>
	);
};

export default ConnectWalletButton;
