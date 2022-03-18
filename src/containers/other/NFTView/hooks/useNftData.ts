//- React Imports
import { useState, useEffect, useMemo, useCallback } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data
import { ethers } from 'ethers';

//- Library Imports
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import useNotification from 'lib/hooks/useNotification';
import { DomainEventType, DomainBidEvent } from '@zero-tech/zns-sdk/lib/types';
import { Bid } from '@zero-tech/zauction-sdk';

//- Type Imports
import { DomainEvents } from '../NFTView.types';

//- Helper Imports
import {
	getDomainAsset,
	downloadDomainAsset,
	shareDomainAsset,
	sortBidsByAmount,
	sortHistoriesByTimestamp,
} from '../NFTView.helpers';

//- Hook level type definitions
interface UseNftDataReturn {
	isHistoryLoading: boolean;
	isPriceDataLoading: boolean | undefined;
	histories: DomainEvents[];
	bids: DomainBidEvent[];
	highestBid: number | undefined;
	buyNowPrice: number | undefined;
	yourBid: Bid | undefined;
	getHistories: () => Promise<void>;
	getPriceData: () => Promise<void>;
	downloadAsset: () => Promise<void>;
	shareAsset: () => Promise<void>;
}

export const useNftData = (): UseNftDataReturn => {
	//- Web3 Wallet Data
	const { account, library } = useWeb3React<Web3Provider>();

	//- SDK
	const sdk = useZnsSdk();

	//- Current domain
	const { domain: znsDomain, domainRaw: domain } = useCurrentDomain();

	//- Notification
	const { addNotification } = useNotification();

	/**
	 * State data
	 *
	 */
	const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
	const [histories, setHistories] = useState<DomainEvents[]>([]);
	const [isPriceDataLoading, setIsPriceDataLoading] = useState<boolean>();
	const [highestBid, setHighestBid] = useState<Bid | undefined>();
	const [buyNowPrice, setBuyNowPrice] = useState<number | undefined>();
	const [yourBid, setYourBid] = useState<Bid | undefined>();

	/**
	 * Memoized data
	 *
	 */
	const bids: DomainBidEvent[] = useMemo(() => {
		return histories.filter(
			(e: DomainEvents) => e.type === DomainEventType.bid,
		) as DomainBidEvent[];
	}, [histories]);

	const highestBidAmount: number | undefined = useMemo(() => {
		return highestBid?.amount
			? Number(ethers.utils.formatEther(highestBid.amount))
			: undefined;
	}, [highestBid]);

	/**
	 * Callback functions
	 *
	 */
	const getHistories = useCallback(async () => {
		if (znsDomain) {
			setIsHistoryLoading(true);

			try {
				const events = (await sdk.instance?.getDomainEvents(
					znsDomain.id,
				)) as DomainEvents[];
				setHistories(sortHistoriesByTimestamp(events));
			} catch (e) {
				console.error('Failed to retrieve bid data');
			} finally {
				setIsHistoryLoading(false);
			}
		}
	}, [sdk.instance, znsDomain]);

	const getPriceData = useCallback(async () => {
		if (!znsDomain?.id || !library) {
			return;
		}

		const { id } = znsDomain;

		setIsPriceDataLoading(true);

		try {
			setBuyNowPrice(undefined);
			setHighestBid(undefined);
			setYourBid(undefined);

			const zAuction = await sdk.instance.getZAuctionInstanceForDomain(id);

			// Get buy now and all bids
			const [listing, bids] = await Promise.all([
				zAuction.getBuyNowPrice(id, library.getSigner()),
				zAuction.listBids([id]),
			]);

			const buyNow = listing.price;

			// Excuse this monstrosity
			const highestBid = sortBidsByAmount(bids[id])[0];

			if (account) {
				const yourBid = sortBidsByAmount(
					bids[id].filter(
						(b) => b.bidder.toLowerCase() === account.toLowerCase(),
					),
				)[0];

				if (yourBid) {
					setYourBid(yourBid);
				}
			}

			setHighestBid(highestBid);
			setBuyNowPrice(Number(ethers.utils.formatEther(buyNow)));
		} catch (e) {
			console.error('Failed to retrieve price data');
		} finally {
			setIsPriceDataLoading(false);
		}
	}, [sdk.instance, account, library, znsDomain]);

	const downloadAsset = useCallback(async () => {
		const asset = await getDomainAsset(znsDomain);

		if (asset) {
			addNotification('Download starting');

			await downloadDomainAsset(asset);
		}
	}, [znsDomain, addNotification]);

	const shareAsset = useCallback(async () => {
		if (domain) {
			shareDomainAsset(domain);
		}
	}, [domain]);

	/**
	 * Life cycle
	 *
	 */
	useEffect(() => {
		if (znsDomain) {
			getPriceData();
			getHistories();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [znsDomain, account]);

	return {
		isHistoryLoading,
		isPriceDataLoading,
		histories,
		bids,
		highestBid: highestBidAmount,
		buyNowPrice,
		yourBid,
		getHistories,
		getPriceData,
		downloadAsset,
		shareAsset,
	};
};

export default useNftData;
