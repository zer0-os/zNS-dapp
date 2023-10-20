import { useMemo } from 'react';

import { useWalletClient, WalletClient } from 'wagmi';
import { providers } from 'ethers';

export function walletClientToProvider(walletClient: WalletClient) {
	const { chain, transport } = walletClient;
	const network = {
		chainId: chain.id,
		name: chain.name,
		ensAddress: chain.contracts?.ensRegistry?.address,
	};
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return new providers.Web3Provider(transport, network);
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
	const { data: walletClient } = useWalletClient({ chainId });
	return useMemo(
		() => (walletClient ? walletClientToProvider(walletClient) : undefined),
		[walletClient],
	);
}
