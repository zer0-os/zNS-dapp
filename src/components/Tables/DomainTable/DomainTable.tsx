import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Column, useTable, useGlobalFilter, useFilters } from 'react-table';
import { Spring, animated } from 'react-spring';

//- Component Imports
import {
	Artwork,
	FutureButton,
	IconButton,
	SearchBar,
	Overlay,
} from 'components';
import { MakeABid } from 'containers';
import HighestBid from './HighestBid';
import NumBids from './NumBids';

//- Library Imports
import 'lib/react-table-config.d.ts';
import { getRelativeDomainPath } from 'lib/utils/domains';
import {
	Bid,
	DisplayDomain,
	Domain,
	DomainHighestBid,
	Metadata,
	DomainData,
} from 'lib/types';
import useMvpVersion from 'lib/hooks/useMvpVersion';
import { useBidProvider } from 'lib/providers/BidProvider';

//- Style Imports
import styles from './DomainTable.module.css';

//- Asset Imports
import grid from './assets/grid.svg';
import list from './assets/list.svg';
import { domain } from 'process';

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
	onRowButtonClick?: (domain: DomainData) => void;
	onRowClick?: (domain: Domain) => void;
	rowButtonText?: string;
	// TODO: Find a better way to persist grid view than with props
	setIsGridView?: (grid: boolean) => void;
	style?: React.CSSProperties;
	userId?: string;
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

	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [containerHeight, setContainerHeight] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');

	const [modal, setModal] = useState<Modals | undefined>();

	// Data state
	const [biddingOn, setBiddingOn] = useState<Domain | undefined>();
	const [allBidData, setAllBidData] = useState<DomainData[] | undefined>();

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

	const buttonClick = (domain: Domain) => {
		// @todo refactor this into a more generic component
		if (onRowButtonClick) {
			// @todo the above assumes the bids come in ascending order
			try {
				// const bid = allBidData?.filter(
				// 	(data: DomainData) => data.domain.id === domain.id,
				// )[0].bids[0];
				// if (bid === undefined) return;
				// onRowButtonClick({
				// 	domain: domain,
				// 	bid: bid,
				// });
			} catch {
				console.warn('No bids found for domain ', domain.name);
			}
			return;
		}
		// Default behaviour
		try {
			if (domain?.owner.id.toLowerCase() !== userId?.toLowerCase()) {
				setBiddingOn(domain);
				openBidModal();
			}
		} catch (e) {
			console.error(e);
		}
	};

	const handleResize = () => {
		if (window.innerWidth < 1282) setList();
	};

	const getAllBids = () => {
		// Get bids for all the domains, and add to the state object
		const allBids: DomainData[] = [];
		var checked = 0;
		domains.forEach(async (domain: Domain) => {
			const bids = await getBidsForDomain(domain);
			if (bids && bids.length) allBids.push({ domain, bids });
			if (++checked === domains.length) {
				setAllBidData(allBids);
			}
		});
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
	}, [isLoading, searchQuery, isGridView, domains]);

	useEffect(() => {
		setIsLoading(false);
		if (domains.length > 0) getAllBids();
	}, [domains]);

	/////////////////
	// React Table //
	/////////////////

	const data = domains;

	const columns = useMemo<Column<Domain>[]>(
		() => [
			{
				Header: '',
				id: 'index',
				accessor: (data: Domain, i: number) => i + 1,
			},
			{
				Header: () => <div style={{ textAlign: 'left' }}>Domain</div>,
				id: 'image',
				accessor: (data: Domain) => (
					<Artwork
						domain={data.name}
						metadataUrl={data.metadata}
						id={data.id}
					/>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Highest Bid</div>,
				id: 'highestBid',
				accessor: (domain: Domain) => (
					<div style={{ textAlign: 'right' }}>
						<HighestBid domain={domain} />
					</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Num. Bids</div>,
				id: 'numBids',
				accessor: (domain: Domain) => (
					<div style={{ textAlign: 'right' }}>
						<NumBids domain={domain} />
					</div>
				),
			},
			{
				id: 'bid',
				accessor: (domain: Domain) => {
					const shouldGlow =
						userId?.toLowerCase() !== domain.owner.id.toLowerCase();

					return (
						<>
							{!rowButtonText && (
								<FutureButton
									style={{ marginLeft: 'auto', textTransform: 'uppercase' }}
									glow={shouldGlow}
									onClick={() => buttonClick(domain)}
								>
									{rowButtonText || 'Make A Bid'}
								</FutureButton>
							)}
						</>
					);
				},
			},
		],
		[domains],
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
						{!empty && !isGridView && (
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
												onClick={(event: any) => rowClick(event, row.original)}
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
						{!empty && isGridView && (
							<ol className={styles.Grid}>
								{/* {data
									.filter((d) => d.name.includes(searchQuery))
									.map((d, i) => (
										<li onClick={() => navigateTo(d.name)} key={i}>
											<NFTCard
												name={d.metadata.title || d.name || ''}
												domain={d.domain.name || ''}
												imageUri={d.metadata.image || ''}
												price={d.bids[0]?.amount || 0}
												nftOwnerId={'Owner Name'}
												nftMinterId={'Minter Name'}
												showCreator={true}
												showOwner={true}
											/>
										</li>
									))} */}
							</ol>
						)}

						{empty && <p className={styles.Empty}>No domains found</p>}
					</div>

					<Spring to={{ height: containerHeight }}>
						{(styles) => (
							<animated.div style={styles}>
								<div></div>
							</animated.div>
						)}
					</Spring>
				</div>
			</div>
		</>
	);
};

export default DomainTable;
