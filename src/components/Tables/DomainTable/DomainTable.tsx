/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Column, useTable, useGlobalFilter, useFilters } from 'react-table';
import { Spring, animated } from 'react-spring';

//- Component Imports
import { Artwork, NFTCard, SearchBar, Overlay, IconButton } from 'components';
import { BidButton, MakeABid } from 'containers';
import HighestBid from './components/HighestBid';
import NumBids from './components/NumBids';
import NFTCardActions from './components/NFTCardActions';
import ViewBids from './components/ViewBids';

//- Library Imports
import 'lib/react-table-config.d.ts';
import { Domain, DomainData } from 'lib/types';

//- Style Imports
import styles from './DomainTable.module.scss';

//- Asset Imports
import grid from './assets/grid.svg';
import list from './assets/list.svg';

// TODO: Need some proper type definitions for an array of domains
type DomainTableProps = {
	className?: string;
	disableButton?: boolean;
	filterOwnBids?: boolean;
	domains: Domain[];
	empty?: boolean;
	ignoreAspectRatios?: boolean;
	isButtonActive?: (row: any) => boolean;
	isGlobalTable?: boolean;
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
	disableButton,
	filterOwnBids,
	domains,
	empty,
	ignoreAspectRatios,
	isButtonActive,
	isGlobalTable,
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
	const isMounted = useRef(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const [containerHeight, setContainerHeight] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');

	const [modal, setModal] = useState<Modals | undefined>();

	// Data state
	const [biddingOn, setBiddingOn] = useState<Domain | undefined>();

	const [domainToRefresh, setDomainToRefresh] = useState<string>('');

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
		if (event.target.className.indexOf('FutureButton') >= 0) return;
		if (onRowClick) {
			onRowClick(domain);
			return;
		}
	};

	const buttonClick = (domain: Domain) => {
		if (disableButton) return;
		// Default behaviour
		try {
			if (
				isGlobalTable &&
				domain?.owner.id.toLowerCase() !== userId?.toLowerCase()
			) {
				if (!isMounted.current) return;
				setBiddingOn(domain);
				openBidModal();
			}
		} catch (e) {
			console.error(e);
		}
	};

	const handleResize = () => {
		if (window.innerWidth <= 700) setGrid();
		checkHeight();
	};

	const checkHeight = () => {
		const height = containerRef.current?.offsetHeight;
		if (height === undefined && containerHeight === height) return;
		setContainerHeight(height || 0);
	};

	const onBid = async () => {
		closeModal();

		if (biddingOn && isMounted.current) {
			setDomainToRefresh(biddingOn.id);
			// Need to reset this in case the user
			// is bidding on the same domain twice
			setTimeout(() => {
				setDomainToRefresh('');
			}, 1000);
		}
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		isMounted.current = true;
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			isMounted.current = false;
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		if (!userId) {
			setBiddingOn(undefined);
			closeModal();
		}
	}, [userId]);

	useEffect(() => {
		if (!isMounted.current) return;
		if (onLoad) onLoad();
	}, [domains]);

	useEffect(() => {
		checkHeight();
	}, [containerRef.current?.offsetHeight, searchQuery, isGridView]);

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
				accessor: ({ name }) => name,
				Cell: (row: any) => (
					<Artwork
						domain={row.row.original.name}
						disableInteraction
						metadataUrl={row.row.original.metadata}
						id={row.row.original.id}
						style={{ maxWidth: 200 }}
					/>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Highest Bid</div>,
				id: 'highestBid',
				accessor: (domain: Domain) => (
					<div style={{ textAlign: 'right' }}>
						<HighestBid domain={domain} refreshKey={domainToRefresh} />
					</div>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}># Of Bids</div>,
				id: 'numBids',
				accessor: (domain: Domain) => (
					<div style={{ textAlign: 'right' }}>
						<NumBids
							domain={domain}
							refreshKey={domainToRefresh}
							filterOwnBids={filterOwnBids}
						/>
					</div>
				),
			},
			{
				id: 'bid',
				accessor: (domain: Domain) => {
					return (
						<>
							{isGlobalTable && (
								<BidButton
									style={{ marginLeft: 'auto', textTransform: 'uppercase' }}
									glow={
										userId !== undefined &&
										userId?.toLowerCase() !== domain.owner.id.toLowerCase()
									}
									onClick={() => buttonClick(domain)}
								>
									Make A Bid
								</BidButton>
							)}
							{!isGlobalTable && onRowButtonClick && (
								<ViewBids
									style={{ marginLeft: 'auto', textTransform: 'uppercase' }}
									domain={domain}
									onClick={onRowButtonClick}
									filterOwnBids={filterOwnBids}
								/>
							)}
						</>
					);
				},
			},
		],
		[domains, userId, domainToRefresh],
	);

	// Navigation Handling
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
		if (!isMounted.current) return;
		setGlobalFilter(query);
		setSearchQuery(query);
	};

	/////////////////////
	// React Fragments //
	/////////////////////

	const overlays = () => {
		return (
			<>
				{userId && (
					<Overlay
						onClose={closeModal}
						open={modal === Modals.Bid && biddingOn !== undefined}
					>
						<MakeABid domain={biddingOn!} onBid={onBid} />
					</Overlay>
				)}
			</>
		);
	};

	const nftCardActionComponent = (domain: Domain) => {
		return (
			<NFTCardActions
				domain={domain}
				disableButton={
					!userId || userId?.toLowerCase() === domain.owner.id.toLowerCase()
				}
				hideButton={!isGlobalTable}
				onButtonClick={buttonClick}
				onLoad={checkHeight}
			/>
		);
	};

	////////////
	// Render //
	////////////

	return (
		<>
			{overlays()}
			<div
				style={style}
				className={`
				${styles.DomainTableContainer} 
				${className || ''}
				${isGlobalTable ? styles.Global : styles.Nested}
				border-primary border-rounded 				
				`}
			>
				{/* Table Header */}
				<div className={styles.searchHeader}>
					<SearchBar
						placeholder="Search by domain name"
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
						{/* @todo re-enable grid view */}
						{!empty && isGridView && (
							<ol className={styles.Grid}>
								{data
									.filter((d) => d.name.includes(searchQuery))
									.map((d, i) => (
										<li onClick={(e) => rowClick(e, d)} key={i}>
											<NFTCard
												actionsComponent={nftCardActionComponent(d)}
												domain={d.name}
												ignoreAspectRatio={ignoreAspectRatios}
												metadataUrl={d.metadata}
												nftOwnerId={d.owner?.id || ''}
												nftMinterId={d.minter?.id || ''}
												showCreator
												showOwner
												style={{ margin: '0 auto' }}
											/>
										</li>
									))}
							</ol>
						)}

						{empty && <p className={styles.Empty}>No domains found</p>}
					</div>

					<Spring to={{ height: containerHeight }}>
						{(styles) => <animated.div style={styles}></animated.div>}
					</Spring>
				</div>
			</div>
		</>
	);
};

export default DomainTable;
