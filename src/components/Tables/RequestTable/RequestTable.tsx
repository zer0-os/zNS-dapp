/* eslint-disable react-hooks/exhaustive-deps */
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
	Confirmation,
} from 'components';
import { Request } from 'containers';

//- Library Imports
import useMvpVersion from 'lib/hooks/useMvpVersion';
import { getMetadata } from 'lib/metadata';
import { randomImage, randomName } from 'lib/Random';
import { BigNumber, ethers } from 'ethers';
import { useStakingProvider } from 'lib/providers/StakingRequestProvider';
import useNotification from 'lib/hooks/useNotification';

//- Type Imports
import {
	DisplayDomainRequestAndContents,
	DomainRequestAndContents,
} from 'lib/types';

//- Style Imports
import styles from './RequestTable.module.css';

//- Asset Imports
import grid from './assets/grid.svg';
import list from './assets/list.svg';
import { useZnsContracts } from 'lib/contracts';
import { useWeb3React } from '@web3-react/core';

type RequestTableProps = {
	requests: DomainRequestAndContents[];
	style?: React.CSSProperties;
	yours?: boolean;
	isLoading?: boolean;
};

const RequestTable: React.FC<RequestTableProps> = ({
	requests,
	style,
	yours,
	isLoading,
}) => {
	//////////////////
	// Custom Hooks //
	//////////////////
	const { account } = useWeb3React();
	const { mvpVersion } = useMvpVersion();
	const staking = useStakingProvider();
	const znsContracts = useZnsContracts()!;
	const wildToken = znsContracts.wildToken;
	const { addNotification } = useNotification();

	//////////////////
	// State / Refs //
	//////////////////

	const containerRef = useRef<HTMLDivElement>(null);
	const [containerHeight, setContainerHeight] = useState(0);
	const [isGridView, setIsGridView] = useState(false);
	const [isGridViewToggleable, setIsGridViewToggleable] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('');

	// The request we're viewing in the request modal
	const [viewing, setViewing] = useState<
		DisplayDomainRequestAndContents | undefined
	>();

	// The Token that we need to approve the staking controller to transfer
	const [approveTokenTransfer, setApproveTokenTransfer] = useState<
		string | undefined
	>();

	// The requests that we have loaded (pulled from chain and grabbed metadata from IFPS)
	const [loadedRequests, setLoadedRequests] = useState<
		DisplayDomainRequestAndContents[]
	>([]);

	///////////////
	// Functions //
	///////////////

	// Disables grid view when we hit a certain breakpoint
	const handleResize = () => {
		if (window.innerWidth < 1416) {
			setList();
			setIsGridViewToggleable(false);
		} else {
			setIsGridViewToggleable(true);
		}
	};

	const setList = () => setIsGridView(false); // Opens list view
	const setGrid = () => setIsGridView(true); // Opens grid view

	const dateFromTimestamp = (timestamp: string) =>
		new Date(Number(timestamp) * 1000).toLocaleString();

	// Opens a request in the request modal
	const view = (domainName: string) => {
		if (loadedRequests) {
			const r = loadedRequests?.filter(
				(d) => d.request.domain === domainName,
			)[0];
			setViewing(r);
		}
	};

	/* Calls the middleware for approving a request
		 This is passed to the Request modal */
	const onApprove = async (request: DomainRequestAndContents) => {
		try {
			await staking.approveRequest(request);
			setViewing(undefined);
		} catch (e) {
			// Catch thrown when user rejects transaction
			console.error(e);
		}
	};

	/**
	 * Creates Transaction to approve the Staking Controller to transfer
	 * tokens on behalf of the user.
	 */
	const onApproveTokenTransfer = async () => {
		try {
			await wildToken.approve(
				znsContracts.stakingController.address,
				ethers.constants.MaxUint256,
			);
		} catch (e) {
			console.error(e);
		}
	};

	const onFulfill = async (request: DomainRequestAndContents) => {
		const allowance = await wildToken.allowance(
			account!,
			znsContracts.stakingController.address,
		);

		if (allowance.lt(request.request.offeredAmount)) {
			setApproveTokenTransfer(wildToken.address);
			return;
		}

		try {
			await staking.fulfillRequest(request);
			setViewing(undefined);
		} catch (e) {
			// Catch thrown when user rejects transaction
			console.error(e);
		}
	};

	/* Sets some search parameters 
		 There's a hook listening to each of these variables */
	const search = (query: string) => setSearchQuery(query);
	const filterByStatus = (filter: string) => setStatusFilter(filter);

	/////////////
	// Effects //
	/////////////

	// Listen for window resizes and handle them
	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (requests.length === 0) return setLoadedRequests([]);

		let finishedCount = 0; // Count of requests we have pulled data for
		const completedLoading: DisplayDomainRequestAndContents[] = []; // Requests that have finished loading

		/* Loop through each request, 
			 pull the data from IPFS, 
			 stash it in completedLoading,
			 update table data when completed */
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
						`Unable to fetch metadata for domain: ${request.contents.domain}`,
					);
				}

				if (++finishedCount === requests.length) {
					setLoadedRequests(completedLoading);
				}
			};

			doGetMetadata();
		}
	}, [requests, mvpVersion]);

	/////////////////
	// React-Table //
	/////////////////

	// Table Data
	const displayData: DisplayDomainRequestAndContents[] = useMemo(() => {
		if (
			(searchQuery.length || (statusFilter.length && statusFilter !== 'All')) &&
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
			if (statusFilter.length && statusFilter !== 'All') {
				const approved = statusFilter === 'Accepted';
				filtered = filtered.filter((r) => r.request.approved === approved);
			}
			// @TODO Move sorting to React-Table built-in sorting
			return filtered.sort(
				(a, b) => Number(b.request.timestamp) - Number(a.request.timestamp),
			);
		}
		return (
			loadedRequests.sort(
				(a, b) => Number(b.request.timestamp) - Number(a.request.timestamp),
			) || []
		);
	}, [loadedRequests, searchQuery, statusFilter]);

	// Column Setup
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
				accessor: (d: DisplayDomainRequestAndContents) => (
					<Artwork
						id={d.request.domain}
						name={d.metadata.title ?? ''}
						image={d.metadata.image ?? ''}
						domain={d.request.domain ? `0://${d.request.domain}` : ''}
						pending
					/>
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
						{/*  */}
						{d.request.approved && !yours && (
							<div className={styles.Accepted}>
								<span>Accepted</span>
								<br />
								<span>{dateFromTimestamp(d.request.timestamp)}</span>
							</div>
						)}
						{/* Is Fulfilled */}
						{d.request.fulfilled && (
							<div className={styles.Accepted}>
								<span>Fulfilled</span>
								<br />
								<span>{dateFromTimestamp(d.request.timestamp)}</span>
							</div>
						)}
						{/* Needs Fulfilling */}
						{d.request.approved && yours && !d.request.fulfilled && (
							<FutureButton
								style={{ textTransform: 'uppercase' }}
								glow
								onClick={() => view(d.request.domain)}
							>
								Fulfill
							</FutureButton>
						)}
						{/* Needs Approving */}
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

	// React-Table Config
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
	} = tableHook;

	// @TODO Remove this functionality - it's legacy from DomainTable
	useEffect(() => {
		const el = containerRef.current;
		if (el)
			setContainerHeight(isGridView ? el.clientHeight + 30 : el.clientHeight);
	}, [displayData, requests, mvpVersion, isGridView]);

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
						onApprove={onApprove}
						onFulfill={onFulfill}
						yours={yours || viewing.request.approved}
						request={viewing}
					/>
				</Overlay>
			)}
			{/* Approve Token Transfer Overlay */}
			{approveTokenTransfer && (
				<Overlay
					centered
					open
					onClose={() => {
						setApproveTokenTransfer(undefined);
					}}
				>
					<Confirmation
						title={'Approve Token Transfer'}
						onConfirm={() => {
							onApproveTokenTransfer();
						}}
						onCancel={() => {
							setApproveTokenTransfer(undefined);
						}}
					>
						<p>
							You must approve zNS to transfer your WILD tokens before minting
							this domain.
						</p>
					</Confirmation>
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
						options={['All', 'Open Requests', 'Accepted']}
						drawerStyle={{ width: 179 }}
					>
						<FilterButton onClick={() => {}}>
							{statusFilter || 'All'}
						</FilterButton>
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
								{!isLoading &&
									rows.map((row) => {
										prepareRow(row);
										return (
											<tr
												onClick={() => view(row.original.request.domain)}
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
					{!isLoading && requests.length === 0 && (
						<p className={styles.Message}>Nothing here!</p>
					)}
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

export default RequestTable;
