// React Imports
import { useState } from 'react';

import styles from './ConnectWalletPrompt.module.scss';

// Component Imports
import { Confirmation, Overlay } from 'components';

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
	return <></>;
};

export default ConnectWalletPrompt;
