import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Column, useTable, useGlobalFilter, useFilters } from 'react-table';

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
} from 'lib/types';
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
	const [isLoading, setIsLoading] = useState(true);

	const [containerHeight, setContainerHeight] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');

	const [modal, setModal] = useState<Modals | undefined>();
	const [biddingOn, setBiddingOn] = useState<DisplayDomain | undefined>();

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

	const getBidData = async (domain: Domain) => {
		// console.log(domain);
		return [];
	};

	const getHighestBid = async (domain: Domain) => {
		setTimeout(() => ({ amount: 5 }), 1000);
		// console.log(domain);
		// return { amount: 5 };
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
						{isGridView && (
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
