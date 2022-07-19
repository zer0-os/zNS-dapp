import { useCallback, useEffect, useRef, useState } from 'react';
import { useZnsSdk } from 'lib/hooks/sdk';
import { formatEther } from 'ethers/lib/utils';

/**
 * Grabs subdomain data as part of a component lifecycle.
 * @param domainId domain ID to get subdomain data for
 */
const useSubdomainData = (domainId: string) => {
	const { instance: sdk } = useZnsSdk();

	const isMounted = useRef<boolean>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [buyNowPrice, setBuyNowPrice] = useState<number | undefined>();

	/**
	 * Gets Buy Now value, and sets local state
	 */
	const fetch = useCallback(() => {
		setIsLoading(true);
		setBuyNowPrice(undefined);
		const get = async () => {
			try {
				const buyNow = await sdk.zauction.getBuyNowListing(domainId);
				if (buyNow?.price) {
					setBuyNowPrice(Number(formatEther(buyNow?.price)));
				}
			} catch (e) {
				console.error('Failed to retrieve Buy Now for domain', domainId, e);
			} finally {
				setIsLoading(false);
			}
		};
		get();
	}, [domainId, sdk]);

	useEffect(() => {
		isMounted.current = true;
		fetch();
		return () => {
			isMounted.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [domainId]);

	return { isLoading, buyNowPrice, refetch: fetch };
};

export default useSubdomainData;
