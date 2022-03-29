import { useZnsSdk } from 'lib/hooks/sdk';
import { DomainBidData, getBidDataForDomain } from 'lib/utils/bids';
import { useEffect, useState } from 'react';

type UseBidDataReturn = {
	bidData: DomainBidData | undefined;
	isLoading: boolean;
};

/**
 * Wraps SDK get bids method to also get highest bid
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
