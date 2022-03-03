import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useBidProvider } from 'lib/hooks/useBidProvider';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';

import { BidTableRowData } from './BidTableRow';
import { Bid } from '@zero-tech/zauction-sdk';
import BidTable from './BidTable';

const BidTableContainer = () => {
	const { getBidsForAccount } = useBidProvider();
	const { instance: sdk } = useZnsSdk();
	const { account } = useWeb3React();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [bidData, setBidData] = useState<BidTableRowData[] | undefined>();

	useEffect(() => {
		let isMounted = true;

		if (!account) {
			return;
		}

		const get = async () => {
			setIsLoading(true); // Table shows loading state

			// Get all bids for user's account
			let bids;
			try {
				bids = await getBidsForAccount(account);
			} catch (e) {
				console.error(e);
				throw new Error('Failed to retrieve bids for account.');
			}

			// Create array of unique domain IDs
			const uniqueDomainIds = bids!
				.map((b) => b.tokenId)
				.filter((id, i, curr) => curr.indexOf(id) === i);

			// Batched asynchronous calls for relevant data
			const getExistingBidsPromises = Promise.all(
				uniqueDomainIds.map((id) => sdk.zauction.listBids(id)),
			);
			const getDomainDataPromises = Promise.all(
				uniqueDomainIds.map((id) => sdk.getDomainById(id)),
			);
			let existingBids: any[], domainData: any[];
			try {
				const data = await Promise.all([
					getExistingBidsPromises,
					getDomainDataPromises,
				]);
				existingBids = data[0];
				domainData = data[1];
			} catch (e) {
				console.error(e);
				throw new Error('Failed to retrieve bid data.');
			}

			let highestBids: any[], tableData: BidTableRowData[];
			try {
				// Convert existing bids into "highest bid"
				highestBids = existingBids.map((domain) => {
					const highestBid = domain.sort((a: Bid, b: Bid) =>
						BigNumber.from(a.amount).gte(b.amount) ? 0 : 1,
					)[0] as Bid;
					return {
						id: highestBid.tokenId,
						amount: BigNumber.from(highestBid.amount),
					};
				});

				// Merge all 3 sets of data into data needed for the table
				// and sort by newest to oldest
				tableData = bids!
					.map((bid) => {
						const domain = domainData.filter((d) => d.id === bid.tokenId)[0];
						return {
							auctionId: bid.auctionId,
							domainName: domain.name,
							domainId: bid.tokenId,
							domainMetadataUrl: domain.metadataUri,
							date: bid.date,
							yourBid: ethers.utils.parseEther(bid.amount.toString()),
							highestBid: highestBids.filter((d) => d.id === bid.tokenId)[0]
								.amount,
						};
					})
					.sort((a, b) => b.date.getTime() - a.date.getTime());
			} catch (e) {
				console.error(e);
				throw new Error('Failed to parse bid data.');
			}

			if (isMounted) {
				setBidData(tableData);
				setIsLoading(false);
			}
		};

		try {
			get();
		} catch (e: any) {
			if (e.message) {
				// @todo handle errors in here
				console.log(e.message);
			}
			setIsLoading(false);
		}

		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <BidTable bidData={bidData} isLoading={isLoading} />;
};

export default BidTableContainer;
