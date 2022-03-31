/**
 * This hook is just a wrapper for getBidDataForDomain which adds some lifecycle
 * This was needed in a few different components, so it was made generic
 */
import { useZnsSdk } from 'lib/hooks/sdk';
import { DomainBidData, getBidDataForDomain } from 'lib/utils/bids';
import { useEffect, useState } from 'react';

type UseBidDataReturn = {
	bidData: DomainBidData | undefined;
	isLoading: boolean;
};

/**
 * Gets bid data specifically required for the Make A Bid modal
 * Note: this should (currently) only use used in the Make A Bid modal
 * @param domainId domain ID to get bid data for
 * @returns highest bid and all bids as bidData, and a loading flag
 */
const useBidData = (domainId: string): UseBidDataReturn => {
	const { instance: sdk } = useZnsSdk();

	const [bidData, setBidData] = useState<DomainBidData | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		let isMounted = true;
		getBidDataForDomain(domainId, sdk).then((d) => {
			if (!isMounted) {
				return;
			}
			if (d) {
				setBidData({ ...d });
			}
			setIsLoading(false);
		});
		return () => {
			isMounted = false;
		};
	}, [domainId, sdk]);

	return {
		bidData,
		isLoading,
	};
};

export default useBidData;
