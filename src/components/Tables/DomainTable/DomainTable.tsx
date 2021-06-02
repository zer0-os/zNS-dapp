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
} from 'components';

//- Library Imports
import 'lib/react-table-config.d.ts';
import useEnlist from 'lib/hooks/useEnlist';
import { getRelativeDomainPath } from 'lib/domains';
import { Domain, Metadata } from 'lib/types';
import { getMetadata } from 'lib/metadata';

//- Style Imports
import styles from './DomainTable.module.css';

//- Asset Imports
import grid from './assets/grid.svg';
import list from './assets/list.svg';

// TODO: Need some proper type definitions for an array of domains
type DomainTableProps = {
	domains: any;
	isRootDomain: boolean;
	style?: React.CSSProperties;
	empty?: boolean;
	mvpVersion: number;
	// TODO: Find a better way to persist grid view than with props
	isGridView?: boolean;
	setIsGridView?: (grid: boolean) => void;
};

type DomainData = {
	domain: Domain;
	metadata: Metadata;
};

interface RowData {
	i: number;
	id: string;
	image: string;
	name: string;
	nftName: string;
	ticker: string;
	lastBid: number;
	numBids: number;
	lastSalePrice: number;
	tradePrice: number;
}

// @TODO: Create a `Domain` type for `domains`
const DomainTable: React.FC<DomainTableProps> = ({
	domains,
	isRootDomain,
	style,
	empty,
	mvpVersion,
	isGridView,
	setIsGridView,
}) => {
	const { enlist } = useEnlist();

	const [hasMetadataLoaded, setHasMetadataLoaded] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [containerHeight, setContainerHeight] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');

	const [loadedDomains, setLoadedDomains] = useState<DomainData[]>([]);

	const containerRef = useRef<HTMLDivElement>(null);

	// Functions
	const setGrid = () => {
		if (setIsGridView) setIsGridView(true);
	};
	const setList = () => {
		if (setIsGridView) setIsGridView(false);
	};

	// Clicks
	const rowClick = (event: any, domain: string) => {
		if (event.target.nodeName.toLowerCase() === 'button') return;
		navigateTo(domain);
	};

	const buttonClick = (id: string) => {
		try {
			// TODO: Get rid of any
			const domain = domains.filter((d: any) => d.id === id)[0];
			enlist(domain);
		} catch (e) {
			console.error(e);
		}
	};

	const handleResize = () => {
		if (window.innerWidth < 1282) setList();
	};

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
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
		for (var i = 0; i < domains.length; i++) {
			const domain = domains[i];
			if (!domain.image && domain.metadata) {
				count++;

				// eslint-disable-next-line no-loop-func
				getMetadata(domain.metadata).then((metadata) => {
					if (!metadata) return;
					loaded.push({ domain: domain, metadata: metadata });
					if (++completed === count) {
						setLoadedDomains(loaded);
						setHasMetadataLoaded(true);
					}
				});
			}
		}
		if (!count) setHasMetadataLoaded(true);
	}, [domains]);

	// Convert each domain into a RowData object
	// Runs when metadata for current domain array has fully loaded
	const rowData: RowData[] = useMemo(
		() =>
			!hasMetadataLoaded
				? []
				: loadedDomains.map((d: any, i: number) => ({
						i: i + 1,
						id: d.domain.id,
						image: d.metadata.image,
						nftName: d.metadata.name,
						name: d.domain.name,
						ticker: d.domain.name.toUpperCase(),
						lastBid: 1000,
						numBids: 1000,
						lastSalePrice: 1000,
						tradePrice: 1000,
				  })),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[hasMetadataLoaded],
	);

	// Gets the data for the table
	// TODO: This can definitely be refactored out
	const data = useMemo<RowData[]>(() => {
		rowData.length ? setIsLoading(false) : setIsLoading(true);
		return rowData;
	}, [rowData]);

	const columns = useMemo<Column<RowData>[]>(
		() => [
			{
				Header: '',
				accessor: 'i',
				Cell: (row) => row.value,
			},
			{
				Header: () => '',
				accessor: 'image',
				Cell: (row) => (
					<Image
						style={{
							width: 56,
							height: 56,
							marginTop: -4,
							borderRadius: isRootDomain ? '50%' : 'calc(var(--box-radius)/2)',
							objectFit: 'cover',
						}}
						src={row.value}
					/>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'left' }}>Domain Name</div>,
				accessor: 'name',
				Cell: (row) => <div style={{ textAlign: 'left' }}>{row.value}</div>,
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Last Bid</div>,
				accessor: 'lastBid',
				Cell: (row) => (
					<div style={{ textAlign: 'right' }}>
						${Number(row.value.toFixed(2)).toLocaleString()}
					</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>No. Of Bids</div>,
				accessor: 'numBids',
				Cell: (row) => (
					<div style={{ textAlign: 'right' }}>
						{Number(row.value).toLocaleString()}
					</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Last Sale Price</div>,
				accessor: 'lastSalePrice',
				Cell: (row) => (
					<div style={{ textAlign: 'right' }}>
						${Number(row.value.toFixed(2)).toLocaleString()}
					</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'center' }}>Trade</div>,
				accessor: 'id',
				Cell: (row) => (
					<FutureButton
						style={{ margin: '0 auto' }}
						glow
						onClick={() => {
							buttonClick(row.value);
						}}
					>
						ENLIST
					</FutureButton>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'center' }}>Trade</div>,
				accessor: 'tradePrice',
				Cell: (row) => (
					<FutureButton style={{ margin: '0 auto' }} glow onClick={() => {}}>
						${Number(row.value.toFixed(2)).toLocaleString()}
					</FutureButton>
				),
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
	const initialState =
		mvpVersion === 1
			? { hiddenColumns: ['lastBid', 'numBids', 'lastSalePrice', 'tradePrice'] }
			: { hiddenColumns: ['id'] };

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

	return (
		<div
			style={style}
			className={
				styles.DomainTableContainer + ' border-primary border-rounded blur'
			}
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
												rowClick(event, row.original.name)
											}
											{...row.getRowProps()}
										>
											{row.cells.map((cell) => (
												<td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
								.filter((d) => d.name.includes(searchQuery))
								.map((d, i) => (
									<li onClick={() => navigateTo(d.name)} key={i}>
										<NFTCard
											name={d.nftName ? d.nftName : d.name}
											domain={d ? d.name : ''}
											imageUri={d.image ? d.image : ''}
											price={d.tradePrice}
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
	);
};

export default DomainTable;
