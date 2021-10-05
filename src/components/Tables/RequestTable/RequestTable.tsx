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
	Spinner,
	Confirmation,
} from 'components';
import RequestActions from './components/RequestActions';
import { Request } from 'containers';

//- Library Imports
import { getRequestData } from './data';
import {
	useRequestsMadeByAccount,
	useRequestsForOwnedDomains,
} from 'lib/hooks/useDomainRequestsSubgraph';
import { ethers } from 'ethers';
import { useStakingProvider } from 'lib/providers/StakingRequestProvider';

//- Type Imports
import { DomainRequestAndContents } from 'lib/types';

//- Style Imports
import styles from './RequestTable.module.css';

//- Asset Imports
import grid from './assets/grid.svg';
import list from './assets/list.svg';
import { useZnsContracts } from 'lib/contracts';
import { useWeb3React } from '@web3-react/core';

type RequestTableProps = {
	style?: React.CSSProperties;
	userId: string;
	onNavigate: (domain: string) => void;
};

const RequestTable: React.FC<RequestTableProps> = ({
	style,
	userId,
	onNavigate,
}) => {
	//////////////////
	// Custom Hooks //
	//////////////////
	const { account } = useWeb3React();
	const staking = useStakingProvider();
	const znsContracts = useZnsContracts()!;
	const yourRequests = useRequestsMadeByAccount(userId);
	const requestsForYou = useRequestsForOwnedDomains(userId);
	const lootToken = znsContracts.lootToken;

	//////////////////
	// State / Refs //
	//////////////////

	const containerRef = useRef<HTMLDivElement>(null);

	const [isGridView, setIsGridView] = useState(false);
	const [isGridViewToggleable, setIsGridViewToggleable] = useState(true);
	const [isApproving, setIsApproving] = useState(false);
	const [approvingText, setApprovingText] = useState(
		'Please confirm transaction in wallet',
	);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();
	// Searching
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [domainFilter, setDomainFilter] = useState('All Domains');

	const [isLoading, setIsLoading] = useState(false); // Not needed anymore?

	const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
	// The request we're viewing in the request modal
	const [viewing, setViewing] = useState<
		DomainRequestAndContents | undefined
	>();

	// The Token that we need to approve the staking controller to transfer
	const [approveTokenTransfer, setApproveTokenTransfer] = useState<
		string | undefined
	>();

	// The requests that we have loaded (pulled from chain and grabbed metadata from IFPS)
	const [loadedRequests, setLoadedRequests] = useState<
		DomainRequestAndContents[]
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
		setErrorMessage(undefined);
		setShowLoadingIndicator(true); //displays loading indicator on overlay
		try {
			await staking.approveRequest(request);
			setViewing(undefined);
		} catch (e) {
			// Catch thrown when user rejects transaction
			console.error(e);
			if (e.message.includes('code: 4001')) {
				setErrorMessage(`Rejected by wallet`);
			} else {
				setErrorMessage(`Failed to submit transaction.`);
			}
		}
		setShowLoadingIndicator(false);
	};

	/**
	 * Creates Transaction to approve the Staking Controller to transfer
	 * tokens on behalf of the user.
	 */
	const onApproveTokenTransfer = async () => {
		setErrorMessage(undefined);
		setIsApproving(true); //start loading indicator
		try {
			const approveTx = await lootToken.approve(
				znsContracts.stakingController.address,
				ethers.constants.MaxUint256,
			);
			setApprovingText('Waiting for transaction to complete');
			await approveTx.wait();
			setApproveTokenTransfer(undefined); //close modal
		} catch (e) {
			console.error(e);
			//if user rejects transaction
			if (e.code === 4001) {
				setErrorMessage(`Rejected by wallet`);
			} else {
				setErrorMessage(`Failed to submit transaction.`);
			}
		}
		setIsApproving(false); //stop loading indicator

		setApprovingText('Please confirm transaction in wallet');
	};

	const onFulfill = async (request: DomainRequestAndContents) => {
		setErrorMessage(undefined);
		const allowance = await lootToken.allowance(
			account!,
			znsContracts.stakingController.address,
		);

		if (allowance.lt(request.request.offeredAmount)) {
			setApproveTokenTransfer(lootToken.address);
			return;
		}
		setShowLoadingIndicator(true); //displays loading indicator on overlay
		try {
			await staking.fulfillRequest(request);
			setViewing(undefined);
		} catch (e) {
			console.error(e);
			//if user rejects transaction
			if (e.message.includes('code: 4001')) {
				setErrorMessage(`Rejected by wallet`);
			} else {
				setErrorMessage(`Failed to submit transaction.`);
			}
		}

		setShowLoadingIndicator(false);
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
				requestsForYou.refresh();
			}
		}, 5000);

		return () => {
			isSubscribed = false;
		};
	}, [staking.approved]);

	// Listen for window resizes and handle them
	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		setIsLoading(true);
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

		if (requests.length === 0) {
			setLoadedRequests([]);
			setIsLoading(false);
			return;
		}

		getRequestData(requests).then((d: any) => {
			if (d) {
				setLoadedRequests(d);
			} else {
				console.error('Failed to retrieve request data');
			}
			setIsLoading(false);
		});
	}, [yourRequests.requests, requestsForYou.requests, domainFilter]);

	/////////////////
	// React-Table //
	/////////////////

	// Table Data
	const displayData: DomainRequestAndContents[] = useMemo(() => {
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
					const s = r.request.domain.toLowerCase();
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
	const columns = useMemo<Column<DomainRequestAndContents>[]>(
		() => [
			{
				id: 'index',
				accessor: (d: DomainRequestAndContents, i: number) => (
					<span>{i + 1}</span>
				),
			},
			{
				Header: () => <div className={styles.left}>Creator</div>,
				id: 'creator',
				accessor: (d: DomainRequestAndContents) => (
					<Member id={d.request.requestor.id} name={''} image={''} />
				),
			},
			{
				Header: () => <div className={styles.left}>Artwork Info</div>,
				id: 'title',
				accessor: (d: DomainRequestAndContents) => (
					<Artwork
						id={d.request.domain}
						disableInteraction
						metadataUrl={d.contents.metadata}
						domain={d.request.domain ? `0://${d.request.domain}` : ''}
						pending
					/>
				),
			},
			{
				Header: () => <div className={styles.left}>Request Date</div>,
				id: 'date',
				accessor: (d: DomainRequestAndContents) => {
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
				accessor: (d: DomainRequestAndContents) => (
					<div className={styles.right}>
						{Number(
							ethers.utils.formatEther(d.request.offeredAmount),
						).toLocaleString()}{' '}
						LOOT
					</div>
				),
			},
			{
				Header: () => <div className={styles.center}>Status</div>,
				id: 'accepted',
				accessor: (d: DomainRequestAndContents) => (
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
	const tableHook = useTable<DomainRequestAndContents>(
		{ columns, data: displayData },
		useFilters,
		useGlobalFilter,
	);
	const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
		tableHook;

	return (
		<div style={style} className={styles.RequestTableContainer}>
			{/* Viewing overlay */}
			{viewing && (
				<Overlay
					centered
					open
					onClose={() => {
						setViewing(undefined);
						setErrorMessage(undefined);
					}}
				>
					<Request
						onApprove={onApprove}
						onFulfill={onFulfill}
						onNavigate={onNavigate}
						errorText={errorMessage}
						request={viewing}
						showLoadingIndicator={showLoadingIndicator}
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
						setErrorMessage(undefined);
					}}
				>
					<Confirmation
						title={'Approve Token Transfer'}
						showLoading={isApproving}
						loadingText={approvingText}
						errorText={errorMessage}
						onConfirm={() => {
							onApproveTokenTransfer();
						}}
						onCancel={() => {
							setApproveTokenTransfer(undefined);
							setErrorMessage(undefined);
						}}
					>
						<p>
							You must approve zNS to transfer your LOOT tokens before minting
							this domain.
						</p>
					</Confirmation>
				</Overlay>
			)}

			{/* Table Header */}
			{!isLoading && (
				<div className={styles.searchHeader}>
					<SearchBar
						onChange={(event: any) => search(event.target.value)}
						style={{ width: '100%', marginRight: 16 }}
						placeholder="Search by domain name"
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
			)}

			{/* Standard React-Table setup */}
			<div className={styles.RequestTable}>
				<div className={styles.Container} ref={containerRef}>
					{/* List View */}
					{!isLoading && !isGridView && (
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
					{/* @todo re-enable grid view */}
					{!isLoading && isGridView && (
						<ol className={styles.Grid}>
							{displayData.map((d, i) => (
								<li key={i} onClick={() => view(d.request.domain)}>
									<NFTCard
										actionsComponent={
											<RequestActions onClick={view} request={d} />
										}
										metadataUrl={d.contents.metadata}
										domain={d.request.domain}
										price={100}
										nftOwnerId={d.contents.requestor}
										nftMinterId={d.contents.requestor}
										showCreator
										showOwner
										style={{ width: 380 }}
									/>
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
						<>
							<p style={{ paddingBottom: 16 }} className={styles.Message}>
								Loading Your Offers
							</p>
							<Spinner style={{ margin: '0 auto' }} />
						</>
					)}

					{/* Empty Table Message */}
					{/* {!isLoading && requests.length === 0 && (
						<p className={styles.Message}>Nothing here!</p>
					)} */}
				</div>
			</div>
		</div>
	);
};

export default RequestTable;
