import { useWeb3React as useWeb3ReactCore } from '@web3-react/core';
import { defaultNetworkId } from '../network';

export const useWeb3 = () => {
	const web3React = useWeb3ReactCore();

	return {
		...web3React,
		chainId: web3React.chainId ?? defaultNetworkId ?? 1,
	};
};
