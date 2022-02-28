// React Imports
import { useState } from 'react';

import styles from './ConnectWalletPrompt.module.scss';

// Component Imports
import { Confirmation, ConnectToWallet, Overlay } from 'components';

type ConnectWalletPromptProps = {
	open?: boolean;
	onClose?: () => void;
};

const ConnectWalletPrompt: React.FC<ConnectWalletPromptProps> = ({
	onClose,
	open,
}) => {
	//////////////////
	// State & Data //
	//////////////////

	const [isModalOpen, setIsModalOpen] = useState(open);
	const [isConnectToWalletModalOpen, setIsConnectToWalletModalOpen] =
		useState(false);

	const closeConnectWalletPrompt = () => {
		setIsModalOpen(false);
		if (onClose) {
			onClose();
		}
	};

	const closeConnectToWallet = () => {
		setIsConnectToWalletModalOpen(false);
		closeConnectWalletPrompt();
	};

	const connectToWallet = () => {
		setIsModalOpen(false);
		setIsConnectToWalletModalOpen(true);
	};

	return (
		<>
			<Overlay
				onClose={closeConnectWalletPrompt}
				centered
				open={isModalOpen}
				hasCloseButton={false}
			>
				<Confirmation
					title={'Connect your Wallet'}
					confirmText={'Connect'}
					onConfirm={() => {
						connectToWallet();
					}}
					hasCloseButton={true}
					onCancel={() => {
						closeConnectWalletPrompt();
					}}
					onClose={() => {
						closeConnectWalletPrompt();
					}}
				>
					<p className={styles.DialogText}>
						Before you can make a bid, you must connect a wallet.
					</p>
				</Confirmation>{' '}
			</Overlay>
			<Overlay
				centered
				open={isConnectToWalletModalOpen}
				onClose={closeConnectToWallet}
			>
				<ConnectToWallet
					onConnect={closeConnectToWallet}
					closeModal={closeConnectToWallet}
				/>
			</Overlay>
		</>
	);
};

export default ConnectWalletPrompt;
