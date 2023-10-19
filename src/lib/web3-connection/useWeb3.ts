import { useAccount, useChainId } from 'wagmi';
import { useEthersProvider } from './ethers';

export const useWeb3 = () => {
	const { address: account, isConnected: isActive } = useAccount();
	const chainId = useChainId();
	const provider = useEthersProvider({ chainId });

	return {
		account,
		isActive,
		provider,
		chainId: chainId,
	};
};
