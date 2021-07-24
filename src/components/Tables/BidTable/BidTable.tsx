/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Column, useTable, useGlobalFilter, useFilters } from 'react-table';

//- Component Imports
import {
	Artwork,
	Confirmation,
	FutureButton,
	Overlay,
	SearchBar,
	Spinner,
} from 'components';

//- Library Imports
import { Bid, Domain } from 'lib/types';
import { useBidProvider } from 'lib/providers/BidProvider';
import { getDomainData } from 'lib/useDomainStore';
import { useSubgraphProvider } from 'lib/providers/SubgraphProvider';

//- Style Imports
import styles from './BidTable.module.css';

type BidTableProps = {
	style?: React.CSSProperties;
	userId: string;
	usersBids?: boolean;
	usersDomains?: boolean;
};

type BidTableData = {
	bid: Bid;
	domain: Domain;
};

type BidTableDataWithHighest = {
	bid: Bid;
	domain: Domain;
	highestBid: Bid;
};

enum Modals {
	Accept,
}

const BidTable: React.FC<BidTableProps> = ({ style, userId }) => {
	//////////////////
	// State / Refs //
	//////////////////

	const { getBidsForAccount, getBidsForDomain } = useBidProvider();
	const apolloClientInstance = useSubgraphProvider();

	const containerRef = useRef<HTMLDivElement>(null);

	// Searching
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [domainFilter, setDomainFilter] = useState('');

	const [isLoading, setIsLoading] = useState(false); // Not needed anymore?
	const [modal, setModal] = useState<Modals | undefined>();
	const [acceptingBid, setAcceptingBid] = useState<Bid | undefined>();

	//////////
	// Data //
	//////////

	const [displayData, setDisplayData] = useState<BidTableDataWithHighest[]>([]);
	useEffect(() => {
		const get = async () => {
			setIsLoading(true);
			try {
				// Get bids from API
				const bids = await getBidsForAccount(userId);
				if (!bids) return;

				// Get domain data from returned NFT IDs
				const getDomainPromises: Promise<any>[] = [];
				bids.forEach((bid: Bid) =>
					getDomainPromises.push(fetchDomainData(bid)),
				);
				const domainsWithBids = await Promise.all(getDomainPromises);

				// Get the highest bids for each domain
				const highestBids = [];
				// @todo write an algorithm that doesn't depend on bids arriving
				// in ascending order
				for (var i = 0; i < bids.length - 1; i++) {
					const bid = bids[i];
					const nextBid = bids[i + 1];
					if (!nextBid || bid.tokenId !== nextBid.tokenId) {
						highestBids.push({
							bid: bid,
							domain: domainsWithBids.filter(
								(d: Domain) => d.id === bid.tokenId,
							)[0],
						});
					}
				}

				const getAllBidsPromises: Promise<any>[] = [];
				highestBids.forEach((bid: BidTableData) =>
					getAllBidsPromises.push(fetchBids(bid)),
				);
				const allBids = await Promise.all(getAllBidsPromises);

				setDisplayData(allBids);
			} catch (e) {
				console.error('Failed to retrieve bid data');
			}
			setIsLoading(false);
		};
		get();
	}, []);

	///////////////
	// Functions //
	///////////////

	/* Sets some search parameters
		 There's a hook listening to each of these variables */
	const search = (query: string) => setSearchQuery(query);

	const closeModal = () => setModal(undefined);

	const clickAcceptButton = (bid: Bid) => {
		setAcceptingBid(bid);
	};

	const acceptBidConfirmed = () => {
		setAcceptingBid(undefined);
	};

	const fetchDomainData = async (bid: Bid) => {
		try {
			if (!bid.tokenId) return;
			const tx = await getDomainData(bid.tokenId, apolloClientInstance.client);
			return tx!.data.domains[0];
		} catch (e: any) {
			// @todo replace any
			console.error(e);
			return;
		}
	};

	const fetchBids = async (domain: BidTableData) => {
		try {
			const bids = await getBidsForDomain(domain.domain);
			if (!bids) return;
			bids.sort((a: any, b: any) => b.amount - a.amount);
			return { ...domain, highestBid: bids[0] };
		} catch (e: any) {
			console.error(e);
		}
	};

	/////////////////
	// React-Table //
	/////////////////

	// Column Setup
	const columns = useMemo<Column<any>[]>(
		() => [
			{
				Header: () => <div style={{ textAlign: 'left' }}>Domain</div>,
				id: 'domain',
				accessor: (bid: BidTableDataWithHighest) => (
					<Artwork
						id={bid.domain.id}
						domain={bid.domain.name}
						metadataUrl={bid.domain.metadata}
						pending
					/>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Your Bid</div>,
				id: 'yourBid',
				accessor: (bid: BidTableDataWithHighest) => (
					<div style={{ textAlign: 'right' }}>{bid.bid.amount} WILD</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Highest Bid</div>,
				id: 'highestBid',
				accessor: (bid: BidTableDataWithHighest) => (
					<div style={{ textAlign: 'right' }}>{bid.highestBid.amount} WILD</div>
				),
			},
			{
				id: 'bid',
				accessor: (bid: BidTableDataWithHighest) => (
					<>
						{bid.highestBid.bidderAccount === bid.bid.bidderAccount && (
							<div
								style={{
									margin: '0 auto',
									color: 'var(--color-success)',
									textAlign: 'center',
								}}
							>
								You lead
							</div>
						)}
						{bid.highestBid.bidderAccount !== bid.bid.bidderAccount && (
							<FutureButton
								style={{ margin: '0 auto', textTransform: 'uppercase' }}
								glow
								onClick={() => clickAcceptButton(bid.bid)}
							>
								Make A Bid
							</FutureButton>
						)}
					</>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	// React-Table Config
	const tableHook = useTable<any>(
		{ columns, data: displayData },
		useFilters,
		useGlobalFilter,
	);
	const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
		tableHook;

	///////////////
	// Fragments //
	///////////////

	const modals = () => <></>;

	////////////
	// Render //
	////////////

	return (
		<div style={style} className={styles.RequestTableContainer}>
			{/* Table Header */}
			{!isLoading && (
				<div className={styles.searchHeader}>
					<SearchBar
						onChange={(event: any) => search(event.target.value)}
						style={{ width: '100%', marginRight: 16 }}
					/>
				</div>
			)}

			{/* Standard React-Table setup */}
			<div className={styles.RequestTable}>
				<div className={styles.Container} ref={containerRef}>
					{/* List View */}
					{!isLoading && (
						<table {...getTableProps()} className={styles.RequestTable}>
							<thead>
								{headerGroups.map((headerGroup) => (
									<tr {...headerGroup.getHeaderGroupProps()}>
										{headerGroup.headers.map((column) => (
											<th {...column.getHeaderProps()}>
												{column.render('Header')}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody {...getTableBodyProps()}>
								{!isLoading &&
									rows.map((row) => {
										prepareRow(row);
										return (
											<tr
												onClick={() => console.log('Row click')}
												{...row.getRowProps()}
											>
												{row.cells.map((cell) => (
													<td {...cell.getCellProps()}>
														{cell.render('Cell')}
													</td>
												))}
											</tr>
										);
									})}
							</tbody>
						</table>
					)}
					{/* No Search Results Message */}
					{!isLoading &&
						(searchQuery.length > 0 || statusFilter.length > 0) &&
						displayData.length === 0 && (
							<p className={styles.Message}>No results!</p>
						)}

					{/* Data Loading Message */}
					{isLoading && (
						<>
							<p style={{ paddingBottom: 16 }} className={styles.Message}>
								Loading Your Bids
							</p>
							<Spinner style={{ margin: '0 auto' }} />
						</>
					)}

					{/* Empty Table Message */}
					{/* {!isLoading && requests.length === 0 && (
						<p className={styles.Message}>Nothing here!</p>
					)} */}
				</div>
			</div>
		</div>
	);
};

export default BidTable;
