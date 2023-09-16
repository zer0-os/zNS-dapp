import { useZnsSdk } from 'lib/hooks/sdk';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useWeb3 } from 'lib/web3-connection/useWeb3';

/**
 * Gets a user's balance as part of the parent
 * component's lifecycle.
 * tokenId is optional as often the token ID loads asynchronously.
 * This should be improved later down the line.
 * @param tokenId token to get balance for
 */
const useBalance = (tokenId?: string) => {
	const { instance: znsSdk } = useZnsSdk();
	const { account } = useWeb3();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [balance, setBalance] = useState<BigNumber | undefined>();

	useEffect(() => {
		let isMounted = true;

		setIsLoading(true);
		setBalance(undefined);

		if (!(account ?? '').length || !(tokenId ?? '').length) {
			setIsLoading(false);
			return;
		}

		(async () => {
			try {
				const balance = await znsSdk.zauction.getUserBalanceForPaymentToken(
					account!,
					tokenId!,
				);
				if (isMounted) {
					setBalance(balance);
				}
			} catch (e) {
				console.error(
					`Failed to get balance of ${account} for token ${tokenId}`,
				);
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		})();

		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tokenId, account]);

	return {
		isLoading,
		balance,
	};
};

export default useBalance;
