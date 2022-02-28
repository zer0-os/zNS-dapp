//- React Imports
import { useWeb3React } from '@web3-react/core';

//- Components Imports
import { FutureButton } from 'components';

//- Lib Imports
import { useModal } from 'lib/hooks/useModal';
import { ModalType } from 'lib/providers/ModalProvider/ModalTypes';

// @todo change props from any type
const ConnectWalletButton = (props: any) => {
	const { active } = useWeb3React();

	//- Modal Provider
	const { openModal } = useModal();

	// Open Connect To Wallet Modal
	const openConnectToWallet = () => {
		openModal({
			modalType: ModalType.CONNECT_TO_WALLET,
		});
	};

	return (
		<>
			<FutureButton {...props} glow={!active} onClick={openConnectToWallet} />
		</>
	);
};

export default ConnectWalletButton;
