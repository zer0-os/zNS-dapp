import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Column, useTable, useGlobalFilter, useFilters } from 'react-table';

//- Component Imports
import {
	Artwork,
	SearchBar,
	IconButton,
	Member,
	FutureButton,
	Overlay,
	NFTCard,
} from 'components';
import { Request } from 'containers';

//- Library Imports
import useMvpVersion from 'lib/hooks/useMvpVersion';
import { getMetadata } from 'lib/metadata';
import { randomImage, randomName } from 'lib/Random';
import { ethers } from 'ethers';

//- Type Imports
import { DomainRequestContents, DisplayDomainRequest } from 'lib/types';

//- Style Imports
import styles from './RequestTable.module.css';

//- Asset Imports
import grid from './assets/grid.svg';
import list from './assets/list.svg';

type RequestTableProps = {
	requests: DomainRequestContents[];
	style?: React.CSSProperties;
	yours?: boolean;
};

interface RequestTableData extends DomainRequestContents {
	image?: string;
	title?: string;
}

// @TODO: Create a `Domain` type for `domains`
const RequestTable: React.FC<RequestTableProps> = ({
	requests,
	style,
	yours,
}) => {
	const { mvpVersion } = useMvpVersion();

	//////////////////
	// State / Refs //
	//////////////////

	const containerRef = useRef<HTMLDivElement>(null);
	const [containerHeight, setContainerHeight] = useState(0);
	const [isGridView, setIsGridView] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [viewing, setViewing] = useState<DisplayDomainRequest | undefined>();

	const [loadedRequests, setLoadedRequests] = useState<
		DisplayDomainRequest[] | undefined
	>();

	// Table Data
	const rowData: DisplayDomainRequest[] = useMemo(() => {
		if (searchQuery.length && loadedRequests && loadedRequests.length) {
			return loadedRequests.filter((r) => {
				if (!r || !r.title) return false;
				const s = (r.title + r.domainName).toLowerCase();
				return s.indexOf(searchQuery.toLowerCase()) > -1;
			});
		}
		return loadedRequests || [];
	}, [loadedRequests, searchQuery]);
	const data = useMemo<DisplayDomainRequest[]>(() => rowData, [rowData]);

	///////////////
	// Functions //
	///////////////

	const setList = () => setIsGridView(false);
	const setGrid = () => setIsGridView(true);

	const view = (domainName: string) => {
		if (loadedRequests) {
			const r = loadedRequests?.filter((d) => d.domainName === domainName)[0];
			setViewing(r);
		}
	};

	const onAccept = () => {
		setViewing(undefined);
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (requests.length === 0) {
			setLoadedRequests([]);
			return;
		}

		var count = 0;
		var total = requests.filter((d: any) => d.metadata).length;
		for (var i = 0; i < requests.length; i++) {
			const row = requests[i] as DisplayDomainRequest;
			if (!row.metadata) continue;
			// eslint-disable-next-line no-loop-func
			getMetadata(row.metadata).then((d) => {
				if (!row || !d || !d.image || !d.title)
					return console.warn('Invalid metadata for domain ' + row.domain);
				row.image = d.image;
				row.title = d.title;
				if (++count === total) {
					setLoadedRequests(requests);
				}
			});
		}
	}, [requests, mvpVersion]);

	useEffect(() => {
		const el = containerRef.current;
		if (el)
			setContainerHeight(isGridView ? el.clientHeight + 30 : el.clientHeight);
	}, [rowData, requests, mvpVersion]);

	const columns = useMemo<Column<DisplayDomainRequest>[]>(
		() => [
			{
				id: 'index',
				accessor: (d: any, i: any) => <span>{i + 1}</span>,
			},
			{
				Header: () => <div className={styles.left}>Creator</div>,
				id: 'creator',
				accessor: (d: any) => (
					<Member
						id={d.requestor}
						name={'Hello'}
						image={randomImage(d.requestor)}
						subtext={
							mvpVersion === 3
								? randomName(d.requestor).substring(0, 3).toUpperCase()
								: ''
						}
					/>
				),
			},
			{
				Header: () => <div className={styles.left}>Artwork Info</div>,
				id: 'title',
				accessor: (d: any) =>
					d.image ? (
						<Artwork
							id={d.domain}
							name={d.title ? d.title : ''}
							image={d.image ? d.image : ''}
							domain={d.domainName ? `0://${d.domainName}` : ''}
							pending
						/>
					) : (
						<></>
					),
			},
			{
				Header: () => <div className={styles.left}>Request Date</div>,
				id: 'date',
				accessor: (d: any) => (
					<div className={styles.left}>13.03.2021 08:22</div>
				),
			},
			{
				Header: () => <div className={styles.right}>Staked Tokens</div>,
				id: 'stakeAmount',
				accessor: (d) => (
					<div className={styles.right}>
						{Number(ethers.utils.formatEther(d.stakeAmount)).toLocaleString()}{' '}
						WILD
					</div>
				),
			},
			{
				id: 'accepted',
				accessor: (d: any) => (
					<div className={styles.center}>
						{d.accepted && (
							<div className={styles.Accepted}>
								<span>Accepted</span>
								<br />
								<span>13.03.2021 08:22</span>
							</div>
						)}
						{!d.accepted && (
							<FutureButton
								style={{ textTransform: 'uppercase' }}
								glow
								onClick={() => view(d.domainName)}
							>
								View Offer
							</FutureButton>
						)}
					</div>
				),
			},
		],
		[rowData],
	);

	// React-Table Hooks
	const tableHook = useTable<DisplayDomainRequest>(
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

	const search = (query: string) => {
		setSearchQuery(query);
	};

	return (
		<div style={style} className={styles.RequestTableContainer}>
			{viewing && (
				<Overlay
					centered
					open
					onClose={() => {
						setViewing(undefined);
					}}
				>
					<Request onAccept={onAccept} yours={yours} request={viewing} />
				</Overlay>
			)}
			{/* Table Header */}
			<div className={styles.searchHeader}>
				<SearchBar
					onChange={(event: any) => search(event.target.value)}
					style={{ width: '100%', marginRight: 16 }}
				/>
				<div className={styles.searchHeaderButtons}>
					{/* <IconButton
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
					/> */}
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
					{/* {isGridView && (
						<ol className={styles.Grid}>
							{data.map((d, i) => (
								<li key={i}>
									<NFTCard
										name={d.title || ''}
										domain={d.domainName || ''}
										imageUri={d.image || ''}
										price={100}
										nftOwnerId={d.requestor}
										nftMinterId={d.requestor}
										showCreator
										showOwner
									/>
								</li>
							))}
						</ol>
					)} */}
				</div>
				<div
					style={{ height: containerHeight }}
					className={styles.Expander}
				></div>
			</div>
		</div>
	);
};

export default RequestTable;
