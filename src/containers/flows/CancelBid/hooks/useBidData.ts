// React imports
import { useRef, useState } from 'react';

// Type imports
import { BidData } from '../CancelBid.types';

// Library imports
import { Bid } from '@zero-tech/zauction-sdk';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { getMetadata } from 'lib/metadata';
import { BigNumber } from 'ethers';
import { useDidMount } from 'lib/hooks/useDidMount';

type UseBidDataReturn = {
	isLoading: boolean;
	bid: Bid | undefined;
	bidData: BidData | undefined;
	refetch: () => void;
};

const useBidData = (domainId: string, auctionId: string): UseBidDataReturn => {
	const isMounted = useRef<boolean>();
	const { instance: sdk } = useZnsSdk();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [bid, setBid] = useState<Bid | undefined>();
	const [bidData, setBidData] = useState<BidData | undefined>();

	// Gets data from sources and organises it into correct format
	// Stores the formatted data in 'bidData'
	// Stores the raw bid data in 'bid'
	const getData = async () => {
		setIsLoading(true);

		// Get all relevant domain info
		const [domainData, bidData] = await Promise.all([
			sdk.getDomainById(domainId),
			sdk.zauction.listBids(domainId),
		]);
		const metadata = await getMetadata(domainData.metadataUri);

		// Filter out the correct bids
		const bid = bidData.filter((bid: Bid) => bid.auctionId === auctionId)[0];
		const highestBid = bidData.sort((a: Bid, b: Bid) =>
			BigNumber.from(a.amount).gte(BigNumber.from(b.amount)) ? -1 : 1,
		)[0];

		if (!metadata) {
			setIsLoading(false);
			throw new Error('Failed to retrieve bid data');
		}

		if (!isMounted.current) {
			return;
		}

		// Set state for all new data
		setIsLoading(false);
		setBid(bid);
		setBidData({
			assetUrl: (metadata.animation_url ||
				metadata.image_full ||
				metadata.image) as string,
			creator: domainData.minter,
			domainName: domainData.name,
			title: metadata.title,
			yourBid: BigNumber.from(bid.amount),
			highestBid: BigNumber.from(highestBid.amount),
		});
	};

	// Reset state and call getData
	const refetch = () => {
		setBid(undefined);
		setBidData(undefined);
		getData().catch((e) => {
			console.error(e);
			setIsLoading(false);
		});
	};

	useDidMount(() => {
		isMounted.current = true;
		refetch();
		return () => {
			isMounted.current = false;
		};
	});

	return {
		isLoading,
		bid,
		bidData,
		refetch,
	};
};

export default useBidData;
