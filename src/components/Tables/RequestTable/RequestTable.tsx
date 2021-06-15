import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Column, useTable, useGlobalFilter, useFilters } from 'react-table';

//- Component Imports
import {
	Artwork,
	SearchBar,
	IconButton,
	Member,
	FilterButton,
	FutureButton,
	OptionDropdown,
	Overlay,
	NFTCard,
} from 'components';
import { Request } from 'containers';

//- Library Imports
import useMvpVersion from 'lib/hooks/useMvpVersion';
import { getMetadata } from 'lib/metadata';
import { randomImage, randomName } from 'lib/Random';
import { ethers } from 'ethers';
import { useStakingController } from 'lib/hooks/useStakingController';

//- Type Imports
import {
	DomainRequestContents,
	DisplayDomainRequestAndContents,
	DomainRequestAndContents,
} from 'lib/types';

//- Style Imports
import styles from './RequestTable.module.css';

//- Asset Imports
import grid from './assets/grid.svg';
import list from './assets/list.svg';

type RequestTableProps = {
	requests: DomainRequestAndContents[];
	style?: React.CSSProperties;
	yours?: boolean;
};

interface RequestTableData extends DisplayDomainRequestAndContents {
	image?: string;
	title?: string;
}

// @TODO: Create a `Domain` type for `domains`
const RequestTable: React.FC<RequestTableProps> = ({
	requests,
	style,
	yours,
}) => {
	//////////////////
	// Custom Hooks //
	//////////////////

	const { mvpVersion } = useMvpVersion();
	const { approveRequest } = useStakingController();

	//////////////////
	// State / Refs //
	//////////////////

	const containerRef = useRef<HTMLDivElement>(null);
	const [containerHeight, setContainerHeight] = useState(0);
	const [isGridView, setIsGridView] = useState(false);
	const [isGridViewToggleable, setIsGridViewToggleable] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<any>({});
	const [viewing, setViewing] = useState<
		DisplayDomainRequestAndContents | undefined
	>();

	const [loadedRequests, setLoadedRequests] = useState<
		DisplayDomainRequestAndContents[]
	>([]);

	// Table Data
	const displayData: DisplayDomainRequestAndContents[] = useMemo(() => {
		if (
			(searchQuery.length || statusFilter.length) &&
			loadedRequests &&
			loadedRequests.length
		) {
			var filtered = loadedRequests;

			// Filter per search string
			if (searchQuery.length) {
				filtered = filtered.filter((r) => {
					const s = (r.metadata.title + r.request.domain).toLowerCase();
					return s.indexOf(searchQuery.toLowerCase()) > -1;
				});
			}

			// Filter per status
			if (statusFilter.length) {
				const approved = statusFilter === 'Accepted';
				filtered = filtered.filter((r) => r.request.approved === approved);
			}
			return filtered;
		}
		return loadedRequests || [];
	}, [loadedRequests, searchQuery, statusFilter]);

	const handleResize = () => {
		if (window.innerWidth < 1416) {
			setList();
			setIsGridViewToggleable(false);
		} else {
			setIsGridViewToggleable(true);
		}
	};

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	///////////////
	// Functions //
	///////////////

	const setList = () => setIsGridView(false);
	const setGrid = () => setIsGridView(true);
	const dateFromTimestamp = (timestamp: string) =>
		new Date(Number(timestamp) * 1000).toLocaleString();

	const view = (domainName: string) => {
		if (loadedRequests) {
			const r = loadedRequests?.filter(
				(d) => d.request.domain === domainName,
			)[0];
			setViewing(r);
		}
	};

	const onAccept = async (id: string) => {
		try {
			const t = await approveRequest(id);
			setViewing(undefined);
		} catch (e) {
			// Catch thrown when user rejects transaction
			console.error(e);
		}
	};

	const search = (query: string) => {
		setSearchQuery(query);
	};

	const filterByStatus = (filter: string) => {
		setStatusFilter(filter);
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (requests.length === 0) {
			setLoadedRequests([]);
			return;
		}

		let finishedCount = 0;

		const completedLoading: DisplayDomainRequestAndContents[] = [];

		for (let i = 0; i < requests.length; i++) {
			// eslint-disable-next-line no-loop-func
			const doGetMetadata = async () => {
				const request = requests[i] as DisplayDomainRequestAndContents;

				const metadata = await getMetadata(request.contents.metadata);
				if (metadata) {
					const displayRequest: DisplayDomainRequestAndContents = {
						...request,
						metadata,
					};

					completedLoading.push(displayRequest);
				} else {
					console.warn(
						'Unable to fetch metadata for domain ' + request.contents.domain,
					);
				}

				++finishedCount;

				if (finishedCount === requests.length) {
					setLoadedRequests(completedLoading);
				}
			};

			doGetMetadata();
		}
	}, [requests, mvpVersion]);

	useEffect(() => {
		const el = containerRef.current;
		if (el)
			setContainerHeight(isGridView ? el.clientHeight + 30 : el.clientHeight);
	}, [displayData, requests, mvpVersion, isGridView]);

	const columns = useMemo<Column<DisplayDomainRequestAndContents>[]>(
		() => [
			{
				id: 'index',
				accessor: (d: DisplayDomainRequestAndContents, i: number) => (
					<span>{i + 1}</span>
				),
			},
			{
				Header: () => <div className={styles.left}>Creator</div>,
				id: 'creator',
				accessor: (d: DisplayDomainRequestAndContents) => (
					<Member
						id={d.request.requestor.id}
						name={'requestor'}
						image={randomImage(d.request.requestor.id)}
						subtext={
							mvpVersion === 3
								? randomName(d.request.requestor.id)
										.substring(0, 3)
										.toUpperCase()
								: ''
						}
					/>
				),
			},
			{
				Header: () => <div className={styles.left}>Artwork Info</div>,
				id: 'title',
				accessor: (d: DisplayDomainRequestAndContents) =>
					d.metadata.image ? (
						<Artwork
							id={d.request.domain}
							name={d.metadata.title ?? ''}
							image={d.metadata.image ?? ''}
							domain={d.request.domain ? `0://${d.request.domain}` : ''}
							pending
						/>
					) : (
						<></>
					),
			},
			{
				Header: () => <div className={styles.left}>Request Date</div>,
				id: 'date',
				accessor: (d: DisplayDomainRequestAndContents) => {
					return (
						<div className={styles.left}>
							{dateFromTimestamp(d.request.timestamp)}
						</div>
					);
				},
			},
			{
				Header: () => <div className={styles.right}>Staked Tokens</div>,
				id: 'stakeAmount',
				accessor: (d: DisplayDomainRequestAndContents) => (
					<div className={styles.right}>
						{Number(
							ethers.utils.formatEther(d.request.offeredAmount),
						).toLocaleString()}{' '}
						WILD
					</div>
				),
			},
			{
				id: 'accepted',
				accessor: (d: DisplayDomainRequestAndContents) => (
					<div className={styles.center}>
						{d.request.approved && (
							<div className={styles.Accepted}>
								<span>Accepted</span>
								<br />
								<span>13.03.2021 08:22</span>
							</div>
						)}
						{!d.request.approved && (
							<FutureButton
								style={{ textTransform: 'uppercase' }}
								glow
								onClick={() => view(d.request.domain)}
							>
								View Offer
							</FutureButton>
						)}
					</div>
				),
			},
		],
		[displayData],
	);

	// React-Table Hooks
	const tableHook = useTable<DisplayDomainRequestAndContents>(
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
		setGlobalFilter,
	} = tableHook;

	return (
		<div style={style} className={styles.RequestTableContainer}>
			{/* Viewing overlay */}
			{viewing && (
				<Overlay
					centered
					open
					onClose={() => {
						setViewing(undefined);
					}}
				>
					<Request
						onAccept={onAccept}
						yours={yours || viewing.request.approved}
						request={viewing}
					/>
				</Overlay>
			)}

			{/* Table Header */}
			<div className={styles.searchHeader}>
				<SearchBar
					onChange={(event: any) => search(event.target.value)}
					style={{ width: '100%', marginRight: 16 }}
				/>
				<div className={styles.searchHeaderButtons}>
					<OptionDropdown
						onSelect={filterByStatus}
						options={['Open Requests', 'Accepted']}
					>
						<FilterButton onClick={() => {}} />
					</OptionDropdown>
					{isGridViewToggleable && (
						<>
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
						</>
					)}
				</div>
			</div>

			{/* Standard React-Table setup */}
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
										<tr
											onClick={() => view(row.original.request.domain)}
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
							{displayData.map((d, i) => (
								<li key={i} onClick={() => view(d.request.domain)}>
									<NFTCard
										name={d.metadata.title || ''}
										domain={d.request.domain || ''}
										imageUri={d.metadata.image || ''}
										price={100}
										nftOwnerId={d.contents.requestor}
										nftMinterId={d.contents.requestor}
										showCreator
										showOwner
										style={{ width: 380 }}
									>
										{/* @TODO Refactor this horrific section */}
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												marginTop: 32,
											}}
										>
											<span
												style={{
													display: 'inline-block',
													fontWeight: 700,
													color: d.request.approved
														? 'var(--color-success)'
														: 'var(--color-primary-lighter-3)',
													textTransform: 'uppercase',
													fontSize: 14,
													marginTop: 4,
												}}
											>
												Offer {d.request.approved ? 'Accepted' : 'Made'}
											</span>
											<span
												className="glow-text-blue"
												style={{
													display: 'inline-block',
													fontWeight: 700,
													fontSize: 24,
													marginTop: 4,
												}}
											>
												{Number(
													ethers.utils.formatEther(d.request.offeredAmount),
												).toLocaleString()}{' '}
												WILD
											</span>
											<span
												style={{
													display: 'inline-block',
													fontSize: 12,
													marginTop: 4,
												}}
											>
												{dateFromTimestamp(d.request.timestamp)}
											</span>
											<FutureButton
												style={{
													maxWidth: 200,
													marginTop: 24,
													textTransform: 'uppercase',
												}}
												glow
												onClick={() => view(d.request.domain)}
											>
												View Offer
											</FutureButton>
										</div>
									</NFTCard>
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

export default RequestTable;
