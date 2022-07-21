//- React Imports
import { useEffect, useRef, useState } from 'react';

//- Library Imports
import { useZnsSdk } from 'lib/hooks/sdk';
import { useBidProvider } from 'lib/hooks/useBidProvider';
import getPaymentTokenInfo from 'lib/paymentToken';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import { Bid } from '@zero-tech/zauction-sdk';

//- Types Imports
import { BidTableData } from '../BidTable.types';

//- Constants Imports
import { Errors } from '../BidTable.constants';

export type UseBidTableDataReturn = {
	isLoading: boolean;
	bidData?: BidTableData[];
	refetch: () => void;
};

const useBidTableData = (): UseBidTableDataReturn => {
	const isMounted = useRef<boolean>();

	const { getBidsForAccount } = useBidProvider();
	const { instance: sdk } = useZnsSdk();
	const { account } = useWeb3React();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [bidData, setBidData] = useState<BidTableData[] | undefined>([]);

	const getData = async () => {
		if (!account) {
			return;
		}
		setIsLoading(true); // Table shows loading state

		// Get all bids for user's account
		let bids;
		try {
			bids = await getBidsForAccount(account);
		} catch (e) {
			console.error(e);
			throw new Error(Errors.FAILED_TO_RETRIEVE_BIDS);
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

		// TODO: Optimize this
		const getPaymentTokenPromises = Promise.all(
			uniqueDomainIds.map(async (id) =>
				getPaymentTokenInfo(
					sdk,
					await sdk.zauction.getPaymentTokenForDomain(id),
				),
			),
		);
		let existingBids: any[], domainData: any[], paymentTokenData: any[];
		try {
			const data = await Promise.all([
				getExistingBidsPromises,
				getDomainDataPromises,
				getPaymentTokenPromises,
			]);
			existingBids = data[0];
			domainData = data[1];
			paymentTokenData = data[2];
		} catch (e) {
			console.error(e);
			throw new Error('Failed to retrieve bid data.');
		}

		let highestBids: any[], tableData: BidTableData[];
		try {
			// Convert existing bids into "highest bid"
			highestBids = existingBids.map((domain, index) => {
				const highestBid = domain.sort((a: Bid, b: Bid) =>
					BigNumber.from(a.amount).gte(b.amount) ? 0 : 1,
				)[0] as Bid;
				return {
					id: highestBid.tokenId,
					amount: BigNumber.from(highestBid.amount),
					paymentTokenInfo: paymentTokenData[index],
				};
			});

			// Merge all 3 sets of data into data needed for the table
			// and sort by newest to oldest
			tableData = bids!
				.map((bid) => {
					const domain = domainData.filter((d) => d.id === bid.tokenId)[0];
					const highestBidData = highestBids.filter(
						(d) => d.id === bid.tokenId,
					)[0];
					return {
						bidNonce: bid.bidNonce,
						domainName: domain.name,
						domainId: bid.tokenId,
						domainMetadataUrl: domain.metadataUri,
						date: bid.date,
						yourBid: ethers.utils.parseEther(bid.amount.toString()),
						highestBid: highestBidData.amount,
						domain: domain,
						paymentTokenInfo: highestBidData.paymentTokenInfo,
					};
				})
				.sort((a, b) => b.date.getTime() - a.date.getTime());
		} catch (e) {
			console.error(e);
			throw new Error(Errors.FAILED_TO_PARSE_BID_DATA);
		}

		if (isMounted.current) {
			setBidData(tableData);
			setIsLoading(false);
		}
	};

	const refetch = () => {
		setBidData(undefined);
		getData().catch((e) => {
			if (e.message) {
				console.error(e.message);
			}
			if (isMounted.current === true) {
				setIsLoading(false);
			}
		});
	};

	useEffect(() => {
		isMounted.current = true;

		getData().catch((e) => {
			if (e.message) {
				console.error(e.message);
			}
			if (isMounted.current === true) {
				setIsLoading(false);
			}
		});

		return () => {
			isMounted.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		isLoading,
		bidData,
		refetch,
	};
};

export default useBidTableData;
