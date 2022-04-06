//- React Imports
import { useState, useEffect, useCallback } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data

//- Library Imports
import { useZnsSdk } from 'lib/hooks/sdk';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import { Bid } from '@zero-tech/zauction-sdk';
import { Domain } from '@zero-tech/zns-sdk/lib/types';
import { sortBidsByTime } from 'lib/utils/bids';

interface UseNftDataReturn {
	isBidDataLoading: boolean | undefined;
	allBids: Bid[] | undefined;
	domainData: Domain | undefined;
}

export const useViewBidsData = (): UseNftDataReturn => {
	//- Web3 Wallet Data
	const { account } = useWeb3React<Web3Provider>();

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
	const [domainData, setDomainData] = useState<Domain | undefined>();

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
		domainData,
	};
};

export default useViewBidsData;
