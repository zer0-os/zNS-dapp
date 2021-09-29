/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useMemo, useRef } from 'react';

//- Library Imports
import { getRequestData } from './data';
import {
	useRequestsMadeByAccount,
	useRequestsForOwnedDomains,
} from '../../../lib/hooks/useDomainRequestsSubgraph';
import { useStakingProvider } from 'lib/providers/StakingRequestProvider';
import { useZnsContracts } from 'lib/contracts';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

//- Type Imports
import { DomainRequestAndContents } from '../../../lib/types';

// -Components
import RequestTableRow from './RequestTableRow';
import RequestTableCard from './RequestTableCard';
import { GenericTable, Overlay, Confirmation } from 'components';
import { Request } from 'containers';

type RequestTableProps = {
	style?: React.CSSProperties;
	userId: string;
	onNavigate: (domain: string) => void;
};

const RequestTable: React.FC<RequestTableProps> = ({ userId, onNavigate }) => {
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

	const [loadedRequests, setLoadedRequests] = useState<
		DomainRequestAndContents[]
	>([]);
	// The request we're viewing in the request modal
	const [viewing, setViewing] = useState<
		DomainRequestAndContents | undefined
	>();

	const [isLoading, setIsLoading] = useState(false); // Not needed anymore?
	const [approveError, setApproveError] = useState<string | undefined>();
	const [fulfillError, setFulfillError] = useState<string | undefined>();
	const [isApproving, setIsApproving] = useState(false);
	const [approvingText, setApprovingText] = useState(
		'Please confirm transaction in wallet',
	);
	const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

	// Searching
	const [statusFilter, setStatusFilter] = useState('');
	const [domainFilter, setDomainFilter] = useState('All Domains');

	// The Token that we need to approve the staking controller to transfer
	const [approveTokenTransfer, setApproveTokenTransfer] = useState<
		string | undefined
	>();

	const filterByStatus = (filter: string) => setStatusFilter(filter);
	const filterByDomain = (filter: string) => setDomainFilter(filter);

	const view = (domainName: string) => {
		if (loadedRequests) {
			const r = loadedRequests?.filter(
				(d) => d.request.domain === domainName,
			)[0];
			setViewing(r);
		}
	};

	const displayData: DomainRequestAndContents[] = useMemo(() => {
		if (
			statusFilter.length &&
			statusFilter !== 'All Statuses' &&
			loadedRequests &&
			loadedRequests.length
		) {
			var filtered = loadedRequests;

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
	}, [loadedRequests, statusFilter]);

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
		setApproveError(undefined);
		setIsApproving(true); //start loading indicator
		try {
			const approveTx = await lootToken.approve(
				znsContracts.stakingController.address,
				ethers.constants.MaxUint256,
			);
			setApprovingText('Waiting for transaction to complete');
			await approveTx.wait();
			setApproveTokenTransfer(undefined); //close modal
		} catch (e: any) {
			console.error(e);
			//if user rejects transaction
			if (e.code === 4001) {
				setApproveError(`Rejected by wallet`);
			} else {
				setApproveError(`Failed to submit transaction.`);
			}
		}
		setIsApproving(false); //stop loading indicator

		setApprovingText('Please confirm transaction in wallet');
	};

	const onFulfill = async (request: DomainRequestAndContents) => {
		setFulfillError(undefined);
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
		} catch (e: any) {
			console.error(e);
			//if user rejects transaction
			if (
				e.message ===
				'Failed to fulfill request: undefined MetaMask Tx Signature: User denied transaction signature.'
			) {
				setFulfillError(`Rejected by wallet`);
			} else {
				setFulfillError(`Failed to submit transaction.`);
			}
		}

		setShowLoadingIndicator(false);
	};

	return (
		<>
			{viewing && (
				<Overlay
					centered
					open
					onClose={() => {
						setViewing(undefined);
						setFulfillError(undefined);
					}}
				>
					<Request
						onApprove={onApprove}
						onFulfill={onFulfill}
						onNavigate={onNavigate}
						errorText={fulfillError}
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
						setApproveError(undefined);
					}}
				>
					<Confirmation
						title={'Approve Token Transfer'}
						showLoading={isApproving}
						loadingText={approvingText}
						errorText={approveError}
						onConfirm={() => {
							onApproveTokenTransfer();
						}}
						onCancel={() => {
							setApproveTokenTransfer(undefined);
							setApproveError(undefined);
						}}
					>
						<p>
							You must approve zNS to transfer your LOOT tokens before minting
							this domain.
						</p>
					</Confirmation>
				</Overlay>
			)}

			<GenericTable
				alignments={[0, 1, 1, 1, 0, 2]}
				headers={[
					' ',
					'CREATOR',
					'ARTWORK INFO',
					'REQUEST DATE',
					'STAKED TOKENS',
					'STATUS',
				]}
				data={displayData}
				rowComponent={RequestTableRow}
				view={view}
				gridComponent={RequestTableCard}
				isLoading={isLoading}
				isFilterRequired={true}
				filterByStatus={filterByStatus}
				optionsFilterByStatus={['All Statuses', 'Open Requests', 'Accepted']}
				filterByDomain={filterByDomain}
				optionsFilterByDomain={['All Domains', 'Your Domains', 'Your Requests']}
				filterCheckerDomain={domainFilter}
				filterCheckerStatus={statusFilter}
				dropDownColorText={'white'}
				adjustHeaderStatus={'44px'}
			/>
		</>
	);
};

export default RequestTable;
