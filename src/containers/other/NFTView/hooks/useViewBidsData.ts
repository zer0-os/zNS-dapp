//- React Imports
import { useState, useEffect, useCallback } from 'react';

//- Web3 Imports
import { useWeb3 } from 'lib/web3-connection/useWeb3'; // Wallet data

//- Library Imports
import { useZnsSdk } from 'lib/hooks/sdk';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import { Bid } from '@zero-tech/zauction-sdk';
import { Domain } from '@zero-tech/zns-sdk/lib/types';
import { sortBidsByTime } from 'lib/utils/bids';

//- Constants Imports
import { MESSAGES } from '../NFTView.constants';
import config from 'config';

interface UseViewBidsDataReturn {
	isBidDataLoading: boolean | undefined;
	allBids: Bid[] | undefined;
	viewBidsDomainData: Domain | undefined;
}

export const useViewBidsData = (): UseViewBidsDataReturn => {
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
	const [isBidDataLoading, setIsBidDataLoading] = useState<boolean>(true);
	const [allBids, setAllBids] = useState<Bid[] | undefined>();
	const [viewBidsDomainData, setViewBidsDomainData] = useState<
		Domain | undefined
	>();

	/**
	 * Callback functions
	 *
	 */
	const getViewBidsData = useCallback(async () => {
		if (!znsDomain?.id) {
			return;
		}
		const { id } = znsDomain;
		setIsBidDataLoading(true);

		try {
			setAllBids(undefined);
			setViewBidsDomainData(undefined);

			// Get all relevant domain info
			const [domainData, bidData] = await Promise.all([
				sdk.getDomainById(id, config.useDataStore),
				sdk.zauction.listBids(id),
			]);

			// Filter bids
			const sorted = sortBidsByTime(bidData);
			const filteredBids = sorted.filter(
				(bid) => bid.bidder.toLowerCase() !== account?.toLowerCase(),
			);

			setAllBids(filteredBids);
			setViewBidsDomainData({
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
			console.error(MESSAGES.CONSOLE_ERROR, e);
		} finally {
			setIsBidDataLoading(false);
		}
	}, [account, sdk, znsDomain]);

	/**
	 * Life cycle
	 *
	 */
	useEffect(() => {
		if (znsDomain) {
			getViewBidsData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [znsDomain, account]);

	return {
		isBidDataLoading,
		allBids,
		viewBidsDomainData,
	};
};

export default useViewBidsData;
