import { useWeb3 } from 'lib/web3-connection/useWeb3';

import { FutureButton } from 'components';
import { useWeb3Modal } from '@web3modal/wagmi/react';

// @todo change props from any type
const ConnectWalletButton = (props: any) => {
	const { isActive } = useWeb3();

	const { open } = useWeb3Modal();

	return <FutureButton {...props} glow={!isActive} onClick={open} />;
};

export default ConnectWalletButton;
