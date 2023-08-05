//- React Imports
import { useState, useEffect, useMemo, useCallback } from 'react';

//- Web3 Imports
import { useWeb3 } from 'lib/web3-connection/useWeb3'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data
import { ethers } from 'ethers';

//- Library Imports
import { useZnsSdk } from 'lib/hooks/sdk';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import { DomainEventType, DomainBidEvent } from '@zero-tech/zns-sdk/lib/types';
import { Bid } from '@zero-tech/zauction-sdk';

//- Type Imports
import { DomainEvents } from '../NFTView.types';

//- Helper Imports
import { sortBidsByAmount, sortEventsByTimestamp } from '../NFTView.helpers';

//- Constants Imports
import { MESSAGES } from '../NFTView.constants';

//- Hook level type definitions
interface UseNftDataReturn {
	isHistoryLoading: boolean;
	isPriceDataLoading: boolean | undefined;
	history: DomainEvents[];
	bids: DomainBidEvent[];
	highestBid: number | undefined;
	buyNowPrice: number | undefined;
	yourBid: Bid | undefined;
	getHistory: () => Promise<void>;
	getPriceData: () => Promise<void>;
	refetch: () => void;
}

export const useNftData = (): UseNftDataReturn => {
	//- Web3 Wallet Data
	const { account } = useWeb3();

	//- SDK
	const { instance: sdk } = useZnsSdk();

	//- Current domain
	const { domain: znsDomain } = useCurrentDomain();

	/**
	 * State data
	 *
	 */
	const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
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
				console.error(MESSAGES.CONSOLE_ERROR);
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
				sdk.zauction.getBuyNowListing(id),
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
			buyNow &&
				buyNow?.price?.gt(0) &&
				setBuyNowPrice(Number(ethers.utils.formatEther(buyNow?.price)));
		} catch (e) {
			console.error(MESSAGES.CONSOLE_ERROR, e);
		} finally {
			setIsPriceDataLoading(false);
		}
	}, [sdk, account, znsDomain]);

	/**
	 * Refreshes data for the current NFT
	 */
	const refetch = () => {
		getHistory();
		getPriceData();
	};

	/**
	 * Life cycle
	 *
	 */
	useEffect(() => {
		if (znsDomain) {
			getPriceData();
			getHistory();
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
		refetch,
	};
};

export default useNftData;
