// React Imports
import { useState } from 'react';

import styles from './ConnectWalletPrompt.module.scss';

// Component Imports
import { Confirmation, ConnectToWallet, Overlay } from 'components';

type ConnectWalletPromptProps = {
	open?: boolean;
	onClose?: () => void;
	promptText: string;
};

const ConnectWalletPrompt: React.FC<ConnectWalletPromptProps> = ({
	onClose,
	open,
	promptText,
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
				hasCloseButton={true}
			>
				<Confirmation
					title={'Connect Your Wallet'}
					confirmText={'Connect'}
					onConfirm={() => {
						connectToWallet();
					}}
					onCancel={() => {
						closeConnectWalletPrompt();
					}}
					onClose={() => {
						closeConnectWalletPrompt();
					}}
				>
					<p className={styles.DialogText}>{promptText}</p>
				</Confirmation>{' '}
			</Overlay>
			<Overlay
				centered
				open={isConnectToWalletModalOpen}
				onClose={closeConnectToWallet}
			>
				<ConnectToWallet onConnect={closeConnectToWallet} />
			</Overlay>
		</>
	);
};

export default ConnectWalletPrompt;
