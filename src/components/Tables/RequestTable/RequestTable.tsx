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
import { randomImage, randomName } from 'lib/Random';
import { getRequestData } from './data';
import {
	useRequestsMadeByAccount,
	useRequestsForOwnedDomains,
} from 'lib/hooks/useDomainRequestsSubgraph';
import { ethers } from 'ethers';
import { useStakingProvider } from 'lib/providers/StakingRequestProvider';

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
import { getDomainData } from 'lib/useDomainStore';
import { useSubgraphProvider } from 'lib/providers/SubgraphProvider';

type RequestTableProps = {
	style?: React.CSSProperties;
	userId: string;
};

const RequestTable: React.FC<RequestTableProps> = ({ style, userId }) => {
	//////////////////
	// Custom Hooks //
	//////////////////
	const { account } = useWeb3React();
	const { mvpVersion } = useMvpVersion();
	const staking = useStakingProvider();
	const znsContracts = useZnsContracts()!;
	const yourRequests = useRequestsMadeByAccount(userId);
	const requestsForYou = useRequestsForOwnedDomains(userId);
	const wildToken = znsContracts.wildToken;

	const apolloClientInstance = useSubgraphProvider()

	//////////////////
	// State / Refs //
	//////////////////

	const containerRef = useRef<HTMLDivElement>(null);
	const [containerHeight, setContainerHeight] = useState(0); // Not needed anymore?

	const [isGridView, setIsGridView] = useState(false);
	const [isGridViewToggleable, setIsGridViewToggleable] = useState(true);

	// Searching
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [domainFilter, setDomainFilter] = useState('');

	const [isLoading, setIsLoading] = useState(false); // Not needed anymore?
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
	const filterByDomain = (filter: string) => setDomainFilter(filter);

	/////////////
	// Effects //
	/////////////

	// Refresh data 5 seconds after a request is approved
	// This is hopefully enough time for the subgraph to update
	React.useEffect(() => {
		let isSubscribed = true;
		setTimeout(() => {
			if (isSubscribed) {
				yourRequests.refresh();
				requestsForYou.refresh();
			}
		}, 5000);

		return () => {
			isSubscribed = false;
		};
	}, [staking.approved, yourRequests, requestsForYou]);

	// Listen for window resizes and handle them
	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const i = yourRequests.requests?.domainRequests || [];
		const j =
			requestsForYou.requests?.domains.map((d) => d.requests).flat() || [];

		var requests = [];
		if (domainFilter === 'All Domains') {
			requests = i.concat(j);
		} else if (domainFilter === 'Your Domains') {
			requests = j;
		} else {
			requests = i;
		}

		if (requests.length === 0) return setLoadedRequests([]);
		getRequestData(requests).then((d: any) => {
			if (d) {
				setLoadedRequests(d);
			} else {
				console.error('Failed to retrieve request data');
			}
		});
	}, [yourRequests.requests, requestsForYou.requests, domainFilter]);

	//sample effect to check that the function fetchs the domain data of an example id
	useEffect(() => {
		const domainDataFetch = async () => {
		for(let i = 0; i<5;i++){ //hardcoded for to check that it calls good in a loop

		//below it will await for a data fetch for the provided id in the first argument, calling the apolloClientInstance we created
		const tx = await getDomainData("0x4af784d213e0b2ac71d9d35cc2f0792469e21f78ad13d0b776be2da504c143a1", apolloClientInstance.client)
		console.log("your data fetch number " + i + " is: " + tx)
		}
	}
	}, []);

	/////////////////
	// React-Table //
	/////////////////

	// Table Data
	const displayData: DisplayDomainRequestAndContents[] = useMemo(() => {
		if (
			(searchQuery.length ||
				(statusFilter.length && statusFilter !== 'All Statuses')) &&
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
			if (statusFilter.length && statusFilter !== 'All Statuses') {
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
							{dateFromTimestamp(d.request.timestamp).split(',')[0]}
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
						{/* Fulfilled domain requests */}
						{d.request.fulfilled && (
							<div className={styles.Accepted}>
								<span>Fulfilled</span>
								<br />
								<span>{dateFromTimestamp(d.request.timestamp)}</span>
							</div>
						)}

						{/* Your request - approved */}
						{d.request.approved &&
							!d.request.fulfilled &&
							d.contents.requestor === userId && (
								<FutureButton
									style={{ textTransform: 'uppercase' }}
									glow
									onClick={() => view(d.request.domain)}
								>
									Fulfill
								</FutureButton>
							)}

						{d.request.approved &&
							!d.request.fulfilled &&
							d.contents.requestor !== userId && (
								<div className={styles.Accepted}>
									<span>Accepted</span>
									<br />
									<span>{dateFromTimestamp(d.request.timestamp)}</span>
								</div>
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
						request={viewing}
						yours={viewing.contents.requestor === userId}
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
						onSelect={filterByDomain}
						options={['All Domains', 'Your Domains', 'Your Requests']}
						drawerStyle={{ width: 179 }}
					>
						<FilterButton onClick={() => {}}>
							{domainFilter || 'All Domains'}
						</FilterButton>
					</OptionDropdown>
					<OptionDropdown
						onSelect={filterByStatus}
						options={['All Statuses', 'Open Requests', 'Accepted']}
						drawerStyle={{ width: 179 }}
					>
						<FilterButton onClick={() => {}}>
							{statusFilter || 'All Statuses'}
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

export default RequestTable;
