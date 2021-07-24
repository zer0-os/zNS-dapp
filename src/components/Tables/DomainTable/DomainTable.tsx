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
import { getRelativeDomainPath } from 'lib/domains';
import { DisplayDomain, Domain, DomainHighestBid, Metadata } from 'lib/types';
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
	domains: DisplayDomain[];
	empty?: boolean;
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
	bids: any | undefined;
};

enum Modals {
	Bid,
}

const DomainTable: React.FC<DomainTableProps> = ({
	className,
	domains,
	empty,
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
	const { getBidsForDomain, getBidsFromDomainIds } = useBidProvider();

	const [hasMetadataLoaded, setHasMetadataLoaded] = useState(false);
	const [hasBidDataLoaded, setHasBidDataLoaded] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const [containerHeight, setContainerHeight] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');

	const [modal, setModal] = useState<Modals | undefined>();
	const [biddingOn, setBiddingOn] = useState<DisplayDomain | undefined>();

	const [loadedDomains, setLoadedDomains] = useState<DomainData[]>([]);

	const containerRef = useRef<HTMLDivElement>(null);

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

	const getData = () => {};

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
	}, [isLoading, searchQuery, isGridView]);

	// Gets metadata for each NFT in domain list
	useEffect(() => {
		const loaded: DomainData[] = [];
		setHasMetadataLoaded(false);
		var count = 0,
			completed = 0;

		// Get metadata
		const getData = async (domain: DisplayDomain) => {
			try {
				const [metadata, bids] = await Promise.all([
					getMetadata(domain.metadata),
					getBidsForDomain(domain),
				]);

				if (!metadata) return;

				loaded.push({ domain: domain, metadata: metadata, bids: bids || [] });
				if (++completed === count) {
					setLoadedDomains(loaded);
					setHasMetadataLoaded(true);
				}
			} catch (e) {}
		};

		for (var i = 0; i < domains.length; i++) {
			if (!domains[i].metadata) return;
			count++;
			getData(domains[i]);
		}

		if (!count) {
			setHasMetadataLoaded(true);
			setIsLoading(false);
		}
	}, [domains]);

	useEffect(() => {
		if (!isLoading && onLoad) onLoad();
	}, [isLoading]);

	/////////////////
	// React Table //
	/////////////////

	// Gets the data for the table
	// TODO: This can definitely be refactored out
	const data = useMemo<DomainData[]>(() => {
		loadedDomains.length ? setIsLoading(false) : setIsLoading(true);
		return loadedDomains;
	}, [loadedDomains, hasBidDataLoaded]);

	const columns = useMemo<Column<DomainData>[]>(
		() => [
			{
				Header: '',
				id: 'index',
				accessor: (data: DomainData, i: number) => i + 1,
			},
			{
				Header: () => '',
				id: 'image',
				accessor: (data: DomainData) => (
					<Image
						style={{
							width: 56,
							height: 56,
							borderRadius: isRootDomain ? '50%' : 'calc(var(--box-radius)/2)',
							objectFit: 'cover',
							display: 'block',
						}}
						src={data.metadata.image}
					/>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'left' }}>Domain Name</div>,
				id: 'domainName',
				accessor: (data: DomainData) => (
					<div style={{ textAlign: 'left' }}>{data.domain.name}</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Highest Bid</div>,
				id: 'highestBid',
				accessor: (data: DomainData) => (
					<div style={{ textAlign: 'right' }}>
						{data.bids.length > 0 && (
							<>
								{Number(
									Math.max
										.apply(
											Math,
											data.bids.map(function (o: any) {
												return o.amount;
											}),
										)
										.toFixed(2),
								).toLocaleString()}{' '}
								WILD
							</>
						)}
						{data.bids.length === 0 && 0}
					</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Number Of Bids</div>,
				id: 'numBids',
				accessor: (data: DomainData) => (
					<div style={{ textAlign: 'right' }}>
						{Number(data.bids.length).toLocaleString()}
					</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Last Sale Price</div>,
				id: 'lastSalePrice',
				accessor: (data: DomainData) => (
					<div style={{ textAlign: 'right' }}>
						{data.bids.length > 0 && (
							<>
								{Number(data.bids[0].amount.toFixed(2)).toLocaleString()} WILD
							</>
						)}
						{data.bids.length === 0 && <>-</>}
					</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'center' }}>Trade</div>,
				id: 'waitlist',
				accessor: (data: DomainData) => (
					<FutureButton
						style={{ margin: '0 auto' }}
						glow
						onClick={() => buttonClick(data)}
					>
						WAITLIST
					</FutureButton>
				),
			},
			{
				id: 'bid',
				accessor: (data: DomainData) => {
					// @todo this is a temporary fix
					const shouldGlow = rowButtonText
						? data.bids.length > 0
						: data.domain.owner.id?.toLowerCase() !== userId?.toLowerCase();

					return (
						<>
							{rowButtonText && !shouldGlow && (
								<div style={{ textAlign: 'center', opacity: 0.7 }}>No bids</div>
							)}
							{(!rowButtonText || shouldGlow) && (
								<FutureButton
									style={{ margin: '0 auto', textTransform: 'uppercase' }}
									glow={shouldGlow}
									onClick={() => buttonClick(data)}
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
		[mvpVersion, domains],
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
