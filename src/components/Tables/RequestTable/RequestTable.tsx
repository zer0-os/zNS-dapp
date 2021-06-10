import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Column, useTable, useGlobalFilter, useFilters } from 'react-table';

//- Component Imports
import { SearchBar, IconButton, Member } from 'components';

//- Library Imports
import styles from './RequestTable.module.css';

//- Type Imports
import { DomainRequestContents } from 'lib/types';

//- Asset Imports
import grid from './assets/grid.svg';
import list from './assets/list.svg';

type RequestTableProps = {
	requests: DomainRequestContents[];
	style?: React.CSSProperties;
};

// @TODO: Create a `Domain` type for `domains`
const DomainTable: React.FC<RequestTableProps> = ({ requests, style }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerHeight, setContainerHeight] = useState(0);

	const rowData: DomainRequestContents[] = useMemo(() => requests, [requests]);
	const data = useMemo<DomainRequestContents[]>(() => rowData, [rowData]);

	const [isGridView, setIsGridView] = useState(false);

	const setList = () => setIsGridView(false);
	const setGrid = () => setIsGridView(true);

	const search = (query: string) => {
		console.log(query);
	};

	useEffect(() => {
		const el = containerRef.current;
		if (el)
			setContainerHeight(isGridView ? el.clientHeight + 30 : el.clientHeight);
	}, [rowData]);

	const columns = useMemo<Column<DomainRequestContents>[]>(
		() => [
			{
				id: 'index',
				accessor: (d: any, i: any) => <span>{i + 1}</span>,
			},
			{
				Header: 'Creator',
				id: 'creator',
				accessor: (d: any) => (
					<Member id={d.requestor} name={'Hello'} image={'hello'} />
				),
			},
			{
				Header: 'Creator',
				id: 'artwork',
				accessor: (d: any) => <>0://wilder.{d.domain}</>,
			},
			{
				Header: 'Request Date',
				id: 'date',
				accessor: (d: any) => <span>13.03.2021 08:22</span>,
			},
			{
				Header: 'Staked Tokens',
				id: 'stake',
				accessor: (d: any) => <span>{d.stakeAmount} WILD</span>,
			},
			{
				id: 'accepted',
				accessor: (d: any) => (
					<>
						{d.accepted && <span>accepted</span>}
						{!d.accepted && <span>not accepted</span>}
					</>
				),
			},
		],
		[rowData],
	);

	// React-Table Hooks
	const tableHook = useTable<DomainRequestContents>(
		{ columns, data },
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

	return (
		<div style={style} className={styles.RequestTableContainer}>
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

			<div className={styles.RequestTable}>
				<div className={styles.Container} ref={containerRef}>
					{/* List View */}
					{!isGridView && (
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
								{rows.map((row) => {
									prepareRow(row);
									return (
										<tr {...row.getRowProps()}>
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
							{data.map((d, i) => (
								<li key={i}></li>
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
