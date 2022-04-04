//- React Imports
import { useState, useEffect, useMemo, useCallback } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data
import { ethers } from 'ethers';

//- Library Imports
import { useZnsSdk } from 'lib/hooks/sdk';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import useNotification from 'lib/hooks/useNotification';
import { DomainEventType, DomainBidEvent } from '@zero-tech/zns-sdk/lib/types';
import { Bid } from '@zero-tech/zauction-sdk';
import { Domain } from '@zero-tech/zns-sdk/lib/types';

//- Type Imports
import { DomainEvents } from '../NFTView.types';

//- Helper Imports
import {
	getDomainAsset,
	downloadDomainAsset,
	shareDomainAsset,
	sortBidsByAmount,
	sortEventsByTimestamp,
} from '../NFTView.helpers';
import { sortBidsByTime } from 'lib/utils/bids';

//- Hook level type definitions
interface UseNftDataReturn {
	isHistoryLoading: boolean;
	isPriceDataLoading: boolean | undefined;
	isBidDataLoading: boolean | undefined;
	history: DomainEvents[];
	bids: DomainBidEvent[];
	highestBid: number | undefined;
	buyNowPrice: number | undefined;
	yourBid: Bid | undefined;
	allBids: Bid[] | undefined;
	domainData: Domain | undefined;
	getHistory: () => Promise<void>;
	getPriceData: () => Promise<void>;
	getViewBidsData: () => Promise<void>;
	downloadAsset: () => Promise<void>;
	shareAsset: () => Promise<void>;
	refetch: () => void;
}

export const useNftData = (): UseNftDataReturn => {
	//- Web3 Wallet Data
	const { account } = useWeb3React<Web3Provider>();

	//- SDK
	const { instance: sdk } = useZnsSdk();

	//- Current domain
	const { domain: znsDomain, domainRaw: domain } = useCurrentDomain();

	//- Notification
	const { addNotification } = useNotification();

	/**
	 * State data
	 *
	 */
	const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
	const [isBidDataLoading, setIsBidDataLoading] = useState<boolean>(true);
	const [allBids, setAllBids] = useState<Bid[] | undefined>();
	const [domainData, setDomainData] = useState<Domain | undefined>();
	const [history, setHistory] = useState<DomainEvents[]>([]);
	const [isPriceDataLoading, setIsPriceDataLoading] = useState<boolean>();
	const [highestBid, setHighestBid] = useState<Bid | undefined>();
	const [buyNowPrice, setBuyNowPrice] = useState<number | undefined>();
	const [yourBid, setYourBid] = useState<Bid | undefined>();

	/**
	 * Memoized data
	 *
	 */
	const bids: DomainBidEvent[] = useMemo(() => {
		return history.filter(
			(e: DomainEvents) => e.type === DomainEventType.bid,
		) as DomainBidEvent[];
	}, [history]);

	const highestBidAmount: number | undefined = useMemo(() => {
		return highestBid?.amount
			? Number(ethers.utils.formatEther(highestBid.amount))
			: undefined;
	}, [highestBid]);

	const domainAssetURL = useMemo(() => {
		return (
			znsDomain?.animation_url || znsDomain?.image_full || znsDomain?.image
		);
	}, [znsDomain]);

	/**
	 * Callback functions
	 *
	 */
	const getHistory = useCallback(async () => {
		if (znsDomain) {
			setIsHistoryLoading(true);

			try {
				const events = (await sdk?.getDomainEvents(
					znsDomain.id,
				)) as DomainEvents[];
				setHistory(sortEventsByTimestamp(events));
			} catch (e) {
				console.error('Failed to retrieve bid data');
			} finally {
				setIsHistoryLoading(false);
			}
		}
	}, [sdk, znsDomain]);

	const getPriceData = useCallback(async () => {
		if (!znsDomain?.id) {
			return;
		}

		const { id } = znsDomain;

		setIsPriceDataLoading(true);

		try {
			setBuyNowPrice(undefined);
			setHighestBid(undefined);
			setYourBid(undefined);

			// Get buy now and all bids
			const [buyNow, bids] = await Promise.all([
				sdk.zauction.getBuyNowPrice(id),
				sdk.zauction.listBids(id),
			]);

			// Excuse this monstrosity
			const highestBid = sortBidsByAmount(bids)[0];

			if (account) {
				const yourBid = sortBidsByAmount(
					bids.filter((b) => b.bidder.toLowerCase() === account.toLowerCase()),
				)[0];

				if (yourBid) {
					setYourBid(yourBid);
				}
			}

			setHighestBid(highestBid);
			setBuyNowPrice(Number(buyNow) > 0 ? Number(buyNow) : undefined);
		} catch (e) {
			console.error('Failed to retrieve price data', e);
		} finally {
			setIsPriceDataLoading(false);
		}
	}, [sdk, account, znsDomain]);

	const getViewBidsData = useCallback(async () => {
		if (!znsDomain?.id) {
			return;
		}
		const { id } = znsDomain;
		setIsBidDataLoading(true);

		try {
			setAllBids(undefined);
			setDomainData(undefined);

			// Get all relevant domain info
			const [domainData, bidData] = await Promise.all([
				sdk.getDomainById(id),
				sdk.zauction.listBids(id),
			]);

			// Filter bids
			const sorted = sortBidsByTime(bidData);
			const filteredBids = sorted.filter(
				(bid) => bid.bidder.toLowerCase() !== account?.toLowerCase(),
			);

			setAllBids(filteredBids);
			setDomainData({
				id: domainData.id,
				name: domainData.name,
				parentId: domainData.parentId,
				owner: domainData.owner,
				minter: domainData.minter,
				metadataUri: domainData.metadataUri,
				isLocked: domainData.isLocked,
				lockedBy: domainData.lockedBy,
				contract: domainData.contract,
				isRoot: domainData.isRoot,
			});
		} catch (e) {
			console.error('Failed to retrieve bid data', e);
		} finally {
			setIsBidDataLoading(false);
		}
	}, [account, sdk, znsDomain]);

	const downloadAsset = useCallback(async () => {
		if (!domainAssetURL) {
			return;
		}

		const asset = await getDomainAsset(domainAssetURL);

		if (asset) {
			addNotification('Download starting');

			await downloadDomainAsset(asset);
		}
	}, [domainAssetURL, addNotification]);

	/**
	 * Opens share
	 */
	const shareAsset = useCallback(async () => {
		if (domain) {
			shareDomainAsset(domain);
		}
	}, [domain]);

	/**
	 * Refreshes data for the current NFT
	 */
	const refetch = () => {
		getHistory();
		getPriceData();
		getViewBidsData();
	};

	/**
	 * Life cycle
	 *
	 */
	useEffect(() => {
		if (znsDomain) {
			getPriceData();
			getHistory();
			getViewBidsData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [znsDomain, account]);

	return {
		isHistoryLoading,
		isPriceDataLoading,
		history,
		bids,
		highestBid: highestBidAmount,
		buyNowPrice,
		yourBid,
		getHistory,
		getPriceData,
		isBidDataLoading,
		allBids,
		domainData,
		downloadAsset,
		shareAsset,
		refetch,
		getViewBidsData,
	};
};

export default useNftData;
