/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useRef } from 'react';
import { Column, useTable, useGlobalFilter, useFilters } from 'react-table';

//- Component Imports
import {
	Artwork,
	Confirmation,
	FilterButton,
	FutureButton,
	Image,
	OptionDropdown,
	Overlay,
	SearchBar,
} from 'components';
import { Request } from 'containers';

//- Library Imports
import { randomImage, randomName } from 'lib/Random';
import { DisplayDomain } from 'lib/types';
import { ethers } from 'ethers';

//- Style Imports
import styles from './BidTable.module.css';

type BidTableProps = {
	style?: React.CSSProperties;
	userId: string;
};

const BidTable: React.FC<BidTableProps> = ({ style, userId }) => {
	//////////////////
	// State / Refs //
	//////////////////

	const containerRef = useRef<HTMLDivElement>(null);
	const [containerHeight, setContainerHeight] = useState(0); // Not needed anymore?

	// Searching
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [domainFilter, setDomainFilter] = useState('');

	const [isLoading, setIsLoading] = useState(false); // Not needed anymore?

	//////////
	// Data //
	//////////

	const displayData = [{}, {}, {}, {}];

	///////////////
	// Functions //
	///////////////

	/* Sets some search parameters
		 There's a hook listening to each of these variables */
	const search = (query: string) => setSearchQuery(query);
	const filterByStatus = (filter: string) => console.log(filter);
	const filterByDomain = (filter: string) => console.log(filter);

	/////////////
	// Effects //
	/////////////

	/////////////////
	// React-Table //
	/////////////////

	// Column Setup
	const columns = useMemo<Column<any>[]>(
		() => [
			{
				Header: () => <div style={{ textAlign: 'left' }}>Domain</div>,
				accessor: 'domain',
				Cell: () => (
					<Artwork
						id={'lorem'}
						name={'lorem'}
						image={'picsum.photos/seed/lorem/100/100'}
						domain={'0://lorem.ipsum'}
						pending
					/>
				),
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Highest Bid</div>,
				accessor: 'highestBid',
				Cell: () => <div style={{ textAlign: 'right' }}>1000 WILD</div>,
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Number Of Bids</div>,
				accessor: 'numBids',
				Cell: () => <div style={{ textAlign: 'right' }}>500</div>,
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Last Sale Price</div>,
				accessor: 'lastSalePrice',
				Cell: () => <div style={{ textAlign: 'right' }}>1000 WILD</div>,
			},
			{
				Header: () => <div style={{ textAlign: 'right' }}>Your Bid</div>,
				accessor: 'yourBid',
				Cell: () => <div style={{ textAlign: 'right' }}>1500 WILD</div>,
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
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		rows,
	} = tableHook;

	return (
		<div style={style} className={styles.RequestTableContainer}>
			{/* Table Header */}
			<div className={styles.searchHeader}>
				<SearchBar
					onChange={(event: any) => search(event.target.value)}
					style={{ width: '100%', marginRight: 16 }}
				/>
				<div className={styles.searchHeaderButtons}>
					<OptionDropdown
						onSelect={filterByDomain}
						options={['All Domains', 'Your Domains', 'Your Bids']}
						drawerStyle={{ width: 179 }}
					>
						<FilterButton onClick={() => {}}>
							{domainFilter || 'All Domains'}
						</FilterButton>
					</OptionDropdown>
					<OptionDropdown
						onSelect={filterByStatus}
						options={['All Statuses', 'Pending Bids', 'Accepted Bids']}
						drawerStyle={{ width: 179 }}
					>
						<FilterButton onClick={() => {}}>
							{statusFilter || 'All Statuses'}
						</FilterButton>
					</OptionDropdown>
				</div>
			</div>

			{/* Standard React-Table setup */}
			<div className={styles.RequestTable}>
				<div className={styles.Container} ref={containerRef}>
					{/* List View */}
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
												<td {...cell.getCellProps()}>{cell.render('Cell')}</td>
											))}
										</tr>
									);
								})}
						</tbody>
					</table>
					{/* No Search Results Message */}
					{!isLoading &&
						(searchQuery.length > 0 || statusFilter.length > 0) &&
						displayData.length === 0 && (
							<p className={styles.Message}>No results!</p>
						)}

					{/* Data Loading Message */}
					{isLoading && (
						<p className={styles.Message}>Loading Domain Requests</p>
					)}

					{/* Empty Table Message */}
					{/* {!isLoading && requests.length === 0 && (
						<p className={styles.Message}>Nothing here!</p>
					)} */}
				</div>

				{/* Expander for animating height (@TODO Remove this functionality) */}
				<div
					style={{ height: containerHeight }}
					className={styles.Expander}
				></div>
			</div>
		</div>
	);
};

export default BidTable;
