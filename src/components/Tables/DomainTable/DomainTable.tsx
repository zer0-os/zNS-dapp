import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Column, useTable, useGlobalFilter, useFilters } from 'react-table';

//- Component Imports
import {
	FutureButton,
	IconButton,
	SearchBar,
	Image,
	NFTCard,
	Overlay,
} from 'components';
import { MakeABid } from 'containers';

//- Library Imports
import 'lib/react-table-config.d.ts';
import { getRelativeDomainPath } from 'lib/utils/domains';
import {
	Bid,
	DisplayDomain,
	Domain,
	DomainHighestBid,
	Metadata,
} from 'lib/types';
import { getMetadata } from 'lib/metadata';
import { useBidProvider } from 'lib/providers/BidProvider';
import useMvpVersion from 'lib/hooks/useMvpVersion';

//- Style Imports
import styles from './DomainTable.module.css';

//- Asset Imports
import grid from './assets/grid.svg';
import list from './assets/list.svg';

// TODO: Need some proper type definitions for an array of domains
type DomainTableProps = {
	className?: string;
	domains: Domain[];
	empty?: boolean;
	hideOwnBids?: boolean;
	isButtonActive?: (row: any) => boolean;
	isGridView?: boolean;
	isRootDomain: boolean;
	onLoad?: () => void;
	onRowButtonClick?: (domain: DomainHighestBid) => void;
	onRowClick?: (domain: Domain) => void;
	rowButtonText?: string;
	// TODO: Find a better way to persist grid view than with props
	setIsGridView?: (grid: boolean) => void;
	style?: React.CSSProperties;
	userId?: string;
};

type DomainData = {
	domain: Domain;
	metadata: Metadata;
	bids: Bid[];
};

enum Modals {
	Bid,
}

const DomainTable: React.FC<DomainTableProps> = ({
	className,
	domains,
	empty,
	hideOwnBids,
	isButtonActive,
	isGridView,
	isRootDomain,
	onLoad,
	onRowButtonClick,
	onRowClick,
	rowButtonText,
	setIsGridView,
	style,
	userId,
}) => {
	const { mvpVersion } = useMvpVersion();
	const { getBidsForDomain } = useBidProvider();
	const [isLoading, setIsLoading] = useState(true);
	const [containerHeight, setContainerHeight] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');
	const [modal, setModal] = useState<Modals | undefined>();
	const [biddingOn, setBiddingOn] = useState<DisplayDomain | undefined>();
	const [fetchedData, setFetchedData] = useState<DomainData[]>([]);
	const [tableData, setTableData] = useState<DomainData[]>([]);
	const [resizeTrigger, setResizeTrigger] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const firstChunkLength = 5; //this is the length of the first chunk that needs to be feeded as soon as fetched
	///////////////
	// Functions //
	///////////////

	// Table views
	const setGrid = () => setIsGridView && setIsGridView(true);
	const setList = () => setIsGridView && setIsGridView(false);

	// Modals
	const openBidModal = () => setModal(Modals.Bid);
	const closeModal = () => setModal(undefined);

	//Click handlers
	const rowClick = (event: any, domain: Domain) => {
		if (onRowClick) {
			onRowClick(domain);
			return;
		}
		// @TODO Decouple this line from classname
		if (event.target.className.indexOf('FutureButton') >= 0) return;
		navigateTo(domain.name);
	};

	const buttonClick = (data: DomainData) => {
		// @todo refactor this into a more generic component
		if (onRowButtonClick) {
			// @todo the above assumes the bids come in ascending order
			onRowButtonClick({
				domain: data.domain,
				bid: data.bids[data.bids.length - 1],
			});
			return;
		}

		// Default behaviour
		try {
			if (data.domain?.owner.id.toLowerCase() !== userId?.toLowerCase()) {
				setBiddingOn(data.domain as DisplayDomain);
				openBidModal();
			}
		} catch (e) {
			console.error(e);
		}
	};

	const handleResize = () => {
		if (window.innerWidth < 1282) setList();
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setIsLoading(true);
	}, [domains]);

	useEffect(() => {
		console.log('domains changes');
		console.log(domains);
	}, [domains]);

	// Resizes the table container
	// (The animation is done in CSS)
	useEffect(() => {
		if (!isLoading) {
			const el = containerRef.current;
			if (el)
				setContainerHeight(isGridView ? el.clientHeight + 30 : el.clientHeight);
		} else {
			setContainerHeight(0);
		}
	}, [isLoading, searchQuery, isGridView, resizeTrigger]);

	// Gets metadata for each NFT in domain list
	useEffect(() => {
		// Get metadata
		setTableData([]); //reset data when domains changes
		setFetchedData([]);
		let completed = 0;
		const getData = async (domain: Domain) => {
			try {
				const [metadata, bids] = await Promise.all([
					getMetadata(domain.metadata),
					getBidsForDomain(domain),
				]);

				completed++;

				if (completed === domains.length) {
					if (onLoad) {
						onLoad();
					}
				}

				if (!metadata) {
					console.log(`found no metadata for ${domain.id}`);
					return;
				}

				// Filter out user's bids if configured to do so
				let filteredBids;
				if (hideOwnBids) {
					filteredBids = bids?.filter(
						(bid: Bid) => bid.bidderAccount !== userId,
					);
				}

				const loaded = fetchedData;

				loaded.push({
					domain: domain,
					metadata: metadata,
					bids: filteredBids || bids || [],
				});

				if (completed <= firstChunkLength)
					//first chunk will be feeded as soon as its fetched
					feed();

				setFetchedData(loaded);
			} catch (e) {}
		};

		if (domains.length > 0) {
			for (let i = 0; i < domains.length; i++) {
				if (!domains[i].metadata) continue;
				getData(domains[i]);
			}
		}
	}, [domains]); //@todo: page will change 3 times the domains at start, need to fix that

	useEffect(() => {
		if (!isLoading && onLoad) onLoad();
	}, [isLoading]);

	/////////////////////
	///// Functions /////
	/////////////////////

	//Function for Brett to test with new UI changes
	//This will be called when user reachs the bottom of the page, and will be called until we have the first chunk loadedat start
	//On each call it feed one domain

	const feed = () => {
		setIsLoading(false);

		const cachedData = tableData; //last data feeded

		cachedData.push(fetchedData[cachedData.length]);

		setTableData(cachedData); //replace last data feeded with new

		setResizeTrigger(true);
		setResizeTrigger(false); //trigger resize after feed
	};

	/////////////////
	// React Table //
	/////////////////

	const data = React.useMemo(() => tableData, [tableData.length]); //if you feed then the data of the table changes

	const columns = useMemo<Column<DomainData>[]>(
		() => [
			{
				Header: '',
				id: 'index',
				accessor: (tableData: DomainData, i: number) => i + 1,
			},
			{
				Header: () => '',
				id: 'image',
				accessor: (tableData: DomainData) => (
					<Image
						style={{
							width: 56,
							height: 56,
							borderRadius: isRootDomain ? '50%' : 'calc(var(--box-radius)/2)',
							objectFit: 'cover',
							display: 'block',
						}}
						src={tableData.metadata.image}
					/>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'left' }}>Domain Name</div>,
				id: 'domainName',
				accessor: (tableData: DomainData) => (
					<div style={{ textAlign: 'left' }}>{tableData.domain.name}</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Highest Bid</div>,
				id: 'highestBid',
				accessor: (tableData: DomainData) => (
					<div style={{ textAlign: 'right' }}>
						{tableData.bids.length > 0 && (
							<>
								{Number(
									Math.max
										.apply(
											Math,
											tableData.bids.map(function (o: any) {
												return o.amount;
											}),
										)
										.toFixed(2),
								).toLocaleString()}{' '}
								WILD
							</>
						)}
						{tableData.bids.length === 0 && 0}
					</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Number Of Bids</div>,
				id: 'numBids',
				accessor: (tableData: DomainData) => (
					<div style={{ textAlign: 'right' }}>
						{Number(tableData.bids.length).toLocaleString()}
					</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Last Sale Price</div>,
				id: 'lastSalePrice',
				accessor: (tableData: DomainData) => (
					<div style={{ textAlign: 'right' }}>
						{tableData.bids.length > 0 && (
							<>
								{Number(tableData.bids[0].amount.toFixed(2)).toLocaleString()}{' '}
								WILD
							</>
						)}
						{tableData.bids.length === 0 && <>-</>}
					</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'center' }}>Trade</div>,
				id: 'waitlist',
				accessor: (tableData: DomainData) => (
					<FutureButton
						style={{ margin: '0 auto' }}
						glow
						onClick={() => buttonClick(tableData)}
					>
						WAITLIST
					</FutureButton>
				),
			},
			{
				id: 'bid',
				accessor: (tableData: DomainData) => {
					// @todo this is a temporary fix
					const shouldGlow = rowButtonText
						? tableData.bids.length > 0
						: tableData.domain.owner.id?.toLowerCase() !==
						  userId?.toLowerCase();

					return (
						<>
							{rowButtonText && !shouldGlow && (
								<div style={{ textAlign: 'center', opacity: 0.7 }}>No bids</div>
							)}
							{(!rowButtonText || shouldGlow) && (
								<FutureButton
									style={{ margin: '0 auto', textTransform: 'uppercase' }}
									glow={shouldGlow}
									onClick={() => buttonClick(tableData)}
								>
									{rowButtonText || 'Make A Bid'}
								</FutureButton>
							)}
						</>
					);
				},
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[mvpVersion, domains, userId, tableData.length], //when new data its feeded, it rebuilds the table
	);

	// Navigation Handling
	const history = useHistory();
	const navigateTo = (domain: string) => {
		const relativeDomain = getRelativeDomainPath(domain);
		history.push(relativeDomain);
	};
	const initialState = { hiddenColumns: ['waitlist', 'lastSalePrice'] };

	// React-Table Hooks
	const tableHook = useTable(
		{ columns, data, initialState },
		useFilters,
		useGlobalFilter,
	);
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		rows,
		setGlobalFilter,
	} = tableHook;

	const search = (query: string) => {
		setGlobalFilter(query);
		setSearchQuery(query);
	};

	/////////////////////
	// React Fragments //
	/////////////////////

	const overlays = () => (
		<Overlay onClose={closeModal} centered open={modal === Modals.Bid}>
			<MakeABid domain={biddingOn!} onBid={closeModal} />
		</Overlay>
	);

	////////////
	// Render //
	////////////

	return (
		<>
			{overlays()}
			<div
				style={style}
				className={`${
					styles.DomainTableContainer
				} border-primary border-rounded blur ${className || ''}`}
			>
				{/* Table Header */}
				<div className={styles.searchHeader}>
					<SearchBar
						onChange={(event: any) => search(event.target.value)}
						style={{ width: '100%', marginRight: 16 }}
					/>
					<div className={styles.searchHeaderButtons}>
						<IconButton
							onClick={setList}
							toggled={!isGridView}
							iconUri={list}
							style={{ height: 32, width: 32 }}
						/>
						<IconButton
							onClick={setGrid}
							toggled={isGridView}
							iconUri={grid}
							style={{ height: 32, width: 32 }}
						/>
					</div>
				</div>

				<div className={styles.DomainTable}>
					<div className={styles.Container} ref={containerRef}>
						{/* List View */}
						{!isGridView && (
							<table {...getTableProps()} className={styles.DomainTable}>
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
									{rows.map((row) => {
										prepareRow(row);
										return (
											<tr
												onClick={(event: any) =>
													rowClick(event, row.original.domain)
												}
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

						{/* Grid View */}
						{isGridView && (
							<ol className={styles.Grid}>
								{data
									.filter((d) => d.domain.name.includes(searchQuery))
									.map((d, i) => (
										<li onClick={() => navigateTo(d.domain.name)} key={i}>
											<NFTCard
												name={d.metadata.title || d.domain.name || ''}
												domain={d.domain.name || ''}
												imageUri={d.metadata.image || ''}
												price={d.bids[0]?.amount || 0}
												nftOwnerId={'Owner Name'}
												nftMinterId={'Minter Name'}
												showCreator={true}
												showOwner={true}
											/>
										</li>
									))}
							</ol>
						)}
					</div>
					<div
						style={{ height: containerHeight }}
						className={styles.Expander}
					></div>
				</div>
			</div>
		</>
	);
};

export default DomainTable;
