import { useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import { ConnectToWallet, FutureButton, Overlay } from 'components';

// @todo change props from any type
const ConnectWalletButton = (props: any) => {
	const { active } = useWeb3React();

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
			<FutureButton {...props} glow={!active} onClick={openModal} />
		</>
	);
};

export default ConnectWalletButton;
